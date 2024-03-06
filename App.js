import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';

const App = () => {
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [query, setQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const fetchData = () => {
    setLoading(true);
    const encodedQuery = encodeURIComponent(query);
      fetch(`https://fineli.fi/fineli/api/v1/foods?q=${encodedQuery}`, {
    headers: {
      'User-Agent': 'Your User Agent',
    }
  })
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => toggleDropdown(item)} style={{ margin: 10 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.name.fi}</Text>
      {dropdownVisible && selectedItem === item && (
        <View style={{ marginVertical: 5 }}>
          <Text>Per 100g:</Text>
          <Text>Energia: {item.energyKcal.toFixed(1)} kcal</Text>
          <Text>Rasva: {item.fat.toFixed(1)}g</Text>
          <Text>- joista tyydyttyneitä: {item.saturatedFat.toFixed(1)}g</Text>
          <Text>Hiilihydraatit: {item.carbohydrate.toFixed(1)}g</Text>
          <Text>- joista sokereita: {item.sugar.toFixed(1)}g</Text>
          <Text>Ravintokuitu: {item.fiber.toFixed(1)}g</Text>
          <Text>Proteiini: {item.protein.toFixed(1)}g</Text>
          <Text>Suola: {(item.salt / 1000).toFixed(1)}g</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const toggleDropdown = (item) => {
    if (selectedItem === item) {
      setSelectedItem(null);
      setDropdownVisible(false);
    } else {
      setSelectedItem(item);
      setDropdownVisible(true);
    }
  };

  return (
    <View style={{ flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center' }}>
      <TextInput
        style={{ width: '90%',height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, marginTop:20, paddingHorizontal: 10 }}
        onChangeText={text => setQuery(text)}
        value={query}
        placeholder="Etsi ruokaa. esim.'kananmuna'"
      />
      <TouchableOpacity
        onPress={fetchData}
        style={{backgroundColor:"lightblue", width: '80%', height: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 20,}}
      >
        <Text>Hae</Text>
      </TouchableOpacity>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <>
          <FlatList
            data={data}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
          />
        </>
      )}
    </View>
  );
};

export default App;
