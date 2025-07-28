// components/FemininoScreen/style.js

import { StyleSheet } from 'react-native';

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

export default styles;
