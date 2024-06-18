import React from 'react';
import {View, StyleSheet, Text, Image, Dimensions} from 'react-native';

const {width} = Dimensions.get('window');

const Loading = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/img/join/loading.png')}
        style={styles.image}
      />
      <Text style={styles.text}>체형 측정 진행중 ···</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  image: {
    width: width * 0.4,
    height: width * 0.4,
    resizeMode: 'contain',
  },
  text: {
    marginTop: 20,
    fontSize: width * 0.05,
    color: '#000000',
  },
});

export default Loading;
