import { StatusBar } from 'expo-status-bar';
import { ApiConfigProvider } from './src/context/ApiConfigContext';
import { DemoRoleProvider } from './src/context/DemoRoleContext';
import { AuthProvider } from './src/context/AuthContext';
import { AppProvider } from './src/context/AppContext';
import { AppNavigator } from './src/navigation/AppNavigator';

// IMPORTANT: cuando uses Expo Go en un dispositivo físico o emulador Android,
// Configure EXPO_PUBLIC_API_URL for a physical device or emulator.
// En web/emulador iOS local dejar http://localhost:3000 funciona correctamente.
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export default function App() {
  return (
    <ApiConfigProvider baseUrl={API_BASE_URL}>
      <DemoRoleProvider>
        <AuthProvider>
          <AppProvider>
            <AppNavigator />
            <StatusBar style="auto" />
          </AppProvider>
        </AuthProvider>
      </DemoRoleProvider>
    </ApiConfigProvider>
  );
}
