import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import {reqPost} from '../../utills/Request';
import {DATA_URL} from '../../Constant';
import {useUser} from '../UserContext';
import type {RootStackParamList} from '../../../../../App';
import path from 'path';

const {width, height} = Dimensions.get('window');

const Login = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const {setUserEmail} = useUser();

  const [userEmail, setUserEmailLocal] = useState('');
  const [userPwd, setUserPwdLocal] = useState('');

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const validateForm = () => {
    if (!userEmail || !userPwd) {
      Alert.alert('오류', '모든 정보를 입력해주세요.');
      return false;
    }
    if (!validateEmail(userEmail)) {
      Alert.alert('오류', '유효한 이메일 주소를 입력해주세요.');
      return false;
    }
    return true;
  };

  const handleLoginPress = async () => {
    if (!validateForm()) {
      return;
    }

    const body = {
      userEmail,
      userPwd,
    };

    try {
      const res = await reqPost(path.join(DATA_URL, 'api', 'login'), body);

      if (res.userEmail) {
        // 이메일 저장
        setUserEmail(userEmail);
        // 메인페이지로 이동
        navigation.navigate('Main');
      } else if (res.message) {
        Alert.alert('응답', res.message);
      } else {
        Alert.alert('오류', '로그인 중 문제가 발생했습니다.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      Alert.alert('오류', '서버와의 통신 중 문제가 발생했습니다.');
    }
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
        value={userEmail}
        onChangeText={setUserEmailLocal}
      />
      <Text style={styles.label}>비밀번호</Text>
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        value={userPwd}
        onChangeText={setUserPwdLocal}
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
