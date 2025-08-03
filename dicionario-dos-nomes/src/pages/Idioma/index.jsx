import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import styles from './style';

export default function IdiomaScreen() {
  const { t, i18n } = useTranslation();

  const mudarIdioma = async (lang) => {
    await i18n.changeLanguage(lang);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('EscolhaIdioma')}</Text>

      <TouchableOpacity style={styles.button} onPress={() => mudarIdioma('pt')}>
        <Text style={styles.buttonText}>{t('Portugues')}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => mudarIdioma('en')}>
        <Text style={styles.buttonText}>{t('Ingles')}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => mudarIdioma('fr')}>
        <Text style={styles.buttonText}>{t('Frances')}</Text>
      </TouchableOpacity>
    </View>
  );
}
