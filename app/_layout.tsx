import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PlayerProvider } from '../context/PlayerContext';
import { HighlightsProvider } from '../context/HighlightsContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <PlayerProvider>
        <HighlightsProvider>
          <Stack>
            <Stack.Screen 
              name="(tabs)" 
              options={{ 
                headerShown: false,
              }} 
            />
          </Stack>
        </HighlightsProvider>
      </PlayerProvider>
    </SafeAreaProvider>
  );
}
