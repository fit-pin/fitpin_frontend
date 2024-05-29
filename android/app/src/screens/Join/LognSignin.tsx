import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {RootStackParamList} from '../../../../../App';

const {width, height} = Dimensions.get('window');

const LognSignin = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleSigninPress = () => {
    navigation.navigate('Signin');
  };

  const handleLoginPress = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fitpin.</Text>

      <TouchableOpacity
        style={[styles.button, styles.buttonOutlined]}
        onPress={handleSigninPress}>
        <Text style={styles.buttonText}>계정 생성하기</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.buttonFilled]}
        onPress={handleLoginPress}>
        <Text style={styles.buttonText2}>로그인</Text>
      </TouchableOpacity>

      <Text style={styles.or}>or</Text>

      <TouchableOpacity style={[styles.button, styles.buttonKakao]}>
        <View style={styles.buttonContent}>
          <Image
            source={require('../../assets/img/join/kakaotalk.png')}
            style={styles.buttonIcon}
          />
          <Text style={styles.buttonText}>카카오톡으로 계속하기</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.buttonOutlined]}>
        <View style={styles.buttonContent}>
          <Image
            source={require('../../assets/img/join/google.png')}
            style={styles.buttonIcon}
          />
          <Text style={styles.buttonText}>구글로 계속하기</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },

  title: {
    fontSize: width * 0.1,
    color: '#000000',
    marginBottom: height * 0.08,
    fontWeight: 'bold',
  },

  or: {
    fontSize: width * 0.05,
    color: '#979797',
    marginVertical: height * 0.02,
    fontWeight: 'bold',
  },

  button: {
    paddingVertical: height * 0.022,
    paddingHorizontal: width * 0.1,
    borderRadius: 20,
    marginTop: height * 0.02,
    width: '80%',
    alignItems: 'center',
  },

  buttonOutlined: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#000000',
  },

  buttonFilled: {
    backgroundColor: '#000000',
  },

  buttonKakao: {
    backgroundColor: '#FBE300',
  },

  buttonText: {
    color: '#000000',
    fontSize: width * 0.04,
    textAlign: 'center',
    fontWeight: 'bold',
  },

  buttonText2: {
    color: '#ffffff',
    fontSize: width * 0.04,
    textAlign: 'center',
    fontWeight: 'bold',
  },

  buttonIcon: {
    width: width * 0.06,
    height: width * 0.06,
    marginRight: width * 0.02,
  },

  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LognSignin;
