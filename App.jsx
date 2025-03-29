import React, { useEffect } from 'react';
import { View, StatusBar } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AppOpenAd, TestIds, AdEventType } from 'react-native-google-mobile-ads';

// Importando as telas
import AboutScreen from './src/pages/Sobre/index.jsx';
import MasculinoScreen from './src/pages/Masculino/index.jsx';
import FemininoScreen from './src/pages/Feminino/index.jsx';
import PedidosScreen from './src/pages/Pedidos/index.jsx'; // Importando a tela de pedidos

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
        try {
          appOpenAd.show();
        } catch (error) {
          console.error('Erro ao exibir anúncio:', error);
        }
      });
  
      appOpenAd.addAdEventListener(AdEventType.ERROR, (error) => {
        console.error('Erro ao carregar anúncio:', error);
      });
    };
  
    loadAd();
  
    return () => {
      appOpenAd.removeAllListeners();
    };
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#2C1E5C' }}>
      <StatusBar backgroundColor="#2C1E5C" barStyle="light-content" />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ color, size }) => {
              let iconName;
              if (route.name === 'Masculino') iconName = 'male';
              else if (route.name === 'Feminino') iconName = 'female';
              else if (route.name === 'Pedidos') iconName = 'add'; // Ícone para a nova aba
              else if (route.name === 'Sobre') iconName = 'info';
              

              return <Icon name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#F5A9F7', // Rosa vibrante
            tabBarInactiveTintColor: '#ccc',
            tabBarStyle: { backgroundColor: '#2C1E5C' }, // Roxo escuro do ícone
          })}
        >
          <Tab.Screen name="Masculino" component={MasculinoScreen} />
          <Tab.Screen name="Feminino" component={FemininoScreen} />
          <Tab.Screen name="Pedidos" component={PedidosScreen} /> 
          <Tab.Screen name="Sobre" component={AboutScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </View>
  );
}
