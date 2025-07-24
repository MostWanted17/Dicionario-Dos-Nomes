import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import {
  Text, View, SafeAreaView, FlatList, TouchableOpacity, Animated, Switch, Alert, ActivityIndicator,
} from 'react-native';
import { Card, SearchBar } from 'react-native-elements';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import namesData from '../../database/nomes_masculinos_todas_paginas_ordenados.json';
import styles from './style';

function MasculinoScreen() {
  const { t, i18n } = useTranslation();
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('card');
  const [scrollY, setScrollY] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const flatListRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (i18n.isInitialized) {
      setIsReady(true);
    } else {
      i18n.on('initialized', () => setIsReady(true));
    }
  }, []);

  const filteredData = useMemo(() => {
    const searchLower = search.trim().toLowerCase();
    return searchLower
      ? namesData.filter(({ nome }) => nome.toLowerCase().includes(searchLower))
      : namesData;
  }, [search]);

  useEffect(() => {
    if (filteredData.length && flatListRef.current) {
      flatListRef.current.scrollToIndex({ index: 0, animated: true, viewPosition: 0 });
    }
  }, [filteredData]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [filteredData]);

  const alphabet = useMemo(
    () => Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)),
    []
  );

  const showInfo = useCallback((item) => {
    const lang = i18n.language || 'pt';
    Alert.alert(
      item.nome,
      `📖 ${t('Significado')}: ${item.significados[lang]}\n🌍 ${t('Origem')}: ${item.origens[lang].join(', ')}`,
      [{ text: 'OK', style: 'cancel' }]
    );
  }, [t, i18n.language]);


  const renderCard = ({ item, index }) => {
    const lang = i18n.language || 'pt';
    return (
      <Animated.View key={`${item.nome}-${index}`} style={{ opacity: fadeAnim }}>
        <Card containerStyle={styles.cardStyle}>
          <Text style={styles.cardTitle}>{item.nome}</Text>
          <Card.Divider />
          <Text style={styles.text}>{t('Significado')}: {item.significados[lang]}</Text>
          <Text style={styles.text}>{t('Origem')}: {item.origens[lang].join(', ')}</Text>
        </Card>
      </Animated.View>
    );
  };


  const renderListItem = ({ item, index }) => (
    <TouchableOpacity key={`${item.nome}-${index}`} style={styles.listItem} onPress={() => showInfo(item)}>
      <Text style={styles.listItemText}>{item.nome}</Text>
    </TouchableOpacity>
  );


  const renderLetter = ({ item }) => (
    <TouchableOpacity onPress={() => scrollToCard(item)}>
      <Text style={styles.letter}>{item}</Text>
    </TouchableOpacity>
  );

  const scrollToCard = (letter) => {
    const index = filteredData.findIndex(({ nome }) =>
      nome.trim().toUpperCase().startsWith(letter)
    );
    if (index !== -1 && flatListRef.current) {
      flatListRef.current.scrollToIndex({ index, animated: true, viewPosition: 0 });
    }
  };

  const getItemLayout = (_, index) => {
    const ITEM_HEIGHT = viewMode === 'card' ? 150 : 62;
    return { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index };
  };

  const onScrollToIndexFailed = ({ index, averageItemLength }) => {
    flatListRef.current?.scrollToOffset({
      offset: averageItemLength * index,
      animated: true,
    });
  };

  if (!isReady) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#F5A9F7" />
      </View>
    );
  }

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
        onChangeText={setSearch}
        value={search}
        containerStyle={[styles.searchBar, { borderTopWidth: 0, marginTop: 5 }]}
        inputContainerStyle={styles.inputContainer}
        inputStyle={styles.inputStyle}
        lightTheme
        autoCapitalize="none"
      />

      {filteredData.length === 0 ? (
        <Text style={{ color: '#fff', textAlign: 'center', marginTop: 20 }}>
          {t('NenhumNomeEncontrado')}
        </Text>
      ) : (
        <FlatList
          ref={flatListRef}
          data={filteredData}
          renderItem={viewMode === 'card' ? renderCard : renderListItem}
          keyExtractor={(item, index) => `${item.nome}-${index}`}
          style={styles.cardList}
          getItemLayout={getItemLayout}
          onScroll={(e) => setScrollY(e.nativeEvent.contentOffset.y)}
          onScrollToIndexFailed={onScrollToIndexFailed}
        />
      )}

      <FlatList
        data={alphabet}
        renderItem={renderLetter}
        keyExtractor={(item) => item}
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

export default MasculinoScreen;
