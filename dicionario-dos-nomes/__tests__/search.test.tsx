import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';


test('renderiza', () => {
render(<Text>Olá</Text>);
expect(screen.getByText('Olá')).toBeTruthy();
});
