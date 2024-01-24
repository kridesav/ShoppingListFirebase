import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View, Button, FlatList } from 'react-native';
import React, { useState } from 'react';

export default function App() {
  const [data, setData] = useState([]);
  const [input, setInput] = useState('');
  return (
    <View style={styles.container}>
      <TextInput 
        style={styles.input}
        placeholder="insert product"
        onChangeText={text => setInput(text)}
        value={input}
      ></TextInput>
      <View style={styles.buttonContainer}>
      <Button
        title="Add"
        onPress={() => {
          setData([...data, input]);
          setInput('');
        }}
      ></Button>
      <Button
        title="Clear"
        onPress={() => {
          setData([]);
        }}
      ></Button>
      </View>
      <Text
        style={{paddingTop: 10, fontSize: 20, fontWeight: 'bold', color: 'blue'}}
      >Shopping List</Text>
      <FlatList
      style={{maxHeight: 200, paddingTop: 10}}
        data={data}
        renderItem={({item}) => <Text>{item}</Text>}
        keyExtractor={item => item}
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
  },
  input:{
    width: 300,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 110,
    paddingTop: 10,
    paddingBottom: 10,
  }
});
