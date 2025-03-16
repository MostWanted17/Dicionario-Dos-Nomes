import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AppOpenAd, TestIds, AdEventType } from 'react-native-google-mobile-ads';

// Importando as telas
import AboutScreen from './src/pages/Sobre/index.jsx';
import MasculinoScreen from './src/pages/Masculino/index.jsx';
import FemininoScreen from './src/pages/Femenino/index.jsx';

const adUnitId = __DEV__ ? TestIds.APP_OPEN : 'ca-app-pub-5781907132925477/9911463270'; // Teste e Produção

const Tab = createBottomTabNavigator();

export default function App() {
  useEffect(() => {
    const appOpenAd = AppOpenAd.createForAdRequest(adUnitId, {
      requestNonPersonalizedAdsOnly: true,
    });

    const loadAd = () => {
      appOpenAd.load();
      appOpenAd.addAdEventListener(AdEventType.LOADED, () => {
        console.log('Ad carregado!');
        appOpenAd.show(); // Exibe o anúncio ao abrir o app
      });
    };

    loadAd(); // Carrega e exibe o anúncio ao abrir o app

    return () => {
      appOpenAd.removeAllListeners(); // Remove os eventos ao desmontar o app
    };
  }, []);

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Masculino') iconName = 'male';
            else if (route.name === 'Feminino') iconName = 'female';
            else if (route.name === 'Sobre') iconName = 'info';

            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#3498db',
          tabBarInactiveTintColor: '#ccc',
          tabBarStyle: { backgroundColor: '#1f1f1e' },
        })}
      >
        <Tab.Screen name="Masculino" component={MasculinoScreen} />
        <Tab.Screen name="Feminino" component={FemininoScreen} />
        <Tab.Screen name="Sobre" component={AboutScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
