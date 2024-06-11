import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {RootStackParamList} from '../../../../../App.tsx';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

type OrderCompleteProp = StackNavigationProp<
  RootStackParamList,
  'OrderComplete'
>;

const OrderComplete = () => {
  const navigation = useNavigation<OrderCompleteProp>();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>주문이 완료되었어요 !</Text>
      <View style={styles.imageContainer}>
        <Image
          source={require('../../assets/img/main/ordercomplete.png')}
          style={styles.image}
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Purchase')}>
          <Text style={styles.buttonText}>주문 내역 보기</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Main')}>
          <Text style={styles.buttonText}>홈으로 가기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 33,
    marginBottom: 30,
    color: '#000',
    fontWeight: 'bold',
  },
  imageContainer: {
    marginBottom: 30,
  },
  image: {
    width: 200,
    height: 200,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    borderRadius: 5,
    width: 170,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
  },
});

export default OrderComplete;