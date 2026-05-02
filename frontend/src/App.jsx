import React from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import Search from './pages/Search';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Zap, LogOut, User } from 'lucide-react';

function Navbar() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#06080F]/80 backdrop-blur-md border-b border-white/5 px-6 py-4 flex justify-between items-center">
      <Link to="/" className="flex items-center gap-2 text-xl font-extrabold text-white tracking-tighter">
        <Zap className="text-[#22D3EE]" size={24} /> Mecha<span className="text-[#4F46E5]">Find</span>
      </Link>
      <div className="flex items-center gap-4">
        {user?.role === 'mechanic' || (user?.email && user.email.includes('mechanic')) ? (
           <Link to="/dashboard" className="text-sm font-bold text-[#22D3EE] hover:text-white transition-colors border border-[#22D3EE]/30 px-3 py-1.5 rounded-lg bg-[#22D3EE]/5 shadow-[0_0_15px_rgba(34,211,238,0.1)]">
             Command Center
           </Link>
        ) : (
           <Link to="/search" className="text-sm font-semibold text-[#94A3B8] hover:text-white transition-colors">Map Grid</Link>
        )}
        
        {token && (
          <Link to="/profile" className="flex items-center gap-2 text-sm font-semibold text-[#94A3B8] hover:text-white transition-colors border-l border-white/10 pl-4">
            <User size={18} /> My Profile
          </Link>
        )}

        {token ? (
          <button onClick={handleLogout} className="flex items-center gap-2 bg-white/5 hover:bg-red-500/10 text-white hover:text-red-400 border border-white/10 hover:border-red-500/30 px-5 py-2 rounded-lg text-sm font-bold transition-all">
            <LogOut size={16} /> Disconnect
          </button>
        ) : (
          <Link to="/auth" className="btn-primary px-5 py-2 rounded-lg text-sm font-bold">Login Portal</Link>
        )}
      </div>
    </nav>
  );
}

function AppContent() {
  const { loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen bg-[#06080F] flex flex-col items-center justify-center text-white">
      <div className="w-10 h-10 border-4 border-[#4F46E5] border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Initializing Neural Grid...</p>
    </div>
  );

  return (
    <>
      <Toaster position="top-right" />
      <Navbar />
      <div className="pt-[70px]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
