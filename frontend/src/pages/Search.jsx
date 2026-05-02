import React, { useState, useEffect, useMemo } from 'react';
import api from '../api/axios';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MapPin, Filter, X, AlertTriangle, Crosshair, Wrench, Send, Navigation } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Map from '../components/Map';

// Haversine formula for accurate distance
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 3958.8; // Miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export default function Search() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMechanic, setSelectedMechanic] = useState(null);
  const [userLoc, setUserLoc] = useState(null);
  const [bookingModal, setBookingModal] = useState(null);
  const [issueDescription, setIssueDescription] = useState('');

  const fetchMechanics = async () => {
    try {
      const res = await api.get('/api/mechanics');
      const data = res.data;
      const formatted = data.map(m => ({
        id: m._id, 
        name: m.name, 
        rating: m.rating || 4.5,
        specialties: m.specialties || ["General Mechanic"],
        address: m.location?.address || "Street, India",
        lat: m.location?.lat || 20.5937, 
        lng: m.location?.lng || 78.9629,
        distance: 0
      }));
      setMechanics(formatted);
      
      // AUTO-TRIGGER GPS ON MOUNT
      handleDetectLocation(formatted);
    } catch (err) {
      toast.error("Failed to sync with grid");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      toast.error("Please login to access the Map Grid");
      navigate('/auth');
      return;
    }
    
    // If a mechanic accidentally comes here, send them to their dashboard
    if (user?.role === 'mechanic') {
      navigate('/dashboard');
      return;
    }

    fetchMechanics();
  }, [token, user]);

  const handleDetectLocation = (list = null) => {
    const targetList = list || mechanics;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLoc({ lat: latitude, lng: longitude });
        
        const updated = targetList.map(m => ({
          ...m,
          distance: parseFloat(calculateDistance(latitude, longitude, m.lat, m.lng).toFixed(1))
        })).sort((a, b) => a.distance - b.distance);
        
        setMechanics(updated);
        toast.success('Recommendation system active!');
      }, (err) => {
        console.warn("GPS Denied", err);
        toast.error("Enable GPS for distance recommendations");
      }, { timeout: 10000, enableHighAccuracy: true });
    }
  };

  const handleBook = async () => {
    if (!token) {
      toast.error("Please login to book a mechanic");
      navigate('/auth');
      return;
    }
    if (!issueDescription) return toast.error("Describe the issue!");

    const tid = toast.loading('Dispatching request...');
    try {
      const res = await api.post('/api/requests', {
        mechanicId: bookingModal.id,
        issueDescription,
        vehicleInfo: "User Vehicle",
        location: bookingModal.address
      });
      if (res.status === 201) {
        toast.success(`Request sent to ${bookingModal.name}!`, { id: tid });
        setBookingModal(null);
        setIssueDescription('');
      }
    } catch (err) { toast.error("Grid connection error", { id: tid }); }
  };

  const MechanicList = useMemo(() => (
    mechanics.map((m, idx) => (
      <div 
        key={m.id} 
        onClick={() => setSelectedMechanic(m)} 
        className={`p-4 rounded-2xl cursor-pointer border mb-3 transition-all ${selectedMechanic?.id === m.id ? 'bg-[#4F46E5]/20 border-[#4F46E5] shadow-[0_0_20px_rgba(79,70,229,0.2)]' : 'bg-white/5 border-white/5 hover:border-white/10'}`}
      >
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
             <h3 className="font-bold text-sm truncate">{m.name}</h3>
             <div className="flex items-center gap-1 mt-0.5">
               <Star size={10} className="text-yellow-400 fill-yellow-400" />
               <span className="text-[10px] text-[#94A3B8] font-bold">{m.rating}</span>
             </div>
          </div>
          <div className="text-right">
            <span className={`text-[10px] font-black px-2 py-0.5 rounded ${m.distance > 0 ? 'bg-[#22D3EE]/20 text-[#22D3EE]' : 'bg-white/5 text-[#94A3B8]'}`}>
              {m.distance > 0 ? `${m.distance} mi` : 'N/A'}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {m.specialties.slice(0, 2).map(s => (
            <span key={s} className="text-[9px] bg-white/5 px-1.5 py-0.5 rounded-md text-[#94A3B8] font-medium">{s}</span>
          ))}
        </div>
        
        {userLoc && idx === 0 && (
          <div className="flex items-center gap-1.5 mb-3 text-[10px] text-green-400 font-black uppercase tracking-widest bg-green-400/10 p-1.5 rounded-lg border border-green-400/20">
            <Navigation size={10} /> Top Recommended
          </div>
        )}
        
        {selectedMechanic?.id === m.id && (
          <button 
            onClick={(e) => { e.stopPropagation(); setBookingModal(m); }}
            className="w-full bg-[#4F46E5] hover:bg-[#4338CA] py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
          >
            <Wrench size={14}/> Book Service
          </button>
        )}
      </div>
    ))
  ), [mechanics, selectedMechanic, userLoc]);

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-[#06080F] text-white">
      <div className="w-full md:w-[350px] flex flex-col bg-[#0F172A] border-r border-white/5 z-10 shadow-2xl">
        <div className="p-5 border-b border-white/5 flex justify-between items-center">
          <h2 className="font-black text-lg flex items-center gap-2"><Filter size={18} className="text-[#4F46E5]"/> Grid</h2>
          <button onClick={() => handleDetectLocation()} className="p-2 hover:bg-white/5 rounded-full transition-colors text-[#22D3EE]">
            <Crosshair size={20}/>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 opacity-30 gap-4">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs font-bold uppercase tracking-widest">Syncing Grid...</p>
            </div>
          ) : MechanicList}
        </div>
      </div>
      
      <div className="flex-1 relative">
        <Map 
          mechanics={mechanics} 
          selectedMechanic={selectedMechanic} 
          onSelectMechanic={setSelectedMechanic} 
          userLoc={userLoc}
        />
      </div>

      <AnimatePresence>
        {bookingModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#1E293B] w-full max-w-md rounded-3xl p-8 border border-white/10 shadow-2xl">
              <h3 className="text-2xl font-black mb-2 flex items-center gap-3"><Wrench className="text-[#22D3EE]"/> Service Dispatch</h3>
              <p className="text-[#94A3B8] text-sm mb-6">Dispatching to <b>{bookingModal.name}</b>. Please describe your issue.</p>
              
              <textarea 
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-[#4F46E5] h-32 mb-6 resize-none"
                placeholder="Ex: My car engine is making a weird clicking sound..."
                value={issueDescription}
                onChange={(e) => setIssueDescription(e.target.value)}
              />

              <div className="flex gap-4">
                <button onClick={() => setBookingModal(null)} className="flex-1 py-4 text-sm font-bold bg-white/5 rounded-2xl border border-white/5">Cancel</button>
                <button onClick={handleBook} className="flex-1 btn-primary py-4 text-sm font-bold rounded-2xl flex items-center justify-center gap-2">
                   <Send size={16}/> Dispatch
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
