import { normalize } from '../src/types/normalize';


test('remove acentos e baixa para minúsculas', () => {
expect(normalize('Âna')).toBe('ana');
});
