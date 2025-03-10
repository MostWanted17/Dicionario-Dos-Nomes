import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Este aplicativo permite a busca de nomes e seus significados.
      </Text>
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
  text: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
});
