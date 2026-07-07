import React, { useState, useEffect } from 'react';
import {
    View, Text, TextInput, ScrollView, TouchableOpacity,
    ActivityIndicator, KeyboardAvoidingView, Platform,
    Dimensions, Clipboard, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    Sparkles, Terminal, FileText, Briefcase, Zap,
    LogOut, LayoutDashboard, CreditCard, BrainCircuit,
    CheckCircle2, Upload, Clipboard as ClipboardIcon, AlertTriangle
} from 'lucide-react-native';
import axios from 'axios';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

// Dynamically select API base URL based on development or production mode
const API_BASE_URL = __DEV__
  ? "http://192.168.29.245.nip.io:8080"
  : "https://subsphere-jckj.onrender.com";

const Dashboard = () => {
    const router = useRouter();
    const params = useLocalSearchParams();

    // Form State
    const [resume, setResume] = useState("");
    const [jd, setJd] = useState("");

    // UI State
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);
    const [extracting, setExtracting] = useState(false);
    const [activeTab, setActiveTab] = useState("analysis");
    const [user, setUser] = useState<any>(null);

    // Initial load: Persistence and Profile Fetching
    useEffect(() => {
        const initializeAuth = async () => {
            let token = params.token as string;
            console.log("DEBUG: [initializeAuth] Token from params:", token);

            if (token) {
                // If we got a new token from deep link, save it!
                await AsyncStorage.setItem('userToken', token);
            } else {
                // Otherwise, try to recover the old one
                const savedToken = await AsyncStorage.getItem('userToken');
                console.log("DEBUG: [initializeAuth] Recovered token from storage:", savedToken);
                if (savedToken) token = savedToken;
            }

            if (token) {
                // Set the default Authorization header for all future axios requests
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                console.log("DEBUG: [initializeAuth] Token established, calling fetchProfile()...");
                fetchProfile();
            } else {
                // No token anywhere? Back to base.
                console.log("DEBUG: [initializeAuth] No token found anywhere, redirecting to login page (index)");
                router.replace("/");
            }
        };

        initializeAuth();
    }, [params.token]);

    const fetchProfile = async () => {
        try {
            console.log("DEBUG: [fetchProfile] Fetching profile from:", `${API_BASE_URL}/api/users/me`);
            const response = await axios.get(`${API_BASE_URL}/api/users/me`);
            console.log("DEBUG: [fetchProfile] Profile fetch success:", response.data);
            setUser(response.data);
        } catch (error) {
            console.log("DEBUG: [fetchProfile] Authentication failed. Error details:", error);
            if (axios.isAxiosError(error)) {
                console.log("DEBUG: [fetchProfile] Axios error status:", error.response?.status);
                console.log("DEBUG: [fetchProfile] Axios error data:", error.response?.data);
            }
            handleLogout();
        }
    };

    const handleLogout = async () => {
        await AsyncStorage.removeItem('userToken');
        delete axios.defaults.headers.common['Authorization'];
        router.replace("/");
    };

    const handleUpgrade = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/api/payment/checkout`);
            
            if (response.data && response.data.url) {
                await WebBrowser.openBrowserAsync(response.data.url);
            } else {
                Alert.alert("Billing Error", "Failed to construct billing terminal.");
            }
        } catch (error) {
            console.log(error);
            Alert.alert("Navigation Error", "Could not establish a secure uplink to Stripe.");
        } finally {
            setLoading(false);
        }
    };

    const handlePaste = async (type: 'resume' | 'jd') => {
        const text = await Clipboard.getString();
        if (type === 'resume') setResume(text);
        else setJd(text);
    };

    const pickDocument = async () => {
        try {
            console.log("DEBUG: [pickDocument] Opening DocumentPicker...");
            const res = await DocumentPicker.getDocumentAsync({
                type: 'application/pdf',
                copyToCacheDirectory: true,
            });

            if (res.canceled) {
                console.log("DEBUG: [pickDocument] Document picking cancelled.");
                return;
            }

            setExtracting(true);
            const formData = new FormData();

            const file = res.assets[0];
            console.log("DEBUG: [pickDocument] File picked successfully:", file.name, "URI:", file.uri);

            // Append file with default name fallback if not present
            formData.append('file', {
                uri: file.uri,
                type: 'application/pdf',
                name: file.name || 'resume.pdf',
            } as any);

            console.log("DEBUG: [pickDocument] Sending POST request to:", `${API_BASE_URL}/api/feature/extract-pdf`);

            // Note: Omit 'Content-Type': 'multipart/form-data' to let Axios automatically 
            // generate the header with the correct boundary parameter!
            const response = await axios.post(`${API_BASE_URL}/api/feature/extract-pdf`, formData, {
                headers: { 
                    'Accept': 'application/json'
                }
            });

            console.log("DEBUG: [pickDocument] PDF parsing success. Extracted text size:", response.data?.length);
            setResume(response.data);
            Alert.alert("Success", "Resume blueprint decrypted successfully.");
        } catch (err) {
            console.log("DEBUG: [pickDocument] PDF extraction failed with error:", err);
            if (axios.isAxiosError(err)) {
                console.log("DEBUG: [pickDocument] Axios response status:", err.response?.status);
                console.log("DEBUG: [pickDocument] Axios response data:", err.response?.data);
            }
            Alert.alert("Error", "FAILED to extract PDF data. Is the backend server running?");
        } finally {
            setExtracting(false);
        }
    };

    const handleGenerate = async () => {
        if (!resume || !jd) {
            Alert.alert("Incomplete Data", "Both Resume and Job Description are required for scan.");
            return;
        }

        setLoading(true);
        setResult("");
        try {
            const response = await axios.post(
                `${API_BASE_URL}/api/feature/generate`,
                { resume, jobDescription: jd }
            );
            setResult(response.data);
            // Refresh profile to update credits
            fetchProfile();
        } catch (error) {
            setResult("CRITICAL FAILURE: Intelligence stream interrupted. Check auth status.");
        }
        setLoading(false);
    };

    // Helper to render the roast sections with color codings
    const renderRoast = () => {
        if (!result) return null;

        // Simple parsing for Bold headers
        const sections = result.split(/\d\.\s\*\*/); // Split by "1. **", "2. **", etc.

        return (
            <View className="gap-6">
                {result.includes("THE GOOD") && (
                    <View className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4">
                        <Text className="text-emerald-400 font-black text-xs uppercase tracking-widest mb-2">The Good</Text>
                        <Text className="text-zinc-300 text-sm leading-6">{result.split("THE GOOD**:")[1]?.split("2.")[0]?.trim() || result}</Text>
                    </View>
                )}
                {result.includes("THE BAD") && (
                    <View className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4">
                        <Text className="text-amber-400 font-black text-xs uppercase tracking-widest mb-2">The Bad</Text>
                        <Text className="text-zinc-300 text-sm leading-6">{result.split("THE BAD**:")[1]?.split("3.")[0]?.trim()}</Text>
                    </View>
                )}
                {result.includes("THE UGLY") && (
                    <View className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4">
                        <View className="flex-row items-center mb-2">
                            <AlertTriangle size={14} color="#f87171" />
                            <Text className="text-red-400 font-black text-xs uppercase tracking-widest ml-2">The Ugly</Text>
                        </View>
                        <Text className="text-zinc-300 text-sm leading-6 italic">{result.split("THE UGLY**:")[1]?.trim()}</Text>
                    </View>
                )}
                {!result.includes("THE GOOD") && <Text className="text-zinc-200 text-sm leading-7">{result}</Text>}
            </View>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-[#13072e]">
            {/* Header */}
            <View className="h-16 border-b border-purple-500/10 flex-row items-center justify-between px-6 bg-[#13072e]/80 z-20">
                <View className="flex-row items-center space-x-2">
                    <Terminal size={20} color="#c084fc" />
                    <Text className="text-xl font-bold text-zinc-100 ml-2">Terminal</Text>
                </View>
                {user && (
                    <TouchableOpacity onPress={() => setActiveTab('billing')} className="w-10 h-10 rounded-full border border-purple-500/30 overflow-hidden bg-purple-900/50 items-center justify-center">
                        {user.profileImageUrl ? (
                            <View className="w-full h-full bg-purple-500 items-center justify-center">
                                <Text className="text-white font-bold">{user.name?.[0]}</Text>
                            </View>
                        ) : (
                            <Text className="text-white font-bold">{user.name?.[0]}</Text>
                        )}
                    </TouchableOpacity>
                )}
            </View>

            {/* Tab Navigation */}
            <View className="flex-row px-4 py-4 gap-3 bg-[#13072e]">
                <TouchableOpacity
                    onPress={() => setActiveTab('analysis')}
                    className={`flex-1 flex-row items-center justify-center py-4 rounded-2xl ${activeTab === 'analysis' ? 'bg-purple-600/30 border border-purple-500/30' : 'bg-white/5 border border-white/5'}`}
                >
                    <LayoutDashboard size={16} color={activeTab === 'analysis' ? '#e9d5ff' : '#71717a'} />
                    <Text className={`ml-2 text-xs font-black uppercase tracking-widest ${activeTab === 'analysis' ? 'text-purple-100' : 'text-zinc-500'}`}>Scan</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setActiveTab('billing')}
                    className={`flex-1 flex-row items-center justify-center py-4 rounded-2xl ${activeTab === 'billing' ? 'bg-purple-600/30 border border-purple-500/30' : 'bg-white/5 border border-white/5'}`}
                >
                    <CreditCard size={16} color={activeTab === 'billing' ? '#e9d5ff' : '#71717a'} />
                    <Text className={`ml-2 text-xs font-black uppercase tracking-widest ${activeTab === 'billing' ? 'text-purple-100' : 'text-zinc-500'}`}>Nexus</Text>
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-4">
                    {activeTab === 'analysis' ? (
                        <View className="gap-6 pb-12">
                            {/* Resume Input Panel */}
                            <View className="bg-purple-900/20 border border-purple-500/20 rounded-[32px] p-6 shadow-2xl overflow-hidden">
                                <View className="flex-row items-center justify-between mb-4">
                                    <View className="flex-row items-center">
                                        <FileText size={16} color="#a855f7" />
                                        <Text className="text-[10px] font-black uppercase tracking-widest text-purple-300 ml-2">Resume Blueprint</Text>
                                    </View>
                                    <View className="flex-row gap-2">
                                        <TouchableOpacity onPress={pickDocument} className="p-2 bg-purple-500/20 rounded-lg border border-purple-500/40">
                                            <Upload size={14} color="#e9d5ff" />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => handlePaste('resume')} className="p-2 bg-purple-500/20 rounded-lg border border-purple-500/40">
                                            <ClipboardIcon size={14} color="#e9d5ff" />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {extracting ? (
                                    <View className="w-full h-32 bg-[#0a0518] rounded-2xl items-center justify-center">
                                        <ActivityIndicator color="#a855f7" />
                                        <Text className="text-[10px] text-purple-400 mt-2 uppercase tracking-widest">Decrypting File...</Text>
                                    </View>
                                ) : (
                                    <TextInput
                                        className="w-full h-32 bg-[#0a0518] border border-purple-500/10 rounded-2xl p-4 text-sm text-zinc-300 text-left align-top"
                                        placeholder="Paste content or upload PDF..."
                                        placeholderTextColor="#4c1d95"
                                        multiline
                                        onChangeText={setResume}
                                        value={resume}
                                    />
                                )}
                            </View>

                            {/* JD Input Panel */}
                            <View className="bg-purple-900/20 border border-purple-500/20 rounded-[32px] p-6 shadow-2xl">
                                <View className="flex-row items-center justify-between mb-4">
                                    <View className="flex-row items-center">
                                        <Briefcase size={16} color="#a855f7" />
                                        <Text className="text-[10px] font-black uppercase tracking-widest text-purple-300 ml-2">Job Parameters</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => handlePaste('jd')} className="p-2 bg-purple-500/20 rounded-lg border border-purple-500/40">
                                        <ClipboardIcon size={14} color="#e9d5ff" />
                                    </TouchableOpacity>
                                </View>
                                <TextInput
                                    className="w-full h-32 bg-[#0a0518] border border-purple-500/10 rounded-2xl p-4 text-sm text-zinc-300 text-left align-top"
                                    placeholder="Paste job description..."
                                    placeholderTextColor="#4c1d95"
                                    multiline
                                    onChangeText={setJd}
                                    value={jd}
                                />
                            </View>

                            <View className="items-center w-full">
                                <TouchableOpacity
                                    onPress={handleGenerate}
                                    disabled={loading || !resume || !jd}
                                    activeOpacity={0.8}
                                    className={`w-[90%] py-4 bg-purple-600 rounded-[22px] flex-row items-center justify-center shadow-2xl shadow-purple-900 ${(loading || !resume || !jd) ? 'opacity-40' : 'opacity-100'}`}
                                >
                                    {loading ? (
                                        <ActivityIndicator color="white" />
                                    ) : (
                                        <>
                                            <Text className="text-white font-black text-[14px] mr-3 uppercase tracking-[2px]">Execute</Text>
                                            <Zap size={16} color="white" fill="white" />
                                        </>
                                    )}
                                </TouchableOpacity>
                            </View>

                            {/* Result Stream Area */}
                            <View className="bg-purple-900/10 border border-purple-500/20 rounded-[32px] p-7 min-h-[300px] mb-10">
                                <View className="flex-row items-center space-x-2 mb-6 border-b border-purple-500/10 pb-4">
                                    <Sparkles size={18} color="#c084fc" />
                                    <Text className="text-[10px] font-black uppercase tracking-widest text-purple-300 ml-2">Intelligence Stream</Text>
                                </View>

                                {result ? renderRoast() : (
                                    <View className="flex-1 items-center justify-center opacity-40 py-12">
                                        <BrainCircuit size={48} color="#c084fc" className="mb-6" />
                                        <Text className="uppercase tracking-widest text-[10px] text-purple-300 text-center font-bold">Awaiting Input sequence...</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    ) : (
                        <View className="gap-6 pb-12">
                            {/* Profile Header */}
                            <View className="items-center mb-8 mt-4">
                                <View className="w-24 h-24 rounded-full border-2 border-purple-500/50 p-1 mb-4">
                                    <View className="w-full h-full rounded-full bg-purple-600 items-center justify-center overflow-hidden">
                                        <Text className="text-white text-3xl font-black">{user?.name?.[0]}</Text>
                                    </View>
                                </View>
                                <Text className="text-3xl font-black text-white tracking-tight">{user?.name || "Initializing..."}</Text>
                                <Text className="text-purple-400/60 mt-1 font-bold">Clearance: <Text className="text-purple-300 uppercase">{user?.plan?.name || "FREE"}</Text></Text>
                            </View>

                            {/* Stats Progress */}
                            <View className="bg-purple-900/20 border border-purple-500/20 rounded-[32px] p-8 shadow-xl">
                                <View className="flex-row justify-between mb-4 items-center">
                                    <View>
                                        <Text className="text-[10px] font-black text-purple-300/60 uppercase tracking-widest mb-1">Matrix Utilization</Text>
                                        <Text className="text-xl font-bold text-zinc-100">Monthly Allocation</Text>
                                    </View>
                                    <Text className="text-lg font-black text-purple-400">
                                        {user ? `${user.currentMonthUsage}/${user.plan?.monthlyFeatureLimit}` : "0/0"}
                                    </Text>
                                </View>

                                <View className="w-full bg-purple-950 rounded-full h-4 overflow-hidden border border-purple-500/20">
                                    <View
                                        className="bg-purple-500 h-full rounded-full"
                                        style={{ width: user && user.plan?.monthlyFeatureLimit > 0 ? `${Math.min((user.currentMonthUsage / user.plan.monthlyFeatureLimit) * 100, 100)}%` : '0%' }}
                                    />
                                </View>
                                <Text className="text-[10px] text-zinc-500 mt-4 font-bold text-center italic">Usage resets at the next billing cycle</Text>
                            </View>

                            {/* Pro Plan Card */}
                            <View className="bg-purple-600/10 border border-purple-500/30 rounded-[32px] p-8 relative overflow-hidden mt-2 shadow-2xl">
                                {user?.plan?.name === "PRO" && (
                                    <View className="absolute top-0 right-0 bg-purple-600 px-6 py-2 rounded-bl-2xl z-20">
                                        <Text className="text-[10px] font-black text-white uppercase tracking-widest">Active Link</Text>
                                    </View>
                                )}
                                <View className="absolute top-0 left-0 w-full h-1 bg-purple-500" />

                                <Text className="text-xl font-bold text-purple-200 mb-2">Pro Subsphere</Text>
                                <Text className="text-zinc-500 text-xs mb-6 font-medium">Unlock the full power of the AI engine.</Text>

                                <View className="gap-4">
                                    <View className="flex-row items-center">
                                        <CheckCircle2 color="#a855f7" size={18} />
                                        <Text className="text-zinc-200 text-sm ml-3 font-medium">Unlimited Decryptions</Text>
                                    </View>
                                    <View className="flex-row items-center">
                                        <CheckCircle2 color="#a855f7" size={18} />
                                        <Text className="text-zinc-200 text-sm ml-3 font-medium">Priority Matrix Access</Text>
                                    </View>
                                </View>

                                {user?.plan?.name !== "PRO" ? (
                                    <TouchableOpacity
                                        onPress={handleUpgrade}
                                        className="mt-8 py-5 bg-purple-600 rounded-[24px] items-center"
                                    >
                                        <Text className="text-white font-black uppercase tracking-wider">Initialize PRO Uplink</Text>
                                    </TouchableOpacity>
                                ) : (
                                    <View className="mt-8 py-5 bg-purple-900/40 border border-purple-500/20 rounded-[24px] items-center">
                                        <Text className="text-purple-300 font-black uppercase tracking-wider">System Optimal</Text>
                                    </View>
                                )}
                            </View>

                            <TouchableOpacity
                                onPress={handleLogout}
                                className="flex-row items-center justify-center py-5 mt-6 bg-red-500/5 border border-red-500/10 rounded-[28px]"
                            >
                                <LogOut size={18} color="#f87171" />
                                <Text className="text-red-400 font-black ml-2 uppercase tracking-widest text-[10px]">Terminate Session</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default Dashboard;
