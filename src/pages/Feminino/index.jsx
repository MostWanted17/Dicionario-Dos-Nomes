import React, { useState, useRef, useMemo, useEffect } from 'react';
import { 
  Text, View, SafeAreaView, FlatList, TouchableOpacity, Animated, Switch, Alert
} from 'react-native';
import { Card, SearchBar } from 'react-native-elements';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import namesData from '../../database/nomes_femininos_todas_paginas_ordenados.json';
import styles from './style';

function FemininoScreen() {
  const { t } = useTranslation();

  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('card');
  const [scrollY, setScrollY] = useState(0);
  const flatListRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const updateSearch = (text) => setSearch(text);

  const filteredData = useMemo(() => {
    if (search.trim() === '') return namesData;
    return namesData.filter(item =>
      item.nome.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  useEffect(() => {
    if (filteredData.length > 0 && flatListRef.current) {
      flatListRef.current.scrollToIndex({ index: 0, animated: true, viewPosition: 0 });
    }
  }, [filteredData]);

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, [filteredData]);

  const alphabet = Array.from(Array(26), (_, i) => String.fromCharCode(i + 65));

  const showInfo = (item) => {
    Alert.alert(
      item.nome,
      `${t('Significado')}: ${item.significado}\n${t('Origem')}: ${item.origens.join(', ')}`,
      [{ text: t('OK'), style: 'cancel' }]
    );
  };

  const renderCard = ({ item }) => (
    <Animated.View style={{ opacity: fadeAnim }}>
      <Card containerStyle={styles.cardStyle}>
        <Text style={styles.cardTitle}>{item.nome}</Text>
        <Card.Divider />
        <Text style={styles.text}>{t('Significado')}: {item.significado}</Text>
        <Text style={styles.text}>{t('Origem')}: {item.origens.join(', ')}</Text>
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
    const index = filteredData.findIndex(card => card.nome.trim().toUpperCase().startsWith(letter));
    if (index !== -1 && flatListRef.current) {
      try {
        flatListRef.current.scrollToIndex({ index, animated: true, viewPosition: 0 });
      } catch (e) {
        console.warn('Erro ao rolar:', e);
      }
    } else {
      console.warn(`Letra ${letter} não encontrada`);
    }
  };

  const getItemLayout = (_, index) => {
    const ITEM_HEIGHT = viewMode === 'card' ? 150 : 62;
    return { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index };
  };

  const onScrollToIndexFailed = ({ index, averageItemLength }) => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: averageItemLength * index, animated: true });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.toggleContainer}>
        <Text style={styles.toggleText}>{t('ModoLista')}</Text>
        <Switch
          value={viewMode === 'card'}
          onValueChange={() => setViewMode(viewMode === 'card' ? 'list' : 'card')}
          thumbColor="#F5A9F7"
          trackColor={{ false: '#777', true: '#9F5AFF' }}
        />
        <Text style={styles.toggleText}>{t('ModoCard')}</Text>
      </View>

      <SearchBar
        placeholder={t('Buscar')}
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
          {t('NenhumNomeEncontrado')}
        </Text>
      )}

      <FlatList
        ref={flatListRef}
        data={filteredData}
        renderItem={viewMode === 'card' ? renderCard : renderListItem}
        keyExtractor={(item, index) => `${item.nome}-${index}`}
        style={styles.cardList}
        getItemLayout={getItemLayout}
        onScroll={e => setScrollY(e.nativeEvent.contentOffset.y)}
        onScrollToIndexFailed={onScrollToIndexFailed}
      />

      <FlatList
        data={alphabet}
        renderItem={renderLetter}
        keyExtractor={item => item}
        style={styles.alphabetList}
        contentContainerStyle={styles.alphabetContainer}
        scrollEnabled={false}
      />

      {scrollY > 0 && (
        <TouchableOpacity
          onPress={() => flatListRef.current?.scrollToOffset({ offset: 0, animated: true })}
          style={styles.fab}
        >
          <MaterialIcons name="arrow-upward" size={30} color="#fff" />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

export default FemininoScreen;
