import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet, SafeAreaView, Alert, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-elements';
import { MaterialIcons } from '@expo/vector-icons';
import { pedido } from '../../api/sendPedido';
import { useTranslation } from 'react-i18next';
import styles from './style';

const PedidosScreen = () => {
  const { t, i18n } = useTranslation();
  const [nome, setNome] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
      if (i18n.isInitialized) {
        setIsReady(true);
      } else {
        i18n.on('initialized', () => setIsReady(true));
      }
    }, []);

  const handlePedido = async () => {
    if (nome) {
      const response = await pedido(nome);
      
      setMensagem(response.message);
    } else {
      setMensagem('Por favor, insira um nome.');
    }
  };

  const showInfo = () => {
    Alert.alert('Pedido Enviado', mensagem, [{ text: 'OK', style: 'cancel' }]);
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
          value={nome}
          onChangeText={setNome}
        />
        <Button title={t('EnviarPedido')} onPress={handlePedido} color="#F5A9F7" />
        {mensagem && (
          <Text style={styles.message}>{mensagem}</Text>
        )}
      </Card>

      {mensagem && (
        <TouchableOpacity onPress={showInfo} style={styles.fab}>
          <MaterialIcons name="check-circle" size={30} color="#fff" />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

export default PedidosScreen;
