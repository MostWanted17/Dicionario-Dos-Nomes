import React, { useEffect, useState} from 'react';
import { View, Text, StyleSheet, Image, Linking, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Biblioteca de ícones do Expo
import Constants from 'expo-constants';  // Importando expo-constants
import { useTranslation } from 'react-i18next';
import styles from './style';

// Supondo que a imagem esteja na pasta 'assets'
import LogoImage from '../../../assets/images/adaptive-icon.png';  // Substitua pelo caminho da sua imagem
import namesDataF from '../../database/nomes_femininos_todas_paginas_ordenados.json';
import namesDataM from '../../database/nomes_masculinos_todas_paginas_ordenados.json';

export default function AboutScreen() {
  const { t, i18n } = useTranslation();
  const appName = Constants.expoConfig.name;
  const appVersion = Constants.expoConfig.version;
  
  // Contagem de nomes
  const totalNomesFemininos = namesDataF.length;
  const totalNomesMasculinos = namesDataM.length;

  const [isReady, setIsReady] = useState(false);
  
    useEffect(() => {
        if (i18n.isInitialized) {
          setIsReady(true);
        } else {
          i18n.on('initialized', () => setIsReady(true));
        }
      }, []);

  return (
    <View style={styles.container}>
      {/* Ícone do Aplicativo */}
      <Image source={LogoImage} style={styles.appIcon} />

      {/* Texto sobre o aplicativo */}
      <Text style={styles.text}>
        {t('Esteaplicativopermiteabuscadenomeseseussignificados')}
      </Text>

      {/* Exibição das quantidades de nomes */}
      <Text style={styles.stats}>📌 {t('NomesFemininos')} {totalNomesFemininos}</Text>
      <Text style={styles.stats}>📌 {t('NomesMasculinos')} {totalNomesMasculinos}</Text>

      {/* Versão do aplicativo */}
      <Text style={styles.version}>{t('AppName')}</Text>
      <Text style={styles.version}>{t('Versao')} {appVersion}</Text>

      {/* Ícones de LinkedIn e GitHub */}
      <View style={styles.socialContainer}>
        <TouchableOpacity onPress={() => Linking.openURL('https://www.linkedin.com/in/david-m-690521129/')}>
          <FontAwesome name="linkedin-square" size={40} color="#F5A9F7" />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => Linking.openURL('https://github.com/MostWanted17')}>
          <FontAwesome name="github" size={40} color="#F5A9F7" />
        </TouchableOpacity>
      </View>
    </View>
  );
}