import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, MapPin, Calendar, Clock, Wrench, ShieldCheck, ChevronRight, Edit2, Save, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import api from '../api/axios';

export default function Profile() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: '', phone: '', location: '' });

  useEffect(() => {
    if (!token) navigate('/auth');
    if (user) {
      const displayLoc = typeof user.location === 'object' ? user.location.address : user.location;
      setEditData({
        name: user.name || '',
        phone: user.phone || '',
        location: displayLoc || ''
      });
      fetchHistory();
    }
  }, [user, token, navigate]);

  const fetchHistory = async () => {
    try {
      const endpoint = user?.role === 'mechanic' ? '/api/requests/mechanic' : '/api/requests/user';
      const res = await api.get(endpoint);
      setHistory(res.data);
    } catch (err) { console.error("History fail"); }
  };

  const handleUpdateProfile = async () => {
    try {
      // If mechanic, we need to preserve the lat/lng while updating address
      const updatePayload = { ...editData };
      if (user.role === 'mechanic' && typeof user.location === 'object') {
        updatePayload.location = {
          ...user.location,
          address: editData.location
        };
      }

      const res = await api.put('/api/auth/profile', updatePayload);
      if (res.status === 200) {
        toast.success("Profile updated!");
        setIsEditing(false);
        // Refresh local state by triggering a refresh or better yet, updating context
        window.location.reload();
      }
    } catch (err) { toast.error("Update failed"); }
  };

  if (!user) return (
    <div className="min-h-screen bg-[#06080F] flex flex-col items-center justify-center text-white">
      <div className="w-10 h-10 border-4 border-[#22D3EE] border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="font-bold tracking-widest uppercase text-xs opacity-50">Syncing Profile Data...</p>
      <button onClick={() => window.location.reload()} className="mt-8 text-xs text-[#4F46E5] underline">Takes too long? Refresh</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#06080F] text-white p-4 md:p-10">
      <div className="max-w-5xl mx-auto space-y-10">

        {/* Header Profile Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative glass-card p-8 md:p-12 overflow-hidden border-white/10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#4F46E5]/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-[#4F46E5] to-[#22D3EE] flex items-center justify-center text-5xl font-black shadow-[0_0_30px_rgba(79,70,229,0.4)]">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="text-center md:text-left flex-1">
              <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                {isEditing ? (
                  <input className="bg-black/40 border border-[#22D3EE] rounded px-2 py-1 text-2xl font-black" value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} />
                ) : (
                  <h1 className="text-4xl font-black tracking-tight">{user?.name || 'Operative'}</h1>
                )}
                <span className="bg-[#22D3EE]/10 text-[#22D3EE] text-[10px] font-black uppercase px-3 py-1 rounded-full border border-[#22D3EE]/20 w-max mx-auto md:mx-0">
                  {user?.role || 'Guest'} Operative
                </span>
              </div>
              <p className="text-[#94A3B8] flex items-center justify-center md:justify-start gap-2 text-lg">
                <Mail size={18} className="text-[#4F46E5]" /> {user.email}
              </p>
            </div>
            <div className="flex flex-col gap-2 w-full md:w-auto">
              {isEditing ? (
                <div className="flex gap-2">
                  <button onClick={handleUpdateProfile} className="btn-primary flex-1 px-6 py-3 rounded-xl font-bold flex items-center gap-2"><Save size={18} /> Save</button>
                  <button onClick={() => setIsEditing(false)} className="bg-white/5 flex-1 px-6 py-3 rounded-xl font-bold border border-white/10 flex items-center gap-2"><X size={18} /> Cancel</button>
                </div>
              ) : (
                <button onClick={() => setIsEditing(true)} className="btn-primary px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:shadow-indigo-500/20"><Edit2 size={18} /> Edit Profile</button>
              )}
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-6">
            <h2 className="text-xl font-bold border-b border-white/5 pb-4">Personal Details</h2>
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#22D3EE]"><Phone size={20} /></div>
                <div>
                  <p className="text-xs text-[#94A3B8] uppercase font-bold tracking-widest">Phone</p>
                  {isEditing ? (
                    <input className="bg-black/40 border border-[#22D3EE]/30 rounded px-2 py-0.5 text-sm" value={editData.phone} onChange={(e) => setEditData({ ...editData, phone: e.target.value })} />
                  ) : (
                    <p className="font-semibold">{user.phone || '88888-99999'}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#A78BFA]"><MapPin size={20} /></div>
                <div>
                  <p className="text-xs text-[#94A3B8] uppercase font-bold tracking-widest">Base Loc</p>
                  {isEditing ? (
                    <input className="bg-black/40 border border-[#22D3EE]/30 rounded px-2 py-0.5 text-sm" value={editData.location} onChange={(e) => setEditData({ ...editData, location: e.target.value })} />
                  ) : (
                    <p className="font-semibold">{typeof user.location === 'object' ? user.location.address : user.location || 'India (Wide)'}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <h2 className="text-xl font-bold border-b border-white/5 pb-4 flex justify-between items-center">
              Service History
              <span className="text-xs font-normal text-[#94A3B8] tracking-widest uppercase">{history.length} Jobs Total</span>
            </h2>

            {history.length === 0 ? (
              <div className="glass-card p-12 text-center border-dashed border-2 border-white/5 opacity-50">
                <Calendar className="mx-auto text-white/10 mb-4" size={48} />
                <p className="text-[#94A3B8] font-medium">Grid is clear. No active history.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {history.map((item) => (
                  <div key={item._id} className="glass-card p-6 border-white/5 flex items-center gap-6 group">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${item.status === 'accepted' ? 'bg-green-500/10 text-green-400' : 'bg-[#4F46E5]/10 text-[#4F46E5]'}`}>
                      <Wrench size={24} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="font-bold text-lg">{item.issueDescription}</h4>
                        <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-md ${item.status === 'accepted' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-white/5 text-[#94A3B8]'}`}>
                          {item.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-[#94A3B8] uppercase tracking-widest font-bold">
                        <span className="flex items-center gap-1"><Clock size={12} /> {new Date(item.createdAt).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1 text-[#4F46E5]"><MapPin size={12} /> {item.location}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
