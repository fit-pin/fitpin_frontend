import React from 'react';
import { View, Image, Text, StyleSheet, Dimensions,  } from 'react-native';
import StartButton from '../assets/StartButton';

const { width, height } = Dimensions.get('window');

const Start = () => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require('../image/start.png')}
          style={styles.image}
        />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.text}>Find</Text>
        <Text style={styles.text}>Your</Text>
        <Text style={styles.text2}>Fit</Text>
        <Text style={styles.text2}>Pin</Text>
      </View>

      <StartButton />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },

  imageContainer: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },

  image: {
    width: width,
    resizeMode: 'cover',
  },

  textContainer: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingLeft: width * 0.08,
  },

  text: {
    fontSize: width * 0.08,
    color: '#9D9D9D',
  },

  text2: {
    fontSize: width * 0.08,
    color: '#000000',
  }

});

export default Start;
