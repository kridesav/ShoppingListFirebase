import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View, FlatList, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, push, ref, onValue, remove } from 'firebase/database';
import { API_KEY, APP_ID, MSG_ID, URL } from '@env';
import { Header, Icon, Input, ListItem, Button } from '@rneui/themed';

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: "shoppinglist-7f33c.firebaseapp.com",
  databaseURL: URL,
  projectId: "shoppinglist-7f33c",
  storageBucket: "shoppinglist-7f33c.appspot.com",
  messagingSenderId: MSG_ID,
  appId: APP_ID
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default function App() {
  const [product, setProduct] = useState({
    title: '',
    amount: '',
  });
  const [items, setItems] = useState([]);

  useEffect(() => {
    const itemsRef = ref(database, 'items/');
    onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      const itemsList = Object.keys(data).map(key => ({ id: key, value: data[key] }));
      setItems(itemsList);
    });
  }, []);

  const saveItem = () => {
    push(ref(database, 'items/'), product);
    setProduct({
      title: '',
      amount: '',
    });
  }

  const renderItem = ({ item }) => (
    <ListItem bottomDivider>
      <ListItem.Content style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View>
          <ListItem.Title style={{ fontWeight: 'bold' }}>{item.value.title}</ListItem.Title>
          <ListItem.Subtitle>{item.value.amount}</ListItem.Subtitle>
        </View>
        <Button 
          icon={<Icon name="delete" />} 
          onPress={() => deleteItem(item.id)} 
          type="clear"
        />
      </ListItem.Content>
    </ListItem>
  );

  const deleteItem = (id) => {
    const itemRef = ref(database, `items/${id}`);
    remove(itemRef);
  }

  return (
    <View style={styles.container}>
      <Header centerComponent={{ text: 'Shopping list', style: { color: '#fff', fontSize: 25 } }} />
      <Input
        style={[styles.input, { marginTop: 50, textAlign: 'center', fontSize: 20 }]}
        placeholder="product"
        onChangeText={title => setProduct(prevProduct => ({ ...prevProduct, title }))}
        value={product.title}
      />
      <Input
        style={[styles.input, { textAlign: 'center', fontSize: 20 }]}
        placeholder="amount"
        onChangeText={amount => setProduct(prevProduct => ({ ...prevProduct, amount }))}
        value={product.amount}
      />
      <View>
        <Button
          raised icon={{ name: 'save', color: 'white' }}
          title="Save"
          onPress={() => {
            saveItem();
          }}
        ></Button>
      </View>
      <View style={styles.list}>
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </View>
      <StatusBar style="auto" />
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  list: {
    width: '100%',
    marginTop: 20,
    flex: 1,
  },
});
