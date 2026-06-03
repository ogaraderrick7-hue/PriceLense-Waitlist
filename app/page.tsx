'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { 
  TrendingDown, 
  TrendingUp, 
  Crosshair, 
  ArrowRight, 
  CheckCircle2,
  LineChart,
  ShoppingBag,
  BellRing
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function WaitlistPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const launchDate = new Date('2026-06-22T00:00:00Z');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    setErrorMessage('');

    try {
      // Validate email format basic
      if (!/^[^@]+@[^@]+\.[a-zA-Z0-9]+$/.test(email)) {
        throw new Error("Please enter a valid email address.");
      }

      // Generate a unique ID for the entry
      const entryId = crypto.randomUUID();
      const waitlistRef = doc(collection(db, 'waitlist'), entryId);
      
      await setDoc(waitlistRef, {
        email,
        createdAt: serverTimestamp(),
      });

      setStatus('success');
      setEmail('');
    } catch (error: any) {
      setStatus('error');
      setErrorMessage(error.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#050505] text-slate-100 font-sans overflow-hidden selection:bg-blue-500/20 flex flex-col">
      {/* Background gradients disabled to match theme requirements */}
      <div className="hidden">
        <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] bg-blue-100 rounded-full blur-3xl opacity-50 mix-blend-multiply" />
        <div className="absolute top-[20%] -left-[10%] w-[50%] h-[50%] bg-rose-50 rounded-full blur-3xl opacity-50 mix-blend-multiply" />
      </div>

      <nav className="relative z-10 max-w-7xl mx-auto w-full px-6 py-6 md:px-12 md:py-8 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white rounded-sm"></div>
          </div>
          <span className="text-xl font-bold tracking-tight text-white italic">PriceLense</span>
        </div>
        <div className="text-xs uppercase tracking-widest font-semibold text-slate-400 hidden sm:flex items-center gap-8">
          <span className="hover:text-white cursor-pointer transition-colors hidden md:block">Features</span>
          <span className="hover:text-white cursor-pointer transition-colors hidden md:block">Our Vision</span>
          <div className="h-4 w-px bg-slate-800 hidden md:block"></div>
          <span className="text-blue-500 font-bold">Launching June 22, 2023</span>
        </div>
      </nav>

      <main className="flex-1 relative z-10 max-w-7xl mx-auto w-full px-6 md:px-12 pt-12 pb-24 lg:py-0 grid lg:grid-cols-2 gap-16 lg:gap-8 items-center">
        {/* Left Column: Copy & Form */}
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-900/30 text-blue-400 text-[10px] font-bold uppercase tracking-[0.2em] rounded border border-blue-800/50 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Early Access Program
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-light tracking-tight text-white mb-6 leading-[1.1] font-serif">
              Optimize <span className="italic font-serif text-blue-500">Profit</span> <br className="hidden lg:block"/>in Real-Time.
            </h1>
            
            <p className="text-lg text-slate-400 mb-10 leading-relaxed max-w-xl">
              Track competitor prices in real-time, optimize your profit margins, and never lose a sale to a cheaper rival. Join the waitlist for our launch on <strong className="text-slate-200">June 22nd</strong>.
            </p>

            <form onSubmit={handleSubmit} className="max-w-md relative flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-1">Work Email Address</label>
                <div className="relative flex items-center">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    disabled={status === 'loading' || status === 'success'}
                    className="w-full bg-[#111] border border-slate-800 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-600 disabled:bg-[#0c0c0c] disabled:text-slate-500"
                    required
                  />
                  <button
                    type="submit"
                    disabled={status === 'loading' || status === 'success'}
                    className={cn(
                      "absolute right-2 px-6 py-2 rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2",
                      status === 'success' ? "bg-green-600 hover:bg-green-500 text-white" : "bg-blue-600 hover:bg-blue-500 text-white disabled:bg-slate-800 disabled:text-slate-400"
                    )}
                  >
                    {status === 'loading' ? (
                      <div className="h-5 w-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                    ) : status === 'success' ? (
                      <>Joined <CheckCircle2 className="w-5 h-5" /></>
                    ) : (
                      <>Join Waitlist</>
                    )}
                  </button>
                </div>
              </div>
              {status === 'success' ? (
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[11px] font-bold uppercase tracking-widest text-green-400 flex items-center gap-1 mt-1 ml-1"
                >
                  <CheckCircle2 className="w-4 h-4" /> You&apos;re on the list! We&apos;ll be in touch soon.
                </motion.p>
              ) : status === 'error' ? (
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[11px] font-bold uppercase tracking-widest text-rose-500 mt-1 ml-1"
                >
                  {errorMessage}
                </motion.p>
              ) : (
                <p className="text-[11px] text-slate-500 italic mt-1 ml-1">
                  Join 1,240+ e-commerce leaders currently on the list.
                </p>
              )}
            </form>

            <div className="mt-8 flex items-center gap-8 text-[10px] font-bold uppercase tracking-widest text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-500" /> Real-time alerts
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-500" /> Automated adjustments
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Visual Dashboard Mockup */}
        <div className="relative lg:h-[600px] flex items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="w-full relative"
          >
            {/* Minimalist Dashboard UI Mock */}
            <div className="bg-[#0c0c0c] rounded-3xl shadow-2xl border border-slate-800 overflow-hidden transform transition-transform duration-500">
              {/* Fake Window Header */}
              <div className="bg-[#151515] border-b border-slate-800 px-6 py-4 flex items-center justify-between relative">
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-slate-700" />
                  <div className="w-2 h-2 rounded-full bg-slate-700" />
                  <div className="w-2 h-2 rounded-full bg-slate-700" />
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 bg-[#111] border border-slate-800 rounded px-4 py-0.5 text-[10px] text-slate-500 font-mono">
                  app.pricelense.com/dashboard
                </div>
                <div className="w-4" /> {/* Spacer */}
              </div>
              
              {/* Mock Content */}
              <div className="p-6 md:p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="font-semibold text-slate-100">Price Dynamics</h3>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-1">Latest competitor movements</p>
                  </div>
                  <div className="px-3 py-1 bg-green-900/30 border border-green-800/50 text-green-400 rounded text-[10px] font-bold uppercase tracking-wide">
                    +12.5% Margin
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Mock Item 1 */}
                  <div className="p-4 rounded-xl border border-slate-800 bg-[#111] flex flex-col gap-3 relative overflow-hidden group hover:border-blue-500/50 transition-colors">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 opacity-80" />
                    <div className="flex justify-between items-start">
                      <span className="font-semibold text-sm text-slate-100">Sony Alpha a7 IV</span>
                      <span className="text-xs font-mono px-2 py-1 bg-blue-900/30 rounded text-blue-400 border border-blue-800/50 shadow-sm">
                        $2,498.00 vs $2,550.00
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      <span className="flex items-center gap-1">
                        <Crosshair className="w-3 h-3" /> CamoraStore
                      </span>
                      <span className="flex items-center gap-1 text-blue-400">
                        <TrendingUp className="w-3 h-3" /> Safe to raise
                      </span>
                    </div>
                  </div>

                  {/* Mock Item 2 */}
                  <div className="p-4 rounded-xl border border-slate-800 bg-[#111] flex flex-col gap-3 relative overflow-hidden group hover:border-rose-500/50 transition-colors">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500 opacity-80" />
                    <div className="flex justify-between items-start">
                      <span className="font-semibold text-sm text-slate-100">Apple AirPods Pro 2</span>
                      <span className="text-xs font-mono px-2 py-1 bg-rose-900/30 rounded text-rose-400 border border-rose-800/50 shadow-sm">
                        $239.00 vs $229.00
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      <span className="flex items-center gap-1">
                        <Crosshair className="w-3 h-3" /> ElectroWorld
                      </span>
                      <span className="flex items-center gap-1 text-rose-400">
                        <TrendingDown className="w-3 h-3" /> Undercutted by $10
                      </span>
                    </div>
                  </div>

                  {/* Mock Item 3 */}
                  <div className="p-4 rounded-xl border border-slate-800 bg-[#111] flex flex-col gap-3 relative overflow-hidden group hover:border-slate-600 transition-colors">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-700 opacity-80" />
                    <div className="flex justify-between items-start">
                      <span className="font-semibold text-sm text-slate-100">Logitech MX Master 3S</span>
                      <span className="text-xs font-mono px-2 py-1 bg-[#151515] rounded text-slate-400 border border-slate-700 shadow-sm">
                        $99.00 vs $99.00
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      <span className="flex items-center gap-1">
                        <Crosshair className="w-3 h-3" /> TechStore
                      </span>
                      <span className="flex items-center gap-1 text-slate-500">
                        Equal price
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Element */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="absolute -right-2 md:-right-6 -bottom-6 bg-[#111] p-4 rounded-xl shadow-2xl border border-slate-800 flex items-center gap-3 z-10"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-900/30 border border-blue-800/50 text-blue-400 flex items-center justify-center shrink-0">
                <BellRing className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-100">Competitor Drop</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Auto-matched in 2s</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>

      {/* Footer Decorative */}
      <footer className="px-6 md:px-12 py-6 shrink-0 flex justify-between border-t border-slate-900 z-10">
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
