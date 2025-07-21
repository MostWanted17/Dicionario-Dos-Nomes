import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#2C1E5C', alignItems: 'center', justifyContent: 'center' },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  toggleText: { color: '#fff', fontSize: 18, marginBottom: 20 },
  cardStyle: {
    width: '90%',
    backgroundColor: '#6A35A1',
    borderColor: '#9F5AFF',
    borderWidth: 1,
    borderRadius: 15,
    overflow: 'hidden',
    padding: 20,
  },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center' },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
    color: '#fff',
  },
  message: {
    marginTop: 10,
    color: '#F5A9F7',
    fontSize: 16,
    textAlign: 'center',
  },
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
});

export default styles;