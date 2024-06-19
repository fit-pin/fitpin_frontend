import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import {reqPost} from '../../utills/Request';
import {DATA_URL} from '../../Constant';
import path from 'path';
import {RootStackParamList} from '../../../../../App.tsx';
import {StackNavigationProp} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';
import {useUser} from '../UserContext';

type SigninavigationProp = StackNavigationProp<RootStackParamList, 'Signin'>;

const {width, height} = Dimensions.get('window');

const Signin = () => {
  const navigation = useNavigation<SigninavigationProp>();
  // eslint-disable-next-line prettier/prettier
  const { setUserName, setUserEmail, setUserPwd } = useUser();

  const [userName, setUserNameLocal] = useState('');
  const [userEmail, setUserEmailLocal] = useState('');
  const [userPwd, setUserPwdLocal] = useState('');
  const [userPwdConfirm, setUserPwdConfirmLocal] = useState('');

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const validateForm = () => {
    if (!userName || !userEmail || !userPwd || !userPwdConfirm) {
      Alert.alert('오류', '모든 정보를 입력해주세요.');
      return false;
    }
    if (!validateEmail(userEmail)) {
      Alert.alert('오류', '유효한 이메일 주소를 입력해주세요.');
      return false;
    }
    if (userPwd !== userPwdConfirm) {
      Alert.alert('오류', '비밀번호가 일치하지 않습니다.');
      return false;
    }
    return true;
  };

  const handleSignup = async () => {
    if (!validateForm()) {
      return;
    }
    const body = {
      userEmail,
      userPwd,
      userName,
      userPwdConfirm,
    };
    try {
      const res = await reqPost(
        path.join(DATA_URL, 'api', 'members', 'register'),
        body,
      );
      console.log('Server response:', res);

      if (res.message && res.message.includes('회원가입이 완료되었습니다')) {
        // UserContext에 사용자 정보 저장
        setUserName(userName);
        setUserEmail(userEmail);
        setUserPwd(userPwd);

        // 다음 페이지로 이동
        navigation.navigate('BasicInformation');
      } else if (res.message) {
        Alert.alert('응답', res.message);
      } else {
        Alert.alert('오류', '회원가입 중 문제가 발생했습니다.');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      Alert.alert('오류', '서버와의 통신 중 문제가 발생했습니다.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Fitpin.</Text>

      <Text style={styles.signupStyle}>회원가입</Text>

      <Text style={styles.label}>이름</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        keyboardType="default"
        autoCapitalize="none"
        value={userName}
        onChangeText={setUserNameLocal}
      />

      <Text style={styles.label}>이메일</Text>
      <View style={styles.inputWithButton}>
        <TextInput
          style={styles.inputWithButtonText}
          placeholder="E-mail"
          keyboardType="email-address"
          autoCapitalize="none"
          value={userEmail}
          onChangeText={setUserEmailLocal}
        />
        <TouchableOpacity style={styles.verifyButton}>
          <Text style={styles.verifyButtonText}>인증하기</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>비밀번호</Text>
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        value={userPwd}
        onChangeText={setUserPwdLocal}
      />

      <Text style={styles.label}>비밀번호 확인</Text>
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        value={userPwdConfirm}
        onChangeText={setUserPwdConfirmLocal}
      />

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>가입하기</Text>
      </TouchableOpacity>
    </ScrollView>
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
    marginTop: height * 0.05,
    marginBottom: height * 0.07,
    fontWeight: 'bold',
  },

  signupStyle: {
    fontSize: width * 0.06,
    color: '#000000',
    alignSelf: 'flex-start',
    marginLeft: width * 0.1,
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

  inputWithButton: {
    flexDirection: 'row',
    width: '73%',
    height: height * 0.06,
    borderWidth: 1,
    borderColor: '#c7c7c7',
    borderRadius: 10,
    alignItems: 'center',
    paddingHorizontal: width * 0.02,
  },

  inputWithButtonText: {
    flex: 1,
    height: '100%',
    paddingHorizontal: width * 0.02,
  },

  verifyButton: {
    backgroundColor: '#d9d9d9',
    paddingVertical: height * 0.005,
    paddingHorizontal: width * 0.03,
    borderRadius: 10,
  },

  verifyButtonText: {
    color: '#494949',
    fontSize: width * 0.035,
  },
});

export default Signin;
