import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const StartButton = () => {
  return (
    <TouchableOpacity
      style={styles.button}
    >
      <Text style={styles.text}>시작하기</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#000000',
    padding: 16,
    margin: 20,
    marginLeft: 30,
    marginRight: 30,
    borderRadius: 20,
  },
  text: {
    color: '#ffffff',
    fontSize: 24,
    textAlign: 'center',
  }
});

export default StartButton;