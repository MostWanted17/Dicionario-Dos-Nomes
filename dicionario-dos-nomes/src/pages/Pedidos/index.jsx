import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, SafeAreaView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card } from 'react-native-elements';
import { pedido } from '../../api/sendPedido';
import { useTranslation } from 'react-i18next';
import styles from './style';

const STORAGE_KEY = '@ultimo_nome_enviado';

const PedidosScreen = () => {
  const { t, i18n } = useTranslation();
  const [nome, setNome] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [ultimoNome, setUltimoNome] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (i18n.isInitialized) {
      setIsReady(true);
    } else {
      i18n.on('initialized', () => setIsReady(true));
    }

    // Recupera o último nome enviado do AsyncStorage
    const loadUltimoNome = async () => {
      try {
        const savedName = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedName) {
          setUltimoNome(savedName);
        }
      } catch (e) {
        console.error('Erro ao carregar nome salvo', e);
      }
    };

    loadUltimoNome();
  }, []);

  const handlePedido = async () => {
    if (!nome) {
      setMensagem(t('Por favor, insira um nome.'));
      return;
    }

    if (nome === ultimoNome) {
      setMensagem(t('Você já enviou esse nome recentemente.'));
      return;
    }

    const response = await pedido(nome);

    setMensagem(response.message);

    if (response.success) {
      setUltimoNome(nome);
      try {
        await AsyncStorage.setItem(STORAGE_KEY, nome);
      } catch (e) {
        console.error('Erro ao salvar nome', e);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.toggleContainer}>
        <Text style={styles.toggleText}>{t('PedidodeNomes')}</Text>
      </View>

      <Card containerStyle={styles.cardStyle}>
        <Text style={styles.cardTitle}>{t('FacaumPedidodeNome')}</Text>
        <Card.Divider />
        <TextInput
          style={styles.input}
          placeholder={t('Digiteonomedesejado')}
          placeholderTextColor="#ddd"
          value={nome ?? ''}                  // garante que não será null
          onChangeText={text => setNome(text)}
          autoCapitalize="none"
          autoCorrect={false}
          autoCompleteType="off"
        />
        <Button title={t('EnviarPedido')} onPress={handlePedido} color="#F5A9F7" />
        {mensagem ? <Text style={styles.message}>{mensagem}</Text> : null}
      </Card>
    </SafeAreaView>
  );
};

export default PedidosScreen;
