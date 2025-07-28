import React from 'react';
import NomeListScreen from '../../components/NomeListScreen/NomeListScreen';
import namesData from '../../database/nomes_masculinos_todas_paginas_ordenados.json';

export default function MasculinoScreen() {
  return <NomeListScreen data={namesData} />;
}
