import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wrench, CheckCircle2, XCircle, Clock, MapPin, AlertTriangle, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';

export default function Dashboard() {
  const { user, token, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    if (!token) return;
    try {
      const res = await api.get('/api/requests/mechanic/pending');
      setRequests(res.data);
    } catch (err) {
      console.error("Fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!token || user?.role !== 'mechanic') {
        // If not a mechanic, send to search or auth
        navigate(token ? '/search' : '/auth');
      } else {
        fetchRequests();
        const interval = setInterval(fetchRequests, 10000);
        return () => clearInterval(interval);
      }
    }
  }, [user, token, authLoading]);

  const updateStatus = async (id, status) => {
    const tid = toast.loading(`Updating status...`);
    try {
      const res = await api.put(`/api/requests/${id}/status`, { status });
      toast.success(`Request ${status}!`, { id: tid });
      fetchRequests();
    } catch (err) {
      toast.error("Failed to update status", { id: tid });
    }
  };

  if (authLoading) return (
    <div className="min-h-screen bg-[#06080F] flex flex-col items-center justify-center text-white">
      <div className="w-12 h-12 border-4 border-[#22D3EE] border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="font-bold tracking-widest uppercase text-xs opacity-50">Authenticating Operative...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#06080F] text-white p-6 pb-20">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 flex justify-between items-end border-b border-white/5 pb-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-2">Mechanic Command Center</h1>
            <p className="text-[#94A3B8] text-lg">Welcome back, <span className="text-[#22D3EE] font-bold">{user?.name}</span>. Grid status: Active.</p>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 px-4 py-2 rounded-lg">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-bold text-sm uppercase tracking-widest">Online</span>
            </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-1 gap-8">
          <div className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-4"><AlertTriangle className="text-[#A78BFA]"/> Incoming Emergency Dispatches</h2>
            
            {loading && requests.length === 0 ? (
               <div className="py-20 text-center opacity-30">Syncing database...</div>
            ) : requests.length === 0 ? (
              <div className="glass-card p-10 text-center border-white/5">
                <Clock className="mx-auto text-[#94A3B8] mb-4 opacity-50" size={48} />
                <h3 className="text-xl font-bold text-white mb-2 text-center">No Active Requests</h3>
                <p className="text-[#94A3B8]">The grid is currently clear. Stand by for incoming calls.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {requests.map(req => (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} key={req._id} className="glass-card p-6 border border-[#4F46E5]/30 hover:border-[#4F46E5] transition-all relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#4F46E5] group-hover:bg-[#22D3EE] transition-colors"></div>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">{req.user?.name || 'Anonymous User'}</h3>
                        <p className="text-[#22D3EE] font-black text-xs uppercase tracking-tighter">{req.vehicleInfo}</p>
                      </div>
                      <span className="text-[10px] font-bold text-[#A78BFA] bg-[#A78BFA]/10 px-3 py-1 rounded-full border border-[#A78BFA]/20">
                        {new Date(req.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                    
                    <div className="bg-black/40 rounded-xl p-4 mb-6 border border-white/5">
                      <p className="text-[#F8FAFC] font-medium mb-3 text-sm italic">"{req.issueDescription}"</p>
                      <div className="flex items-center gap-2 text-xs text-[#94A3B8] font-bold">
                        <MapPin size={14} className="text-[#EF4444]" /> {req.location}
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button onClick={() => updateStatus(req._id, 'accepted')} className="flex-1 btn-primary py-3 rounded-xl font-bold flex justify-center items-center gap-2 shadow-lg hover:shadow-indigo-500/25">
                        <CheckCircle2 size={18} /> Accept Job
                      </button>
                      <button onClick={() => updateStatus(req._id, 'cancelled')} className="flex-1 bg-white/5 hover:bg-red-500/10 text-white hover:text-red-400 border border-white/10 hover:border-red-500/30 py-3 rounded-xl font-bold flex justify-center items-center gap-2 transition-all">
                        <XCircle size={18} /> Ignore
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
