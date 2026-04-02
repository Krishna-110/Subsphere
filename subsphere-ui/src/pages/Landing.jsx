import React, { useEffect } from "react";
import { motion, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";
import { Sparkles, ArrowRight, BrainCircuit, FileText, CheckCircle2, Target, Cpu, Lock } from "lucide-react";
import { Link } from "react-router-dom"; // Added so the buttons work!
import logoUrl from '../assets/logo.svg';

const Landing = () => {
    // --- HIGH-PERFORMANCE MOUSE TRACKING ---
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
    const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });
    const spotlightBackground = useMotionTemplate`radial-gradient(600px circle at ${springX}px ${springY}px, rgba(168, 85, 247, 0.12), transparent 80%)`;

    useEffect(() => {
        const handleMouseMove = (e) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    // --- DRIFTING DATA NODES ---
    const particles = Array.from({ length: 25 }).map((_, i) => ({
        id: i,
        size: Math.random() * 3 + 1,
        x: Math.random() * 100,
        duration: Math.random() * 20 + 10,
        delay: Math.random() * 10,
    }));

    // --- NEURAL SONAR PULSES ---
    const pulses = Array.from({ length: 3 }).map((_, i) => ({
        id: i,
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10,
        delay: Math.random() * 6,
        duration: Math.random() * 4 + 8,
    }));

    return (
        <div className="relative min-h-screen overflow-x-hidden bg-[#05030a] text-white selection:bg-purple-500/30 flex flex-col font-sans">

            {/* =========================================
          BACKGROUND EFFECTS SYSTEM 
      ========================================= */}
            <motion.div className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300" style={{ background: spotlightBackground }} />
            <div className="tech-grid fixed inset-0 z-0 opacity-40"></div>

            <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.4, 0.3], x: [0, 50, 0] }} transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }} className="aurora-glow w-[50vw] h-[50vh] top-[-10%] left-[-10%] bg-purple-700/30" />
            <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.3, 0.2], x: [0, -50, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }} className="aurora-glow w-[60vw] h-[60vh] bottom-[-20%] right-[-10%] bg-indigo-600/20" />

            {/* Floating Particles */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                {particles.map((particle) => (
                    <motion.div key={`particle-${particle.id}`} className="absolute rounded-full bg-purple-400"
                        style={{ width: particle.size, height: particle.size, left: `${particle.x}%`, bottom: "-20px", opacity: particle.size > 2 ? 0.6 : 0.3, boxShadow: `0 0 ${particle.size * 3}px rgba(168, 85, 247, 0.8)` }}
                        animate={{ y: [0, -1000], x: [0, Math.random() * 50 - 25] }}
                        transition={{ duration: particle.duration, repeat: Infinity, delay: particle.delay, ease: "linear" }}
                    />
                ))}
            </div>

            {/* Sonar Pulses */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                {pulses.map((pulse) => (
                    <motion.div key={`pulse-${pulse.id}`} className="absolute rounded-full border border-purple-500/20"
                        style={{ left: `${pulse.x}%`, top: `${pulse.y}%`, x: "-50%", y: "-50%" }}
                        initial={{ width: 0, height: 0, opacity: 0.6 }}
                        animate={{ width: "600px", height: "600px", opacity: 0 }}
                        transition={{ duration: pulse.duration, repeat: Infinity, delay: pulse.delay, ease: "easeOut" }}
                    />
                ))}
            </div>

            {/* =========================================
          FOREGROUND UI 
      ========================================= */}

            {/* Glass Navigation */}
            <nav className="fixed top-0 w-full z-50 glass-nav">
                <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">

                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
                        <img src={logoUrl} alt="Subsphere Logo" className="w-10 h-10 shadow-[0_0_20px_rgba(168,85,247,0.4)] rounded-full" />
                        <span className="font-bold text-sm uppercase tracking-widest text-zinc-100 ml-1">Subsphere</span>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-8">
                        <a href="#architecture" className="text-sm font-medium text-zinc-400 hover:text-purple-300 transition-colors">Architecture</a>
                        <a href="#pricing" className="text-sm font-medium text-zinc-400 hover:text-purple-300 transition-colors">Pricing</a>
                        <a href="http://localhost:8080/oauth2/authorization/google" className="text-sm font-bold text-white hover:text-purple-200 transition-colors">
                            Access Terminal
                        </a>
                    </motion.div>
                </div>
            </nav>

            {/* Main Content Areas */}
            <main className="relative z-10 flex-1 flex flex-col items-center px-4 pt-32 pb-20 w-full text-center">
                
                {/* Hero Wrapper */}
                <div className="min-h-[80vh] flex flex-col items-center justify-center w-full">

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex items-center gap-2 px-5 py-2 rounded-full bg-purple-900/20 border border-purple-500/20 backdrop-blur-md mb-8 shadow-[0_0_30px_rgba(168,85,247,0.15)]">
                    <Sparkles size={14} className="text-purple-400" />
                    <span className="text-xs font-bold text-purple-200 uppercase tracking-widest">Intelligence Node v2.0 Online</span>
                </motion.div>

                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter max-w-5xl hero-text-glow leading-[1.1]">
                    Survive the interview. <br className="hidden md:block" /> Let AI roast your resume.
                </motion.h1>

                <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-8 text-lg md:text-xl text-zinc-400 max-w-2xl font-light leading-relaxed">
                    Subsphere analyzes your blueprint against target job requirements, exposing critical flaws and generating highly-probable technical questions before the recruiter does.
                </motion.p>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex flex-col sm:flex-row items-center gap-4 mt-12">

                    {/* THE MAGIC ROUTER LINK */}
                    <Link to="/dashboard" className="group relative px-8 py-4 bg-white text-black font-bold rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(168,85,247,0.3)] block">
                        <span className="relative z-10 flex items-center gap-2">
                            Initialize Free Scan <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                        </span>
                        <div className="absolute inset-0 bg-purple-100 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </Link>

                    <a href="http://localhost:8080/oauth2/authorization/google" className="px-8 py-4 font-semibold text-zinc-300 hover:text-white transition-colors flex items-center gap-2 rounded-full hover:bg-white/5 border border-transparent hover:border-white/10">
                        Authenticate via Google
                    </a>
                </motion.div>

                {/* Abstract Floating UI Representation */}
                <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 1 }} className="mt-24 relative w-full max-w-4xl">
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-base)] via-transparent to-transparent z-10 pointer-events-none"></div>

                    <div className="flex flex-col md:flex-row gap-6 justify-center opacity-80 hover:opacity-100 transition-all duration-700">
                        <div className="w-full md:w-64 h-40 rounded-3xl bg-zinc-900/60 border border-white/5 backdrop-blur-xl p-6 flex flex-col items-center justify-center gap-4 shadow-2xl transition-transform hover:-translate-y-2 duration-500">
                            <FileText className="text-zinc-500" size={32} />
                            <div className="w-24 h-2 bg-white/10 rounded-full"></div>
                            <div className="w-16 h-2 bg-white/10 rounded-full"></div>
                        </div>
                        <div className="hidden md:flex items-center justify-center">
                            <ArrowRight className="text-purple-500/50" size={24} />
                        </div>
                        <div className="w-full md:w-80 h-48 rounded-3xl bg-purple-900/10 border border-purple-500/20 backdrop-blur-xl p-6 flex flex-col justify-center gap-4 relative overflow-hidden shadow-[0_0_40px_rgba(168,85,247,0.15)] transition-transform hover:-translate-y-2 duration-500">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>
                            <BrainCircuit className="text-purple-400" size={28} />
                            <div className="space-y-2 w-full">
                                <div className="w-[90%] h-2 bg-purple-400/20 rounded-full"></div>
                                <div className="w-[70%] h-2 bg-purple-400/20 rounded-full"></div>
                                <div className="w-[80%] h-2 bg-purple-400/20 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </motion.div>
                </div> {/* End Hero Wrapper */}

                {/* --- ARCHITECTURE SECTION --- */}
                <section id="architecture" className="w-full max-w-7xl mx-auto mt-32 pt-20 relative z-10 text-left">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-20 bg-gradient-to-b from-transparent to-purple-500/50"></div>
                    
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black mb-4">Neural Architecture</h2>
                        <p className="text-zinc-400 max-w-2xl mx-auto">How the intelligence node processes your blueprint.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-zinc-900/40 border border-white/5 p-8 rounded-3xl hover:border-purple-500/30 transition-colors group">
                            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 transition-transform">
                                <FileText />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">1. Blueprint Parsing</h3>
                            <p className="text-zinc-400 leading-relaxed text-sm">Deep semantic extraction of your raw resume text to understand your technical surface area and experience nodes.</p>
                        </div>
                        <div className="bg-zinc-900/40 border border-white/5 p-8 rounded-3xl hover:border-purple-500/30 transition-colors group">
                            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 transition-transform">
                                <Target />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">2. Target Alignment</h3>
                            <p className="text-zinc-400 leading-relaxed text-sm">Cross-referencing your profile against the strict parameters of the target job description to find critical missing links.</p>
                        </div>
                        <div className="bg-zinc-900/40 border border-white/5 p-8 rounded-3xl hover:border-purple-500/30 transition-colors group">
                            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 transition-transform">
                                <Cpu />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">3. Matrix Execution</h3>
                            <p className="text-zinc-400 leading-relaxed text-sm">Generating highly-probable, aggressive technical interview questions designed to expose and patch your weaknesses.</p>
                        </div>
                    </div>
                </section>

                {/* --- PRICING SECTION --- */}
                <section id="pricing" className="w-full max-w-6xl mx-auto mt-40 pt-20 mb-32 relative z-10 scroll-mt-20">
                   <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-20 bg-gradient-to-b from-transparent to-purple-500/50"></div>
                   
                   <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black mb-4">Authorization Tiers</h2>
                        <p className="text-zinc-400 max-w-2xl mx-auto">Select your intelligence access level.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mx-auto text-left">
                        {/* Free Plan */}
                        <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-8 flex flex-col gap-6 shadow-xl relative overflow-hidden">
                            <h3 className="text-xl font-bold text-white">Starter Protocol</h3>
                            <div className="text-5xl font-black text-white">$0<span className="text-lg text-zinc-500 font-medium whitespace-nowrap"> / mo</span></div>
                            <ul className="space-y-4 flex-1 mt-4">
                                <li className="flex gap-3 text-sm text-zinc-300"><CheckCircle2 size={18} className="text-zinc-500 shrink-0" /> 10 AI Roasts per month</li>
                                <li className="flex gap-3 text-sm text-zinc-300"><CheckCircle2 size={18} className="text-zinc-500 shrink-0" /> Standard processing speed</li>
                                <li className="flex gap-3 text-sm text-zinc-500"><Lock size={18} className="text-zinc-700 shrink-0" /> Premium priority queue</li>
                            </ul>
                            <a href="http://localhost:8080/oauth2/authorization/google" className="mt-4 w-full py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl flex items-center justify-center transition-all border border-white/10 hover:border-white/20">
                                Authenticate Free
                            </a>
                        </div>

                        {/* Pro Plan */}
                        <div className="bg-purple-900/10 border border-purple-500/30 rounded-3xl p-8 flex flex-col gap-6 shadow-[0_0_30px_rgba(168,85,247,0.15)] relative overflow-hidden transform hover:-translate-y-2 transition-transform duration-500">
                            <div className="absolute top-0 right-0 py-1 px-3 bg-purple-600 text-[10px] font-bold uppercase tracking-widest text-white rounded-bl-xl">Unlimited</div>
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-fuchsia-500"></div>
                            <h3 className="text-xl font-bold text-purple-300">Pro Subsphere</h3>
                            <div className="text-5xl font-black text-white">$10<span className="text-lg text-purple-300/50 font-medium whitespace-nowrap"> / mo</span></div>
                            <ul className="space-y-4 flex-1 mt-4">
                                <li className="flex gap-3 text-sm text-zinc-200"><CheckCircle2 size={18} className="text-purple-500 shrink-0" /> Unlimited AI Roasts</li>
                                <li className="flex gap-3 text-sm text-zinc-200"><CheckCircle2 size={18} className="text-purple-500 shrink-0" /> Priority matrix execution</li>
                                <li className="flex gap-3 text-sm text-zinc-200"><CheckCircle2 size={18} className="text-purple-500 shrink-0" /> Max token processing</li>
                            </ul>
                            <a href="http://localhost:8080/oauth2/authorization/google" className="mt-4 w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-2xl flex items-center justify-center transition-all shadow-lg shadow-purple-500/25 block text-center">
                                Initialize Pro Uplink
                            </a>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Landing;