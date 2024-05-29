import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {RootStackParamList} from '../../../../../App';

const {width, height} = Dimensions.get('window');

const Login = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleLoginPress = () => {
    navigation.navigate('BasicInformation');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fitpin.</Text>

      <Text style={styles.loginStyle}>로그인</Text>

      <Text style={styles.label}>이메일</Text>
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Text style={styles.label}>비밀번호</Text>
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
      />
      <TouchableOpacity style={styles.button} onPress={handleLoginPress}>
        <Text style={styles.buttonText}>로그인</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: height * 0.02,
  },
  title: {
    fontSize: width * 0.12,
    color: '#000000',
    marginTop: height * 0.005,
    marginBottom: height * 0.07,
    fontWeight: 'bold',
  },

  loginStyle: {
    fontSize: width * 0.06,
    color: '#000000',
    alignSelf: 'flex-start',
    marginLeft: width * 0.1,
    marginBottom: height * 0.01,
    fontWeight: 'bold',
  },

  label: {
    fontSize: width * 0.04,
    color: '#878787',
    alignSelf: 'flex-start',
    marginLeft: width * 0.1,
    marginTop: height * 0.02,
    marginBottom: height * 0.01,
    fontWeight: 'bold',
  },
  input: {
    width: '73%',
    height: height * 0.06,
    borderWidth: 1,
    borderColor: '#c7c7c7',
    borderRadius: 10,
    paddingHorizontal: width * 0.02,
    marginBottom: height * 0.02,
  },
  button: {
    backgroundColor: '#000000',
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.1,
    borderRadius: 31,
    marginTop: height * 0.04,
    width: '80%',
  },
  buttonText: {
    fontSize: width * 0.05,
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default Login;
