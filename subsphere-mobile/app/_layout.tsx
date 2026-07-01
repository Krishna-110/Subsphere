import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import '../global.css';

// To use NativeWind, we should import global CSS or just configure it
// NativeWind v2 works out of the box with Babel plugin

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: '#13072e' }}>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#13072e' }
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="dashboard" />
        </Stack>
      </View>
    </SafeAreaProvider>
  );
}
