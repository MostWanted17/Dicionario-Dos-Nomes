import React, { useState, useRef, useMemo, useEffect } from 'react';
import { 
  Text, View, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Animated, Switch, Alert
} from 'react-native';
import { Card, SearchBar } from 'react-native-elements';
import { MaterialIcons } from '@expo/vector-icons';
import namesData from '../../database/nomes_femininos_todas_paginas_ordenados.json';

function FemininoScreen() {
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('card'); // 'card' ou 'list'
  const [scrollY, setScrollY] = useState(0); // Estado para armazenar a posição do scroll
  const flatListRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const updateSearch = (searchText) => {
    setSearch(searchText);
  };

  const filteredData = useMemo(() => {
    if (search.trim() === '') {
      return namesData;
    }
    return namesData.filter(item =>
      item.nome.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  React.useEffect(() => {
    if (filteredData.length > 0 && flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index: 0,
        animated: true,
        viewPosition: 0,
      });
    }
  }, [filteredData]);

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [filteredData]);

  const alphabet = Array.from(Array(26), (_, i) => String.fromCharCode(i + 65));

  const showInfo = (item) => {
    Alert.alert(
      item.nome,
      `📖 Significado: ${item.significado}\n🌍 Origem: ${item.origens.join(', ')}`,
      [{ text: 'OK', style: 'cancel' }]
    );
  };

  const renderCard = ({ item }) => (
    <Animated.View style={{ opacity: fadeAnim }}>
      <Card containerStyle={styles.cardStyle}>
        <Text style={styles.cardTitle}>{item.nome}</Text>
        <Card.Divider />
        <Text style={styles.text}>Significado: {item.significado}</Text>
        <Text style={styles.text}>Origem: {item.origens.join(', ')}</Text>
      </Card>
    </Animated.View>
  );

  const renderListItem = ({ item }) => (
    <TouchableOpacity style={styles.listItem} onPress={() => showInfo(item)}>
      <Text style={styles.listItemText}>{item.nome}</Text>
    </TouchableOpacity>
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
    
    const ITEM_HEIGHT = viewMode === 'card' ? 150 : 62;

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
      <View style={styles.toggleContainer}>
        <Text style={styles.toggleText}>Modo Lista</Text>
        <Switch
          value={viewMode === 'card'}
          onValueChange={() => setViewMode(viewMode === 'card' ? 'list' : 'card')}
          thumbColor="#F5A9F7"
          trackColor={{ false: '#777', true: '#9F5AFF' }}
        />
        <Text style={styles.toggleText}>Modo Card</Text>
      </View>

      <SearchBar
        placeholder="Buscar..."
        placeholderTextColor="#ddd"
        onChangeText={updateSearch}
        value={search}
        containerStyle={[styles.searchBar, { borderTopWidth: 0, marginTop: 5 }]} 
        inputContainerStyle={styles.inputContainer}
        inputStyle={styles.inputStyle}
        lightTheme
        autoCapitalize="none"
      />

      {filteredData.length === 0 && (
        <Text style={{ color: '#fff', textAlign: 'center', marginTop: 20 }}>
          Nenhum nome encontrado.
        </Text>
      )}


      <FlatList
        ref={flatListRef}
        data={filteredData}
        renderItem={viewMode === 'card' ? renderCard : renderListItem}
        keyExtractor={(item, index) => item.nome + index}
        style={styles.cardList}
        getItemLayout={getItemLayout}
        onScroll={(event) => setScrollY(event.nativeEvent.contentOffset.y)} // 📌 Atualiza posição do scroll
        onScrollToIndexFailed={(error) => {
          flatListRef.current.scrollToOffset({
            offset: error.averageItemLength * error.index,
            animated: true,
          });
        }}
      />

      <FlatList
        data={alphabet}
        renderItem={renderLetter}
        keyExtractor={(item) => item}
        style={styles.alphabetList}
        contentContainerStyle={styles.alphabetContainer}
        scrollEnabled={false}
      />
      {scrollY > 0 && ( // 📌 FAB só aparece se scrollY for maior que 0
        <TouchableOpacity
          onPress={() => flatListRef.current.scrollToOffset({ offset: 0, animated: true })}
          style={styles.fab}
        >
          <MaterialIcons name="arrow-upward" size={30} color="#fff" />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  container: { flex: 1, backgroundColor: '#2C1E5C' },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  toggleText: { color: '#fff', fontSize: 16, marginHorizontal: 10 },
  searchBar: { marginTop: 10, marginBottom: 10, backgroundColor: 'transparent', borderBottomWidth: 0 },
  inputContainer: { backgroundColor: '#4A2F9D', borderRadius: 25 },
  inputStyle: { backgroundColor: '#4A2F9D', color: '#fff' },
  text: { marginBottom: 10, textAlign: 'center', color: '#FFFFFF' },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center' },
  cardList: { flex: 1, width: '90%', alignSelf: 'center' },
  alphabetList: { position: 'absolute', right: 0, top: 80, bottom: 30, width: 30, paddingTop: 30, paddingBottom: 30 },
  alphabetContainer: { alignItems: 'center', justifyContent: 'flex-start' },
  letter: { color: '#F5A9F7', fontSize: 16, marginVertical: 1.5, textAlign: 'center' },
  cardStyle: { 
    borderRadius: 15, 
    overflow: 'hidden', 
    elevation: 5, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    backgroundColor: '#6A35A1',
    borderColor: '#9F5AFF',
    borderWidth: 1,
  },
  listItem: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#4A2F9D',
    borderRadius: 10,
    alignSelf: 'center',
    width: '90%',
  },
  listItemText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
});

export default FemininoScreen;
