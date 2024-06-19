import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import {RootStackParamList} from '../../../../../App.tsx';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

type SizeNavigationProp = StackNavigationProp<RootStackParamList, 'Size'>;

const Size = () => {
  const navigation = useNavigation<SizeNavigationProp>();
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>사이즈 정보를 알려드릴게요</Text>

      <View style={styles.box}>
        <Image
          source={require('../../assets/img/main/top/top1.png')}
          style={styles.boxImage}
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Fit_box', {})}>
        <Text style={styles.buttonText}>사진 보관하기</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('WritePage')}>
        <Text style={styles.buttonText}>다른 사람들과 사진 공유하기</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },

  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1,
  },

  backButtonImage: {
    width: 22,
    height: 22,
  },

  title: {
    fontSize: 22,
    color: '#000000',
    fontWeight: 'bold',
    marginTop: 50,
    marginBottom: 30,
    marginLeft: 20,
  },

  button: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 20,
    top: '-2%',
  },

  buttonText: {
    color: '#fff',
    fontSize: 20,
  },

  box: {
    width: '90%',
    height: 540,
    borderRadius: 27,
    backgroundColor: '#f4f4f4',
    marginBottom: 40,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },

  boxImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

export default Size;
