import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View, Button, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, push, ref, onValue, remove } from 'firebase/database';
import { API_KEY, APP_ID, MSG_ID, URL} from '@env';

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
    const itemsList = Object.keys(data).map(key => ({id: key, value: data[key]}));
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

  const deleteItem = (id) => {
    const itemRef = ref(database, `items/${id}`);
    remove(itemRef);
  }
  
  return (
    <View style={styles.container}>
      <TextInput 
        style={styles.input}
        placeholder="product"
        onChangeText={title => setProduct(prevProduct => ({...prevProduct, title}))}
        value={product.title}
      ></TextInput>
      <TextInput
        style={styles.input}
        placeholder="amount"
        onChangeText={amount => setProduct(prevProduct => ({...prevProduct, amount}))}
        value={product.amount}
      ></TextInput>
      <View>
      <Button
        title="Save"
        onPress={() => {
          saveItem();
        }}
      ></Button>
      </View>
      <Text
        style={{paddingTop: 10, fontSize: 20, fontWeight: 'bold', color: 'blue'}}
      >Shopping List</Text>
      <FlatList
      style={{maxHeight: 200, paddingTop: 10}}
        data={items}
        renderItem={({item}) => 
          <View style={styles.list}>
            <Text>{item.value.title}, {item.value.amount}</Text>
            <Text style={{ color: '#0000ff', paddingLeft: 10 }} onPress={() => deleteItem(item.id)}>delete</Text>
          </View>
        }
        keyExtractor={item => item.id}
      ></FlatList>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  input:{
    width: 200,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    textAlign: 'center',
    marginBottom: 5,
  },
  list: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 2,
  }
});
