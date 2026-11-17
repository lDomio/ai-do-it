import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { colors } from '../theme';
import { Feather } from '@expo/vector-icons';

import { useAuth } from '../context/AuthContext';

import { HomeScreen } from '../screens/HomeScreen';
import { GigListScreen } from '../screens/GigListScreen';
import { GigDetailScreen } from '../screens/GigDetailScreen';
import { CreateGigScreen } from '../screens/CreateGigScreen';
import { OrdersScreen } from '../screens/OrdersScreen';
import { OrderDetailScreen } from '../screens/OrderDetailScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { LoginScreen } from '../screens/LoginScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const screenOptions = {
  headerStyle: { backgroundColor: colors.primary },
  headerTintColor: '#fff',
  headerTitleStyle: { fontWeight: '600' },
};

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="HomeMain" component={HomeScreen} options={{ title: 'AI Do It' }} />
    </Stack.Navigator>
  );
}

function ExploreStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="Explore" component={GigListScreen} options={{ title: 'Explorar' }} />
      <Stack.Screen
        name="GigDetail"
        component={GigDetailScreen}
        options={{ title: 'Detalle del servicio' }}
      />
    </Stack.Navigator>
  );
}

function OrdersStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="OrdersMain" component={OrdersScreen} options={{ title: 'Mis pedidos' }} />
      <Stack.Screen
        name="PedidoDetail"
        component={OrderDetailScreen}
        options={{ title: 'Detalle del pedido' }}
      />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} options={{ title: 'Mi perfil' }} />
      <Stack.Screen
        name="Crear servicio"
        component={CreateGigScreen}
        options={{ title: 'Crear servicio' }}
      />
    </Stack.Navigator>
  );
}

function TabIcon({ label, focused }) {
  const iconMap = {
    Inicio: 'home',
    Explorar: 'compass',
    Pedidos: 'clipboard',
    Perfil: 'user',
  };
  const iconName = iconMap[label] || 'circle';
  const iconColor = focused ? colors.primary : colors.textSecondary;
  return <Feather name={iconName} size={24} color={iconColor} />;
}

export function AppNavigator() {
  const { isAuthenticated } = useAuth();

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused }) => <TabIcon label={route.name} focused={focused} />,
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.textSecondary,
            headerShown: false,
          })}
        >
          <Tab.Screen name="Inicio" component={HomeStack} />
          <Tab.Screen name="Explorar" component={ExploreStack} />
          <Tab.Screen name="Pedidos" component={OrdersStack} />
          <Tab.Screen name="Perfil" component={ProfileStack} />
        </Tab.Navigator>
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
