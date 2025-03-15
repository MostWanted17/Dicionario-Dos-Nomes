import React, { useState, useRef, useMemo } from 'react';
import { Text, View, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { Card, SearchBar } from 'react-native-elements';
import namesData from '../../database/nomes_femininos_todas_paginas_ordenados.json';

function FemeninoScreen() {
  const [search, setSearch] = useState('');
  const flatListRef = useRef(null);

  const updateSearch = (searchText) => {
    setSearch(searchText);
  };

  // UseMemo para filtrar os dados com base na pesquisa
  const filteredData = useMemo(() => {
    if (search.trim() === '') {
      return namesData;
    }
    return namesData.filter(item =>
      item.nome.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  // Sempre que os dados filtrados mudam, rola para o topo
  React.useEffect(() => {
    if (filteredData.length > 0 && flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index: 0,
        animated: true,
        viewPosition: 0,
      });
    }
  }, [filteredData]);

  const alphabet = Array.from(Array(26), (_, i) => String.fromCharCode(i + 65));

  const renderCard = ({ item }) => (
    <Card>
      <Text style={styles.cardTitle}>{item.nome}</Text>
      <Card.Divider />
      <Text style={styles.text}>Significado: {item.significado}</Text>
      <Text style={styles.text}>Origem: {item.origens.join(', ')}</Text>
    </Card>
  );

  const renderLetter = ({ item }) => (
    <TouchableOpacity onPress={() => scrollToCard(item)}>
      <Text style={styles.letter}>{item}</Text>
    </TouchableOpacity>
  );

  const scrollToCard = (letter) => {
    const index = filteredData.findIndex((card) => card.nome.trim().toUpperCase().startsWith(letter));

    if (index !== -1 && flatListRef.current) {
      try {
        flatListRef.current.scrollToIndex({
          index,
          animated: true,
          viewPosition: 0,
        });
      } catch (error) {
        console.warn('Erro ao tentar rolar para o índice:', error);
      }
    } else {
      console.warn(`Letra ${letter} não encontrada`);
    }
  };

  const getItemLayout = (_, index) => {
    const ITEM_HEIGHT = 145;
    return { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index };
  };

  const onScrollToIndexFailed = (error) => {
    const { index, averageItemLength } = error;
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({
        offset: averageItemLength * index,
        animated: true,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar
        placeholder="Buscar..."
        placeholderTextColor="#ccc"
        onChangeText={updateSearch}
        value={search}
        containerStyle={styles.searchBar}
        inputContainerStyle={styles.inputContainer}
        inputStyle={styles.inputStyle}
        lightTheme
        // Adicione um ID único, sem "key"
        autoCapitalize="none"
      />
      <FlatList
        ref={flatListRef}
        data={filteredData}
        renderItem={renderCard}
        keyExtractor={(item, index) => item.nome + index}
        style={styles.cardList}
        getItemLayout={getItemLayout}
        onScrollToIndexFailed={onScrollToIndexFailed}
      />
      <FlatList
        data={alphabet}
        renderItem={renderLetter}
        keyExtractor={(item) => item}
        style={styles.alphabetList}
        contentContainerStyle={styles.alphabetContainer}
        scrollEnabled={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#6c6c6b' },
  searchBar: { marginTop: 30, marginBottom: 10, backgroundColor: 'transparent', borderBottomWidth: 0 },
  inputContainer: { backgroundColor: '#1f1f1e', borderRadius: 25 },
  inputStyle: { backgroundColor: '#1f1f1e', color: '#fff' },
  text: { marginBottom: 10, textAlign: 'center', color: 'black' },
  cardList: { flex: 1, width: '90%', alignSelf: 'center' },
  alphabetList: { position: 'absolute', right: 0, top: 80, bottom: 30, width: 30, paddingTop: 30, paddingBottom: 30 },
  alphabetContainer: { alignItems: 'center', justifyContent: 'flex-start' },
  letter: { color: '#fff', fontSize: 16, marginVertical: 2, textAlign: 'center' }
});

export default FemeninoScreen;
