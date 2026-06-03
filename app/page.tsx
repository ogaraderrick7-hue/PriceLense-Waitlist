'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { CheckCircle2, TrendingUp, TrendingDown, Crosshair, BellRing } from 'lucide-react';

export default function WaitlistPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    setErrorMessage('');

    try {
      const trimmedEmail = email.toLowerCase().trim();
      if (!/^[^@]+@[^@]+\.[a-zA-Z0-9]+$/.test(trimmedEmail)) {
        throw new Error("Please enter a valid email address.");
      }

      const msgUint8 = new TextEncoder().encode(trimmedEmail);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const entryId = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      const waitlistRef = doc(collection(db, 'waitlist'), entryId);
      await setDoc(waitlistRef, {
        email: trimmedEmail,
        createdAt: serverTimestamp(),
      });
      setStatus('success');
      setEmail('');
    } catch (error: any) {
      setStatus('error');
      if (error?.code === 'permission-denied') {
        setErrorMessage("You're already on the waitlist!");
      } else {
        setErrorMessage(error?.message || 'Something went wrong.');
      }
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#050505] text-slate-100 flex flex-col font-sans overflow-hidden">
      {/* Header Navigation */}
      <header className="flex items-center justify-between px-6 md:px-12 py-6 md:py-8 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white rounded-sm"></div>
          </div>
          <span className="text-xl font-bold tracking-tight text-white italic">PriceLense</span>
        </div>
        <nav className="hidden md:flex gap-8 items-center text-xs uppercase tracking-widest font-semibold text-slate-400">
          <span className="hover:text-white cursor-pointer transition-colors">Features</span>
          <span className="hover:text-white cursor-pointer transition-colors">Our Vision</span>
          <div className="h-4 w-px bg-slate-800"></div>
          <span className="text-blue-500">Launching June 22, 2023</span>
        </nav>
      </header>

      {/* Main Hero Section */}
      <main className="flex-1 flex flex-col lg:flex-row px-6 md:px-12 gap-16 items-center justify-center lg:justify-between py-12 lg:py-0">
        {/* Left Column: Content & Form */}
        <div className="w-full lg:w-[450px] flex flex-col gap-8 shrink-0">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-4">
            <span className="inline-block px-3 py-1 bg-blue-900/30 text-blue-400 text-[10px] font-bold uppercase tracking-[0.2em] rounded border border-blue-800/50">
              Secure Your Early Access
            </span>
            <h1 className="text-5xl lg:text-6xl font-light leading-[1.1] text-white">
              Optimize <span className="italic font-serif text-blue-500">Profit</span> <br className="hidden lg:block"/>in Real-Time.
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed md:max-w-xl">
              The intelligence layer for your e-commerce pricing strategy. Detect competitor shifts, adjust margins instantly, and scale your revenue with automated precision.
            </p>
          </motion.div>

          {/* Interactive Waitlist Form */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="relative group">
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-1">Work Email Address</label>
                <div className="relative flex items-center">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={status === 'loading' || status === 'success'}
                    placeholder="jane@company.com" 
                    className="w-full bg-[#111] border border-slate-800 rounded-xl px-4 py-4 pr-32 text-white focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-600 disabled:bg-[#0c0c0c] disabled:text-slate-500"
                    required
                  />
                  <button 
                    type="submit"
                    disabled={status === 'loading' || status === 'success'}
                    className={cn(
                      "absolute right-2 px-6 py-2 rounded-lg font-bold text-sm transition-colors",
                      status === 'success' ? "bg-green-600 hover:bg-green-500 text-white" : "bg-blue-600 hover:bg-blue-500 text-white disabled:bg-slate-800 disabled:text-slate-500"
                    )}
                  >
                     {status === 'loading' ? (
                      <div className="h-5 w-5 rounded-full border-2 border-white/20 border-t-white animate-spin mx-auto" />
                    ) : status === 'success' ? (
                      <CheckCircle2 className="w-5 h-5 mx-auto" />
                    ) : (
                      "Join Waitlist"
                    )}
                  </button>
                </div>
              </div>
              {status === 'success' ? (
                <p className="text-[11px] font-bold uppercase tracking-widest text-green-400 mt-1 ml-1 flex items-center gap-1">
                   <CheckCircle2 className="w-4 h-4" /> You're on the list!
                </p>
              ) : status === 'error' ? (
                <p className="text-[11px] font-bold uppercase tracking-widest text-rose-500 mt-1 ml-1">
                  {errorMessage}
                </p>
              ) : (
                <p className="text-[11px] text-slate-500 text-center italic mt-1">
                  Join 1,240+ e-commerce leaders currently on the list.
                </p>
              )}
            </form>
          </motion.div>

          {/* Launch Countdown */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex gap-10 mt-4">
            <div className="flex flex-col">
              <span className="text-2xl font-mono text-white">22</span>
              <span className="text-[10px] uppercase tracking-widest text-slate-500">June</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-mono text-white text-opacity-50">2023</span>
              <span className="text-[10px] uppercase tracking-widest text-slate-500">Launch</span>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Visual Preview Dashboard Mockup */}
        <motion.div 
           initial={{ opacity: 0, scale: 0.95, x: 20 }}
           animate={{ opacity: 1, scale: 1, x: 0 }}
           transition={{ duration: 0.7, delay: 0.2 }}
           className="w-full lg:w-[600px] xl:w-[700px] h-auto lg:h-[520px] bg-[#0c0c0c] border border-slate-800 rounded-3xl relative overflow-hidden shadow-2xl shrink-0"
        >
          {/* Top Bar Mockup */}
          <div className="absolute top-0 left-0 right-0 h-12 bg-[#151515] border-b border-slate-800 flex items-center px-6 justify-between">
            <div className="flex gap-2">
              <div className="w-2 h-2 rounded-full bg-slate-700"></div>
              <div className="w-2 h-2 rounded-full bg-slate-700"></div>
              <div className="w-2 h-2 rounded-full bg-slate-700"></div>
            </div>
            <div className="flex h-5 w-32 bg-slate-800 rounded px-2 items-center">
              <div className="w-full h-1 bg-slate-700 rounded-full"></div>
            </div>
          </div>

          {/* Grid & Charts Simulation */}
          <div className="mt-16 px-6 lg:px-8 pb-8 flex flex-col gap-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="h-24 bg-[#111] rounded-xl border border-slate-800 p-4 flex flex-col justify-between">
                <div className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">Margin Lift</div>
                <div className="text-2xl font-semibold text-green-400">+14.2%</div>
              </div>
              <div className="h-24 bg-[#111] rounded-xl border border-slate-800 p-4 flex flex-col justify-between">
                <div className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">Pricing Events</div>
                <div className="text-2xl font-semibold text-blue-400">4,821</div>
              </div>
              <div className="hidden sm:flex h-24 bg-[#111] rounded-xl border border-slate-800 p-4 flex flex-col justify-between">
                <div className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">Active Skus</div>
                <div className="text-2xl font-semibold text-slate-100">12.5k</div>
              </div>
            </div>

            {/* Price Graph Simulation */}
            <div className="h-40 sm:h-52 bg-[#111] rounded-2xl border border-slate-800 p-4 sm:p-6 relative overflow-hidden">
              <div className="flex justify-between items-center mb-4 relative z-10">
                <div className="text-[10px] uppercase text-slate-400 font-bold tracking-widest">Price Flux</div>
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-slate-700 rounded-full"></div>
                </div>
              </div>
              {/* Simulated SVG Chart Lines */}
              <svg className="w-full h-24 sm:h-32 text-blue-500 absolute bottom-0 left-0 right-0 px-4" preserveAspectRatio="none">
                <path d="M0 100 Q 50 80, 100 90 T 200 40 T 300 60 T 400 20 T 500 50" fill="none" stroke="currentColor" strokeWidth="3" />
                <path d="M0 110 Q 50 95, 100 100 T 200 70 T 300 85 T 400 45 T 500 75" fill="none" stroke="#334155" strokeWidth="2" />
              </svg>
              {/* Overlay Floating Detail */}
              <div className="hidden sm:block absolute top-12 right-12 bg-blue-600 p-3 rounded-lg shadow-xl z-10">
                <div className="text-[9px] uppercase font-bold text-blue-100 tracking-tighter">Price Adjusted</div>
                <div className="text-sm font-bold text-white font-mono">$149.00 -{'>'} $154.50</div>
              </div>
            </div>

            {/* SKU Row Mockups */}
            <div className="space-y-3">
              <div className="h-12 bg-[#111]/50 border border-slate-800 rounded-lg flex items-center px-4 justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-slate-800 rounded"></div>
                  <div className="w-24 sm:w-32 h-2 bg-slate-800 rounded"></div>
                </div>
                <div className="w-12 h-2 bg-green-900/50 rounded"></div>
              </div>
              <div className="h-12 bg-[#111]/50 border border-slate-800 rounded-lg flex items-center px-4 justify-between opacity-50">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-slate-800 rounded"></div>
                  <div className="w-20 sm:w-24 h-2 bg-slate-800 rounded"></div>
                </div>
                <div className="w-12 h-2 bg-slate-800 rounded"></div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer Decorative */}
      <footer className="px-6 md:px-12 py-6 mt-auto shrink-0 flex flex-col md:flex-row gap-4 justify-between items-center border-t border-slate-900">
        <div className="text-[10px] text-slate-600 font-semibold tracking-widest uppercase">
          &copy; 2023 PRICELENSE INC. &bull; BUILT FOR SCALE
        </div>
        <div className="flex gap-6">
          <div className="w-2 h-2 rounded-full bg-blue-600"></div>
          <div className="w-2 h-2 rounded-full bg-slate-800"></div>
          <div className="w-2 h-2 rounded-full bg-slate-800"></div>
        </div>
      </footer>
    </div>
  );
}
