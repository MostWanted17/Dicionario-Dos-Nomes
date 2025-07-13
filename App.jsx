import React, { useEffect, useState } from 'react';
import { View, StatusBar, Text, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AppOpenAd, TestIds, AdEventType } from 'react-native-google-mobile-ads';
import i18n from './src/services/i18n'; // Importe a instância do i18nr
import { useTranslation } from 'react-i18next'; // Adicione esta linha


// Telas
import AboutScreen from './src/pages/Sobre/index.jsx';
import MasculinoScreen from './src/pages/Masculino/index.jsx';
import FemininoScreen from './src/pages/Feminino/index.jsx';
import PedidosScreen from './src/pages/Pedidos/index.jsx';
import IdiomaScreen from './src/pages/Idioma/index.jsx';

const Tab = createBottomTabNavigator();
const adUnitId = __DEV__ ? TestIds.APP_OPEN : 'ca-app-pub-5781907132925477/9911463270';

const getFlagEmoji = (lang) => {
  switch (lang) {
    case 'pt': return '🇧🇷';
    case 'en': return '🇺🇸';
    default: return '🌐';
  }
};

function MainApp() {
  const { t, i18n } = useTranslation(); // Use o hook aqui

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
          tabBarStyle: { backgroundColor: '#2C1E5C' },
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

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (i18n.isInitialized) {
      setIsReady(true);
    } else {
      i18n.on('initialized', () => setIsReady(true));
    }

    const appOpenAd = AppOpenAd.createForAdRequest(adUnitId, {
      requestNonPersonalizedAdsOnly: true,
    });

    appOpenAd.load();

    appOpenAd.addAdEventListener(AdEventType.LOADED, () => {
      try {
        appOpenAd.show();
      } catch (e) {
        console.log('Erro ao mostrar anúncio:', e);
      }
    });

    appOpenAd.addAdEventListener(AdEventType.ERROR, (e) => {
      console.log('Erro ao carregar anúncio:', e);
    });

    return () => {
      appOpenAd.removeAllListeners();
    };
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#2C1E5C' }}>
        <StatusBar backgroundColor="#2C1E5C" barStyle="light-content" />
        <ActivityIndicator size="large" color="#F5A9F7" />
        <Text style={{ color: '#fff', marginTop: 10 }}>Carregando idioma...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#2C1E5C' }}>
      <StatusBar backgroundColor="#2C1E5C" barStyle="light-content" />
      <MainApp />
    </View>
  );
}