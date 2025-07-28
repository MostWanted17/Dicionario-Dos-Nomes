import React from 'react';
import NomeListScreen from '../../components/NomeListScreen/NomeListScreen';
import namesData from '../../database/nomes_femininos_todas_paginas_ordenados.json';

export default function FemininoScreen() {
  return <NomeListScreen data={namesData} />;
}
