import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import AsyncStorage from '@react-native-async-storage/async-storage';

const resources = {
  en: {
    translation: {
      Masculino: 'Male',
      Feminino: 'Female',
      Pedidos: 'Orders',
      Sobre: 'About',
      Idioma: 'Language',
      EscolhaIdioma: 'Choose your language',
      Portugues: 'Portuguese',
      Ingles: 'English',
      Significado: 'Meaning',
      Origem: 'Origin',
      ModoLista: 'List Mode',
      ModoCard: 'Card Mode',
      Buscar: 'Search',
      NenhumNomeEncontrado: 'No names found'
    }
  },
  pt: {
    translation: {
      Masculino: 'Masculino',
      Feminino: 'Feminino',
      Pedidos: 'Pedidos',
      Sobre: 'Sobre',
      Idioma: 'Idioma',
      EscolhaIdioma: 'Escolha o idioma',
      Portugues: 'Português',
      Ingles: 'Inglês',
      Significado: 'Significado',
      Origem: 'Origem',
      ModoLista: 'Modo Lista',
      ModoCard: 'Modo Card',
      Buscar: 'Buscar',
      NenhumNomeEncontrado: 'Nenhum nome encontrado'
    }
  }
};

const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: async (cb) => {
    const savedData = await AsyncStorage.getItem('user-language');
    const locale = savedData || RNLocalize.getLocales()[0].languageCode;
    cb(locale);
  },
  init: () => { },
  cacheUserLanguage: async (lng) => {
    await AsyncStorage.setItem('user-language', lng);
  }
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'pt',
    compatibilityJSON: 'v3',
    resources,
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
