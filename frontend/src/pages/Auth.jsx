import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { User, Wrench, Mail, Lock, Phone, MapPin } from 'lucide-react';

import api from '../api/axios';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('user'); // 'user' or 'mechanic'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let locationData = null;

    // Detect location if registering as a mechanic
    if (!isLogin && role === 'mechanic') {
      const tid = toast.loading("Capturing your workshop location...");
      try {
        const pos = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
        });
        locationData = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          address: address || "Registered Workshop"
        };
        toast.success("Location captured!", { id: tid });
      } catch (err) {
        toast.error("Could not detect location. Using default.", { id: tid });
        locationData = { lat: 20.5937, lng: 78.9629, address: address || "India (Wide)" };
      }
    }

    const endpoint = `/api/${role}s/${isLogin ? 'login' : 'register'}`;
    const body = isLogin 
      ? { email, password } 
      : { 
          name, 
          email, 
          password, 
          phone, 
          location: role === 'mechanic' ? locationData : address,
          specialties: role === 'mechanic' ? ["General Mechanic"] : undefined
        };

    try {
      const res = await api.post(endpoint, body);
      const data = res.data;
      
      const userData = data.mechanic || data.user || {};
      userData.role = role; 
      
      login(data.token, userData);
      
      toast.success(isLogin ? `${role.charAt(0).toUpperCase() + role.slice(1)} authenticated!` : "Account Created Successfully!");
      
      setTimeout(() => {
        if (role === 'mechanic') {
          navigate('/dashboard');
        } else {
          navigate('/search');
        }
      }, 100);
    } catch (err) {
      toast.error(err.response?.data?.error || "Authentication failed. Check your credentials.");
    }
  };

  return (
    <div className="min-h-screen bg-[#06080F] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#4F46E5]/20 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-card p-8 z-10"
      >
        <div className="flex bg-[#0F172A]/80 p-1 rounded-xl mb-6 border border-white/5">
          <button onClick={() => setRole('user')} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${role === 'user' ? 'bg-[#4F46E5] text-white shadow-lg' : 'text-[#94A3B8] hover:text-white'}`}>
            <User size={16} /> User Portal
          </button>
          <button onClick={() => setRole('mechanic')} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${role === 'mechanic' ? 'bg-[#22D3EE] text-[#0F172A] shadow-lg' : 'text-[#94A3B8] hover:text-white'}`}>
            <Wrench size={16} /> Mechanic Portal
          </button>
        </div>

        <h2 className="text-3xl font-extrabold text-white text-center mb-2 tracking-tight">
          {isLogin ? "Welcome Back" : "Join the Grid"}
        </h2>
        <p className="text-[#94A3B8] text-center mb-8 text-sm">
          {isLogin 
            ? `Enter your credentials to access the ${role === 'mechanic' ? 'mechanic dashboard' : 'MechaFind network'}.` 
            : `Fill in your details to create your ${role} profile.`}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                  <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full bg-[#0F172A]/50 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-[#4F46E5]" placeholder="John Doe" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                    <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-[#0F172A]/50 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-[#4F46E5]" placeholder="9988776655" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">City/Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                    <input type="text" required value={address} onChange={e => setAddress(e.target.value)} className="w-full bg-[#0F172A]/50 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-[#4F46E5]" placeholder="Delhi" />
                  </div>
                </div>
              </div>
            </>
          )}
          
          <div>
            <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-[#0F172A]/50 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-[#4F46E5]" placeholder="email@example.com" />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-[#0F172A]/50 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-[#4F46E5]" placeholder="••••••••" />
            </div>
          </div>

          <button type="submit" className={`w-full py-4 rounded-xl font-bold tracking-wide mt-4 transition-all shadow-lg ${role === 'mechanic' ? 'bg-gradient-to-r from-[#22D3EE] to-[#3B82F6] text-[#0F172A]' : 'btn-primary'}`}>
            {isLogin ? "Authenticate" : "Initialize Account"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-[#94A3B8] hover:text-white transition-colors underline decoration-white/30 underline-offset-4">
            {isLogin ? "New to MechaFind? Register here" : "Already registered? Login here"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
