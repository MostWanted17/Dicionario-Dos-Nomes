import React, { useState, useRef } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';


// Importando os dados do arquivo JSON
import namesData from './src/database/nomes.json';
import AboutScreen from './src/pages/Sobre/index.js';
import MasculinoScreen from './src/pages/Masculino/index.js'; // Importando o MasculinoScreen
import FemininoScreen from './src/pages/Femenino/index.js';  // Você pode criar o FemininoScreen de maneira similar

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false, // Esconde o título do topo
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