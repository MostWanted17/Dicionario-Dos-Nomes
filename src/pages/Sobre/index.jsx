import React from 'react';
import { View, Text, StyleSheet, Image, Linking, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Biblioteca de ícones do Expo
import Constants from 'expo-constants';  // Importando expo-constants

// Supondo que a imagem esteja na pasta 'assets'
import LogoImage from '../../../assets/images/adaptive-icon-bg.png';  // Substitua pelo caminho da sua imagem

export default function AboutScreen() {
  const appName = Constants.expoConfig.name;
  const appVersion = Constants.expoConfig.version;
  return (
    <View style={styles.container}>
      {/* Ícone do Aplicativo */}
      <Image source={LogoImage}  style={styles.appIcon} />

      {/* Texto sobre o aplicativo */}
      <Text style={styles.text}>
        Este aplicativo permite a busca de nomes e seus significados.
      </Text>

      {/* Versão do aplicativo */}
      <Text style={styles.version}>{appName}</Text>
      <Text style={styles.version}>{appVersion}</Text>

      {/* Ícones de LinkedIn e GitHub */}
      <View style={styles.socialContainer}>
        <TouchableOpacity onPress={() => Linking.openURL('https://www.linkedin.com/in/seu-perfil')}>
          <FontAwesome name="linkedin-square" size={40} color="#0077b5" />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => Linking.openURL('https://github.com/seu-usuario')}>
          <FontAwesome name="github" size={40} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6c6c6b',
    padding: 20,
  },
  appIcon: {
    width: 100, // Ajuste conforme o tamanho do ícone
    height: 100,
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  version: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 20,
  },
  socialContainer: {
    flexDirection: 'row',
    gap: 20, // Espaço entre os ícones
  },
});
