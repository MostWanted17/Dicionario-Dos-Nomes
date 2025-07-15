import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2C1E5C', // Cor de fundo roxo escuro
    padding: 20,
  },
  appIcon: {
    width: 100,
    height: 100,
    marginBottom: 20,
    borderRadius: 20,
  },
  text: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  stats: {
    fontSize: 16,
    color: '#F5A9F7', // Rosa vibrante para destaque
    marginBottom: 5,
    fontWeight: '600',
  },
  version: {
    fontSize: 14,
    color: '#ddd',
    marginBottom: 20,
  },
  socialContainer: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 10,
  },
});


export default styles;