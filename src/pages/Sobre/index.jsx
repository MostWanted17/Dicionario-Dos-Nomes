import React from 'react';
import { View, Text, StyleSheet, Image, Linking, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Biblioteca de ícones do Expo
import Constants from 'expo-constants';  // Importando expo-constants

// Supondo que a imagem esteja na pasta 'assets'
import LogoImage from '../../../assets/images/adaptive-icon-bg.png';  // Substitua pelo caminho da sua imagem
import namesDataF from '../../database/nomes_femininos_todas_paginas_ordenados.json';
import namesDataM from '../../database/nomes_masculinos_todas_paginas_ordenados.json';

export default function AboutScreen() {
  const appName = Constants.expoConfig.name;
  const appVersion = Constants.expoConfig.version;
  
  // Contagem de nomes
  const totalNomesFemininos = namesDataF.length;
  const totalNomesMasculinos = namesDataM.length;

  return (
    <View style={styles.container}>
      {/* Ícone do Aplicativo */}
      <Image source={LogoImage}  style={styles.appIcon} />

      {/* Texto sobre o aplicativo */}
      <Text style={styles.text}>
        Este aplicativo permite a busca de nomes e seus significados.
      </Text>

      {/* Exibição das quantidades de nomes */}
      <Text style={styles.stats}>📌 Nomes Femininos: {totalNomesFemininos}</Text>
      <Text style={styles.stats}>📌 Nomes Masculinos: {totalNomesMasculinos}</Text>

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
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  stats: {
    fontSize: 16,
    color: '#ffd700', // Dourado para destaque
    marginBottom: 5,
  },
  version: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 20,
  },
  socialContainer: {
    flexDirection: 'row',
    gap: 20,
  },
});

