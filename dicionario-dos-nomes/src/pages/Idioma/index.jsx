import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#2C1E5C' },
  title: { fontSize: 24, color: '#fff', marginBottom: 20 },
  button: { backgroundColor: '#F5A9F7', padding: 15, borderRadius: 10, marginVertical: 10, width: 200 },
  buttonText: { color: '#2C1E5C', textAlign: 'center', fontWeight: 'bold' }
});
