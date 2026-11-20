import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, Button, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('https://jsonplaceholder.typicode.com/users');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchText.toLowerCase())
  );

  if (selectedUser) {
    return (
      <View style={styles.container}>
        <Text style={styles.name}>{selectedUser.name}</Text>
        <Text style={styles.email}>{selectedUser.email}</Text>
        <Text>{selectedUser.address?.city}</Text>
        <Button title="Retour" onPress={() => setSelectedUser(null)} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput placeholder="Rechercher..." value={searchText} onChangeText={setSearchText} style={styles.input} />
      <Button title="Actualiser" onPress={fetchUsers} />
      {loading ? <ActivityIndicator /> : error ? <Text>{error}</Text> : (
        <FlatList data={filteredUsers} keyExtractor={item => item.id} renderItem={({item}) => (
          <TouchableOpacity style={styles.card} onPress={() => setSelectedUser(item)}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.email}>{item.email}</Text>
          </TouchableOpacity>
        )} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#f5f5f5' },
  card: { backgroundColor: 'white', padding: 15, marginVertical: 5, borderRadius: 8, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
  input: { height: 40, borderColor: '#ccc', borderWidth: 1, borderRadius: 5, paddingHorizontal: 10, marginBottom: 10 },
  name: { fontSize: 18, fontWeight: 'bold' },
  email: { fontSize: 14, color: '#666' }
});
