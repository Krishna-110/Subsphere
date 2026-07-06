import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Sparkles, BrainCircuit } from 'lucide-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';

import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Image } from 'expo-image';

const { width } = Dimensions.get('window');

// Dynamically select URL based on development or production mode
const AUTH_URL = __DEV__
  ? "http://192.168.29.245.nip.io:8080/oauth2/authorization/google"
  : "https://subsphere-jckj.onrender.com/oauth2/authorization/google";

const GOOGLE_LOGO_URL = "https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png";

const Landing = () => {
  const router = useRouter();

  // 1. AUTO LOGIN CHECK
  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        router.replace('/dashboard');
      }
    };
    checkToken();
  }, []);

  const handleLogin = async () => {
    try {
      await WebBrowser.openBrowserAsync(AUTH_URL);
    } catch (error) {
      console.log("Auth Error:", error);
    }
  };

  // Basic animations mimicking the web aurora glow
  const glowScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.3);

  useEffect(() => {
    glowScale.value = withRepeat(withTiming(1.2, { duration: 8000, easing: Easing.inOut(Easing.ease) }), -1, true);
    glowOpacity.value = withRepeat(withTiming(0.4, { duration: 8000, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, []);

  const animatedGlowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glowScale.value }],
    opacity: glowOpacity.value,
  }));

  return (
    <SafeAreaView className="flex-1 bg-[#13072e]" style={{ flex: 1 }}>
      {/* Background glow element */}
      <Animated.View
        className="absolute w-[100vw] h-[100vw] bg-purple-600/30 rounded-full blur-[100px] top-[-20%] left-[-20%] pointer-events-none"
        style={animatedGlowStyle}
      />

      {/* ---------------- NAVIGATION ---------------- */}
      <View className="flex-row items-center justify-between px-6 py-4 z-50">
        <View className="flex-row items-center space-x-3">
          <View className="w-10 h-10 rounded-full bg-purple-500/20 border border-purple-500/50 shadow-[#a855f7]/40 shadow-lg items-center justify-center">
            <Text className="text-white font-bold text-lg">S</Text>
          </View>
          <Text className="font-bold text-xs uppercase tracking-widest text-zinc-100 ml-2">Subsphere</Text>
        </View>
      </View>

      {/* ---------------- HERO AREA (SINGLE PAGE FULL HEIGHT) ---------------- */}
      <View className="flex-1 items-center justify-center px-6 z-10 w-full mb-10">

        <View className="flex-row items-center space-x-2 px-5 py-2 rounded-full bg-purple-900/40 border border-purple-500/40 mb-8">
          <Sparkles size={14} color="#e9d5ff" />
          <Text className="text-[10px] font-bold text-purple-200 uppercase tracking-widest ml-1">Intelligence Node v2</Text>
        </View>

        <Text className="text-4xl sm:text-5xl font-black tracking-tighter text-white text-center leading-tight">
          Survive the interview.{'\n'}
          <Text className="text-purple-400">Let AI roast you.</Text>
        </Text>

        <Text className="mt-6 text-base text-zinc-300 text-center font-light leading-relaxed px-4">
          Subsphere analyzes your blueprint against target job requirements, exposing critical flaws before the recruiter does.
        </Text>

        {/* Abstract Node visual to look techy but space-efficient */}
        <View className="mt-12 mb-12 w-full max-w-[280px] h-36 rounded-3xl bg-purple-900/30 border border-purple-500/30 shadow-lg p-6 justify-center relative overflow-hidden">
          <View className="absolute top-0 left-0 w-full h-1 bg-purple-500/50" />
          <BrainCircuit color="#c084fc" size={28} className="mb-4" />
          <View className="w-[90%] h-2 bg-purple-400/20 rounded-full mb-3" />
          <View className="w-[70%] h-2 bg-purple-400/20 rounded-full" />
        </View>

        <View className="flex-col w-full mt-auto mb-6 gap-4">
          <TouchableOpacity
            onPress={handleLogin}
            className="w-full py-4 rounded-full flex-row items-center justify-center bg-white shadow-lg shadow-white/10"
          >
            {/* Real Google G Logo */}
            <Image
              source={{ uri: GOOGLE_LOGO_URL }}
              style={{ width: 20, height: 20, marginRight: 12 }}
              contentFit="contain"
            />
            <Text className="font-bold text-[#13072e] text-base">Sign in with Google</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Landing;
