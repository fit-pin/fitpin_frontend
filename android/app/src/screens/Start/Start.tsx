import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../../../../App.tsx';

const {width, height} = Dimensions.get('window');

const Start = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handlePress = () => {
    navigation.navigate('LognSignin');
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require('../../assets/img/join/start.png')}
          style={styles.image}
        />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.text}>Find</Text>
        <Text style={styles.text}>Your</Text>
        <Text style={styles.text2}>Fit</Text>
        <Text style={styles.text2}>Pin</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}>시작하기</Text>
      </TouchableOpacity>
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
    fontWeight: 'bold',
    marginBottom: '0.2%',
  },

  text2: {
    fontSize: width * 0.08,
    color: '#000000',
    fontWeight: 'bold',
  },

  button: {
    backgroundColor: '#000000',
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.1,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginLeft: width * 0.08,
    marginTop: height * 0.03,
    marginBottom: '7%',
    width: 340,
    height: 65,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: width * 0.05,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default Start;
