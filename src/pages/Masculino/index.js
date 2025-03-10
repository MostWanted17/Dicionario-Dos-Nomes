import React, { useState, useRef } from 'react';
import { View, StyleSheet, SafeAreaView, FlatList } from 'react-native';
import { Text, Card, SearchBar } from 'react-native-elements';
import namesData from '../../database/nomes.json';  // Ou o caminho correto para o seu arquivo JSON

function MasculinoScreen() {
  const [search, setSearch] = useState('');
  const [data, setData] = useState(namesData);
  const flatListRef = useRef(null);

  const updateSearch = (searchText) => {
    setSearch(searchText);
    filterData(searchText);
  };

  const filterData = (searchText) => {
    if (searchText.trim() === '') {
      setData(namesData);
    } else {
      const filteredData = namesData.filter(item =>
        item.nome.toLowerCase().includes(searchText.toLowerCase())
      );
      setData(filteredData);
    }
  };

  const alphabet = Array.from(Array(26), (_, i) => String.fromCharCode(i + 65));

  const renderCard = ({ item }) => (
    <Card>
      <Card.Title>{item.nome}</Card.Title>
      <Card.Divider />
      <Text style={styles.text}>Significado: {item.significado}</Text>
      <Text style={styles.text}>Origem: {item.origens.join(', ')}</Text>
    </Card>
  );

  const renderLetter = ({ item }) => (
    <Text style={styles.letter} onPress={() => scrollToCard(item)}>
      {item}
    </Text>
  );

  const scrollToCard = (letter) => {
    const index = data.findIndex((card) => card.nome[0] === letter);
    if (index !== -1) {
      flatListRef.current.scrollToIndex({ index });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar
        placeholder="Buscar..."
        onChangeText={updateSearch}
        value={search}
        containerStyle={styles.searchBar}
        inputContainerStyle={styles.inputContainer}
        inputStyle={styles.inputStyle}
        lightTheme
      />
      <FlatList
        ref={flatListRef}
        data={data}
        renderItem={renderCard}
        keyExtractor={(item, index) => index.toString()}
        style={styles.cardList}
      />
      <FlatList
        data={alphabet}
        renderItem={renderLetter}
        keyExtractor={(item) => item}
        style={styles.alphabetList}
        contentContainerStyle={styles.alphabetContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Estilos da tela MasculinoScreen
  container: { flex: 1, backgroundColor: '#6c6c6b' },
  searchBar: { marginTop: 30, marginBottom: 10, backgroundColor: 'transparent', borderBottomWidth: 0 },
  inputContainer: { backgroundColor: '#1f1f1e', borderRadius: 25 },
  inputStyle: { backgroundColor: '#1f1f1e', color: '#fff' },
  text: { marginBottom: 10, textAlign: 'center', color: 'black' },
  cardList: { flex: 1, width: '90%', alignSelf: 'center' },
  alphabetList: { position: 'absolute', right: 0, top: 80, bottom: 30, width: 30, paddingTop: 30, paddingBottom: 30 },
  alphabetContainer: { alignItems: 'center', justifyContent: 'flex-start' },
  letter: { color: '#fff', fontSize: 16, marginVertical: 2, textAlign: 'center', color: '#1f1f1e' }
});

export default MasculinoScreen;
