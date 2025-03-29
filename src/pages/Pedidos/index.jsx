import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, SafeAreaView, Alert, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-elements';
import { MaterialIcons } from '@expo/vector-icons';
import { pedido } from '../../api/sendPedido';

const PedidosScreen = () => {
  const [nome, setNome] = useState('');
  const [mensagem, setMensagem] = useState('');

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
        <Text style={styles.toggleText}>Pedido de Nomes</Text>
      </View>

      <Card containerStyle={styles.cardStyle}>
        <Text style={styles.cardTitle}>Faça um Pedido de Nome</Text>
        <Card.Divider />
        <TextInput
          style={styles.input}
          placeholder="Digite o nome desejado"
          placeholderTextColor="#ddd"
          value={nome}
          onChangeText={setNome}
        />
        <Button title="Enviar Pedido" onPress={handlePedido} color="#F5A9F7" />
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#2C1E5C', alignItems: 'center', justifyContent: 'center' },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  toggleText: { color: '#fff', fontSize: 18, marginBottom: 20 },
  cardStyle: {
    width: '90%',
    backgroundColor: '#6A35A1',
    borderColor: '#9F5AFF',
    borderWidth: 1,
    borderRadius: 15,
    overflow: 'hidden',
    padding: 20,
  },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center' },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
    color: '#fff',
  },
  message: {
    marginTop: 10,
    color: '#F5A9F7',
    fontSize: 16,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#F5A9F7',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});

export default PedidosScreen;
