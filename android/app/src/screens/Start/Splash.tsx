import React from 'react';
import {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../../../../App.tsx';

const {width} = Dimensions.get('window');

const Splash = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handlePress = () => {
    navigation.navigate('Start');
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Text style={styles.title}>Fitpin</Text>
    </TouchableOpacity>
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

export default Splash;
