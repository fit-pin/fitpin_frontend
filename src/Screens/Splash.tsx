import React from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const App = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fitpin</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    paddingHorizontal: width * 0.05,
  },
  
  title: {
    fontSize: width * 0.08,
    color: '#ffffff',
  },
});

export default App;
