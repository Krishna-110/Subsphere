import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Terminal, FileText, Briefcase, Zap, LogOut, LayoutDashboard, CreditCard, BrainCircuit, CheckCircle2 } from "lucide-react";
import axios from "axios";
import logoUrl from '../assets/logo.svg';

const Dashboard = () => {
    const [resume, setResume] = useState("");
    const [jd, setJd] = useState("");
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("analysis");
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/users/me", { withCredentials: true });
                setUser(response.data);
            } catch (error) {
                console.error("Failed to fetch user securely", error);
            }
        };
        fetchUser();
    }, []);

    const handleGenerate = async () => {
        setLoading(true);
        setResult("");
        try {
            const response = await axios.post(
                "http://localhost:8080/api/feature/generate",
                { resume, jobDescription: jd },
                { withCredentials: true }
            );
            setResult(response.data);
        } catch (error) {
            setResult("SYSTEM ERROR: Unauthorized. Please ensure you are logged in via the secure portal.");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#05030a] text-white flex selection:bg-purple-500/30 font-sans">

            {/* --- SIDEBAR --- */}
            <aside className="w-64 border-r border-purple-500/10 bg-[#05030a]/80 backdrop-blur-xl flex flex-col p-6 sticky top-0 h-screen hidden md:flex">
                <div className="flex items-center gap-3 mb-12">
                    <img src={logoUrl} alt="Logo" className="w-8 h-8 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.4)]" />
                    <span className="font-bold text-sm uppercase tracking-widest text-zinc-100">Subsphere</span>
                </div>

                <nav className="flex-1 space-y-2">
                    <button onClick={() => setActiveTab("analysis")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === "analysis" ? "bg-purple-600/20 text-purple-300 border border-purple-500/20" : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"}`}>
                        <LayoutDashboard size={18} /> Deep Scan
                    </button>
                    <button onClick={() => setActiveTab("billing")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === "billing" ? "bg-purple-600/20 text-purple-300 border border-purple-500/20" : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"}`}>
                        <CreditCard size={18} /> Plan & Billing
                    </button>
                </nav>

                <div className="pt-6 border-t border-purple-500/10 mt-auto">
                    <div className="bg-purple-900/10 border border-purple-500/20 rounded-xl p-4 mb-4">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-bold text-zinc-400 uppercase">Credits</span>
                            <span className="text-xs font-mono text-purple-400">
                                {user ? `${user.currentMonthUsage}/${user.plan?.monthlyFeatureLimit}` : "--/--"}
                            </span>
                        </div>
                        <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-gradient-to-r from-purple-600 to-fuchsia-400 h-1.5 transition-all duration-500" 
                                style={{ width: user && user.plan?.monthlyFeatureLimit > 0 ? `${Math.min((user.currentMonthUsage / user.plan.monthlyFeatureLimit) * 100, 100)}%` : '0%' }}
                            />
                        </div>
                    </div>
                    <a href="http://localhost:8080/logout" className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-zinc-500 hover:text-red-400 transition-colors">
                        <LogOut size={18} /> Terminate Session
                    </a>
                </div>
            </aside>

            {/* --- MAIN WORKSPACE --- */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
                {/* Ambient Glow */}
                <div className="absolute top-[-10%] left-[20%] w-[50vw] h-[50vh] bg-purple-900/20 blur-[120px] rounded-full pointer-events-none" />

                {/* Header */}
                <header className="h-20 border-b border-purple-500/10 flex items-center justify-between px-8 relative z-10 bg-[#05030a]/50 backdrop-blur-md shrink-0">
                    <h1 className="text-xl font-semibold text-zinc-100 flex items-center gap-2">
                        <Terminal size={20} className="text-purple-500" />
                        Intelligence Terminal
                    </h1>
                    <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">System Online</span>
                    </div>
                </header>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto p-8 relative z-10 scrollbar-thin scrollbar-thumb-purple-900/50 scrollbar-track-transparent">
                    {activeTab === "analysis" ? (
                        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

                            {/* LEFT: INPUTS (5 Cols) */}
                        <div className="lg:col-span-5 flex flex-col gap-6">

                            <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-6 flex flex-col gap-4 shadow-xl">
                                <div className="flex items-center gap-2 text-zinc-400 mb-2">
                                    <FileText size={16} />
                                    <span className="text-xs font-bold uppercase tracking-widest">Candidate Blueprint</span>
                                </div>
                                <textarea
                                    className="w-full h-48 bg-[#05030a] border border-purple-500/10 rounded-2xl p-4 text-sm font-mono text-zinc-300 focus:border-purple-500/50 outline-none transition-colors resize-none placeholder:text-zinc-700 shadow-inner"
                                    placeholder="Paste raw resume text..."
                                    onChange={(e) => setResume(e.target.value)}
                                />
                            </div>

                            <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-6 flex flex-col gap-4 shadow-xl">
                                <div className="flex items-center gap-2 text-zinc-400 mb-2">
                                    <Briefcase size={16} />
                                    <span className="text-xs font-bold uppercase tracking-widest">Target Parameters</span>
                                </div>
                                <textarea
                                    className="w-full h-48 bg-[#05030a] border border-purple-500/10 rounded-2xl p-4 text-sm font-mono text-zinc-300 focus:border-purple-500/50 outline-none transition-colors resize-none placeholder:text-zinc-700 shadow-inner"
                                    placeholder="Paste job description..."
                                    onChange={(e) => setJd(e.target.value)}
                                />
                            </div>

                            <button
                                onClick={handleGenerate}
                                disabled={loading}
                                className="w-full py-4 bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100"
                            >
                                {loading ? "Decrypting Matrix..." : "Execute AI Roast"} <Zap size={18} />
                            </button>
                        </div>

                        {/* RIGHT: AI OUTPUT (7 Cols) */}
                        <div className="lg:col-span-7 h-[calc(100vh-12rem)] min-h-[600px]">
                            <div className="h-full bg-zinc-900/30 border border-purple-500/20 rounded-3xl p-8 flex flex-col relative overflow-hidden shadow-2xl">
                                {/* Scanline Effect */}
                                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] opacity-20" />

                                <div className="flex items-center gap-3 text-purple-400 mb-6 relative z-10 border-b border-purple-500/10 pb-4">
                                    <Sparkles size={18} />
                                    <span className="text-xs font-bold uppercase tracking-widest">Intelligence Output Stream</span>
                                </div>

                                <div className="flex-1 overflow-y-auto relative z-10 font-mono text-sm leading-relaxed pr-4 scrollbar-thin scrollbar-thumb-purple-900/50">
                                    <AnimatePresence mode="wait">
                                        {result ? (
                                            <motion.div
                                                key="result"
                                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                                className="text-zinc-300 whitespace-pre-wrap"
                                            >
                                                {result}
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="empty"
                                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                                className="h-full flex flex-col items-center justify-center text-center opacity-30 uppercase tracking-[0.2em] text-xs text-purple-200"
                                            >
                                                <BrainCircuit size={48} className="mb-4 animate-pulse opacity-50" />
                                                <p>Awaiting Input Sequence...</p>
                                                <p className="mt-2 text-[10px] text-zinc-500">Subsphere AI Node Ready</p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                            </div>
                        </div>
                    ) : (
                        <div className="max-w-4xl mx-auto flex flex-col items-center gap-8 py-10">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">Nexus Subscription Uplink</h2>
                                <p className="text-zinc-500 mt-2">Current authorization tier: <span className="text-purple-400 font-bold uppercase">{user?.plan?.name || "FREE"}</span></p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                                {/* Free Plan */}
                                <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-8 flex flex-col gap-6 shadow-xl relative overflow-hidden">
                                    {user?.plan?.name === "FREE" && <div className="absolute top-0 left-0 w-full h-1 bg-zinc-500"></div>}
                                    <h3 className="text-xl font-bold text-white">Starter Protocol</h3>
                                    <div className="text-4xl font-black text-white">$0<span className="text-lg text-zinc-500 font-medium">/mo</span></div>
                                    <ul className="space-y-4 flex-1 mt-4">
                                        <li className="flex gap-3 text-sm text-zinc-300"><CheckCircle2 size={18} className="text-zinc-500 shrink-0" /> Limited AI Roasts ({user?.plan?.monthlyFeatureLimit || 10} credits max)</li>
                                        <li className="flex gap-3 text-sm text-zinc-300"><CheckCircle2 size={18} className="text-zinc-500 shrink-0" /> Standard processing speed</li>
                                        <li className="flex gap-3 text-sm text-zinc-500 opacity-50"><CheckCircle2 size={18} className="text-zinc-700 shrink-0" /> Priority intelligence queue</li>
                                    </ul>
                                </div>

                                {/* Pro Plan */}
                                <div className="bg-purple-900/10 border border-purple-500/30 rounded-3xl p-8 flex flex-col gap-6 shadow-[0_0_30px_rgba(168,85,247,0.15)] relative overflow-hidden transform hover:-translate-y-2 transition-transform duration-500">
                                    <div className="absolute top-0 right-0 py-1 px-3 bg-purple-600 text-[10px] font-bold uppercase tracking-widest text-white rounded-bl-xl">Recommended</div>
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-fuchsia-500"></div>
                                    <h3 className="text-xl font-bold text-purple-300">Pro Subsphere</h3>
                                    <div className="text-4xl font-black text-white">$10<span className="text-lg text-purple-300/50 font-medium">/mo</span></div>
                                    <ul className="space-y-4 flex-1 mt-4">
                                        <li className="flex gap-3 text-sm text-zinc-200"><CheckCircle2 size={18} className="text-purple-500 shrink-0" /> Unlimited AI Roasts (Bypass all limits)</li>
                                        <li className="flex gap-3 text-sm text-zinc-200"><CheckCircle2 size={18} className="text-purple-500 shrink-0" /> Priority matrix execution</li>
                                        <li className="flex gap-3 text-sm text-zinc-200"><CheckCircle2 size={18} className="text-purple-500 shrink-0" /> Max token processing</li>
                                    </ul>
                                    {user?.plan?.name !== "PRO" ? (
                                        <a href="http://localhost:8080/api/payment/checkout" className="mt-4 w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-2xl flex items-center justify-center transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] block text-center">
                                            Initialize Pro Uplink
                                        </a>
                                    ) : (
                                        <div className="mt-4 w-full py-4 bg-zinc-800 text-zinc-400 font-bold rounded-2xl flex items-center justify-center text-center border border-zinc-700">
                                            Clearance Activated
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;