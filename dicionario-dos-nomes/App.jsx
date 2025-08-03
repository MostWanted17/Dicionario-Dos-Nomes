import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text, StatusBar, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import i18n from './src/services/i18n';
import { useTranslation } from 'react-i18next';

// Telas
import AboutScreen from './src/pages/Sobre/index.jsx';
import MasculinoScreen from './src/pages/Masculino/index.jsx';
import FemininoScreen from './src/pages/Feminino/index.jsx';
import PedidosScreen from './src/pages/Pedidos/index.jsx';
import IdiomaScreen from './src/pages/Idioma/index.jsx';

// Serviço de anúncios
import { setupAppOpenAd } from './src/services/ads';

const Tab = createBottomTabNavigator();

const getFlagEmoji = (lang) => {
  switch (lang) {
    case 'pt': return '🇧🇷';
    case 'en': return '🇺🇸';
    case 'fr': return '🇫🇷';
    default: return '🌐';
  }
};

function MainAppContent() {
  const { t, i18n } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <NavigationContainer key={i18n.language}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            if (route.name === 'Idioma') {
              return <Text style={{ fontSize: size }}>{getFlagEmoji(i18n.language)}</Text>;
            }

            let iconName;
            if (route.name === 'Masculino') iconName = 'male';
            else if (route.name === 'Feminino') iconName = 'female';
            else if (route.name === 'Pedidos') iconName = 'add';
            else if (route.name === 'Sobre') iconName = 'info';

            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#F5A9F7',
          tabBarInactiveTintColor: '#ccc',
          tabBarStyle: {
            backgroundColor: '#2C1E5C',
            paddingBottom: Math.max(0, (insets?.bottom || 0) - 10),
            height: 50 + Math.max(0, (insets?.bottom || 0) - 10),
          },
        })}
      >
        <Tab.Screen name="Masculino" component={MasculinoScreen} options={{ title: t('Masculino') }} />
        <Tab.Screen name="Feminino" component={FemininoScreen} options={{ title: t('Feminino') }} />
        <Tab.Screen name="Pedidos" component={PedidosScreen} options={{ title: t('Pedidos') }} />
        <Tab.Screen name="Sobre" component={AboutScreen} options={{ title: t('Sobre') }} />
        <Tab.Screen name="Idioma" component={IdiomaScreen} options={{ title: t('Idioma') }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Configuração simplificada para Edge-to-Edge
    if (Platform.OS === 'android') {
      StatusBar.setBarStyle('light-content');
      // Não configuramos mais setStatusBarColor ou setTranslucent diretamente
    }

    if (i18n.isInitialized) {
      setIsReady(true);
    } else {
      i18n.on('initialized', () => setIsReady(true));
    }

    const removeAdListeners = setupAppOpenAd();
    return () => {
      removeAdListeners();
    };
  }, []);

  if (!isReady) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2C1E5C'
      }}>
        <StatusBar barStyle="light-content" />
        <ActivityIndicator size="large" color="#F5A9F7" />
        <Text style={{ color: '#fff', marginTop: 10 }}>Carregando idioma...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#2C1E5C' }}>
      <StatusBar barStyle="light-content" />
      <MainAppContent />
    </View>
  );
}

export default function AppWrapper() {
  return (
    <SafeAreaProvider>
      <App />
    </SafeAreaProvider>
  );
}