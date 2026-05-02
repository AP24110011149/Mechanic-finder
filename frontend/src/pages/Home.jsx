import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, ShieldCheck, Zap, Clock, Star, Wrench, ChevronDown, Activity, Users, Map as MapIcon, Crosshair } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const [location, setLocation] = useState('India Wide');
  const [service, setService] = useState('All Services');

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?location=${encodeURIComponent(location === 'India Wide' ? '' : location)}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#06080F] overflow-hidden text-white">
      {/* Background Noise Texture */}
      <div className="fixed inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 flex flex-col items-center justify-center min-h-[90vh]">
        {/* Glowing Radial Background Aura */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] max-w-[1000px] h-[600px] bg-gradient-to-r from-[#4F46E5]/20 via-[#A78BFA]/10 to-[#22D3EE]/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Copy & Search */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center lg:items-start text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-[#F8FAFC] text-xs font-semibold tracking-wide mb-8 shadow-inner">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22D3EE] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22D3EE]"></span>
              </span>
              Now live across the subcontinent
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tighter mb-6 leading-[1.1]">
              Find Trusted Mechanics <br/>
              <span className="text-gradient">Anywhere in India.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-[#94A3B8] mb-12 max-w-xl font-normal leading-relaxed">
              The premier network for automotive care. Connect with verified experts instantly, from the bustling streets of Mumbai to the tech parks of Bangalore.
            </p>
            
            {/* Glassmorphism Search Bar */}
            <div className="w-full max-w-xl space-y-4">
              <form onSubmit={handleSearch} className="p-2 bg-[#0F172A]/60 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.4)] flex flex-col sm:flex-row gap-2 relative z-20 hover:border-white/20 transition-all duration-300">
                <div className="flex-1 relative flex items-center bg-black/20 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                  <MapPin className="text-[#4F46E5] absolute left-4 pointer-events-none" size={18} />
                  <select className="w-full bg-transparent text-[#F8FAFC] appearance-none pl-12 pr-10 py-4 outline-none text-sm font-medium cursor-pointer" value={location} onChange={(e) => setLocation(e.target.value)}>
                    <option className="bg-[#0F172A]">India Wide</option>
                    <option className="bg-[#0F172A]">Mumbai, MH</option>
                    <option className="bg-[#0F172A]">Delhi, NCR</option>
                    <option className="bg-[#0F172A]">Bangalore, KA</option>
                  </select>
                  <ChevronDown size={16} className="text-[#94A3B8] absolute right-4 pointer-events-none" />
                </div>
                <button type="submit" className="btn-primary py-4 px-8 text-sm shrink-0 rounded-xl w-full sm:w-auto font-bold tracking-wide shadow-lg hover:shadow-indigo-500/30">
                  Search Network
                </button>
              </form>

              <button 
                onClick={() => navigate('/search?detect=true')}
                className="w-full flex items-center justify-center gap-3 p-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/40 rounded-2xl text-red-400 font-black text-sm uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Crosshair className="animate-pulse" size={20} />
                Get Emergency Recommendation
              </button>
            </div>
          </motion.div>

          {/* Right: Abstract Indian Map / Floating Nodes */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative hidden lg:flex items-center justify-center h-full w-full"
          >
            {/* Abstract Network Graphic */}
            <div className="absolute w-[400px] h-[400px] rounded-full border border-white/5 border-dashed animate-[spin_30s_linear_infinite] opacity-30"></div>
            <div className="absolute w-[300px] h-[300px] rounded-full border border-[#4F46E5]/20 animate-[spin_20s_linear_infinite_reverse]"></div>
            
            {/* Floating Cards */}
            <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[10%] right-[10%] w-56 glass-card p-4 border border-[#4F46E5]/30 shadow-[0_0_30px_rgba(79,70,229,0.2)] bg-[#0F172A]/80 backdrop-blur-xl">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold text-[#A78BFA] uppercase tracking-widest">Delhi, NCR</span>
                <span className="flex items-center gap-1 text-xs font-bold text-white"><Star size={10} className="text-[#22D3EE] fill-[#22D3EE]"/> 4.9</span>
              </div>
              <h3 className="text-white font-bold text-sm mb-1">Sharma Auto Works</h3>
              <p className="text-[#94A3B8] text-[10px]">Engine Repair & Diagnostics</p>
            </motion.div>

            <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute bottom-[20%] left-[5%] w-60 glass-card p-4 border border-[#22D3EE]/30 shadow-[0_0_30px_rgba(34,211,238,0.2)] bg-[#0F172A]/80 backdrop-blur-xl z-20">
               <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold text-[#22D3EE] uppercase tracking-widest">Mumbai, MH</span>
                <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-[#22D3EE] rounded-full animate-pulse"></span> <span className="text-[10px] text-[#22D3EE] font-bold">Online</span></div>
              </div>
              <h3 className="text-white font-bold text-sm mb-1">Rao Premium Service</h3>
              <p className="text-[#94A3B8] text-[10px]">Electrical & Battery Solutions</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-white/5 bg-[#0F172A]/30 backdrop-blur-md relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/5">
            {[
              { label: "Active Mechanics", value: "25,000+", icon: <Users className="text-[#4F46E5]" size={24} /> },
              { label: "Cities Covered", value: "1,000+", icon: <MapIcon className="text-[#22D3EE]" size={24} /> },
              { label: "Average Response", value: "< 15 min", icon: <Zap className="text-[#A78BFA]" size={24} /> },
              { label: "Service Rating", value: "4.9/5", icon: <Star className="text-yellow-400" size={24} /> }
            ].map((stat, idx) => (
              <div key={idx} className={`px-4 flex flex-col items-center md:items-start ${idx === 0 ? '' : 'md:pl-8'}`}>
                <div className="mb-3 p-3 bg-white/5 rounded-xl border border-white/10">{stat.icon}</div>
                <h4 className="text-3xl font-extrabold text-white tracking-tighter">{stat.value}</h4>
                <p className="text-sm text-[#94A3B8] font-medium mt-1 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Premium Features Section */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">The Mechanics of <span className="text-gradient">MechaFind</span></h2>
          <p className="text-[#94A3B8] max-w-2xl mx-auto text-lg mb-16">A seamless protocol designed to get you back on the road instantly with no hassle.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Smart GPS Dispatch", desc: "Our engine scans the local grid and automatically routes the closest available operative to your exact location.", icon: <Crosshair size={32} /> },
              { title: "Verified Professionals", desc: "Every mechanic undergoes strict background checks, skill verification, and ongoing peer ratings.", icon: <ShieldCheck size={32} /> },
              { title: "Transparent Pricing", desc: "No hidden fees. You see the estimated cost before the mechanic even accepts the dispatch request.", icon: <Activity size={32} /> }
            ].map((feat, i) => (
              <motion.div whileHover={{ y: -10 }} key={i} className="glass-card p-8 border border-white/10 hover:border-[#4F46E5]/50 transition-all text-left group">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4F46E5]/20 to-[#22D3EE]/20 flex items-center justify-center text-[#22D3EE] mb-6 group-hover:scale-110 transition-transform">
                  {feat.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feat.title}</h3>
                <p className="text-[#94A3B8] leading-relaxed text-sm">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
