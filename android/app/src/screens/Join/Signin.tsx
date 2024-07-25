import React, { useState } from 'react';
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
import { auth } from '../../firebase';
import { createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, deleteUser } from 'firebase/auth';
import { DATA_URL } from '../../Constant';
import path from 'path';
import { RootStackParamList } from '../../../../../App.tsx';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../UserContext';
import { reqPost } from '../../utills/Request.ts';

type SigninavigationProp = StackNavigationProp<RootStackParamList, 'Signin'>;

const { width, height } = Dimensions.get('window');

const Signin = () => {
  const navigation = useNavigation<SigninavigationProp>();
  const { setUserName, setUserEmail, setUserPwd } = useUser();

  const [userName, setUserNameLocal] = useState('');
  const [userEmail, setUserEmailLocal] = useState('');
  const [userPwd, setUserPwdLocal] = useState('');
  const [userPwdConfirm, setUserPwdConfirmLocal] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);

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

  const handleEmailVerification = async () => {
    if (!validateEmail(userEmail)) {
      Alert.alert('오류', '유효한 이메일 주소를 입력해주세요.');
      return;
    }

    try {
      // Firebase에 임시 사용자 생성 및 이메일 인증 링크 보내기
      const tempUser = await createUserWithEmailAndPassword(auth, userEmail, userPwd);
      await sendEmailVerification(tempUser.user);
      setIsEmailVerified(true);
      Alert.alert('확인', '이메일로 인증 링크가 전송되었습니다. 이메일을 확인하세요.');
    } catch (error: any) {
      console.error('Error sending email verification:', error);
      Alert.alert('오류', '이메일 인증 링크 전송 중 문제가 발생했습니다.');
    }
  };

  const handleSignup = async () => {
    if (!validateForm()) {
      return;
    }

    if (!isEmailVerified) {
      Alert.alert('오류', '이메일 인증을 완료해주세요.');
      return;
    }

    const body = {
      userEmail,
      userPwd,
      userName,
      userPwdConfirm, // 서버가 기대하는 필드로 추가
    };

    console.log('Request body:', body); // 요청 데이터 출력

    try {
      // 서버에 회원가입 요청
      const res = await reqPost(path.join(DATA_URL, 'api', 'members', 'register'), body);
      console.log('Full server response:', res); // 전체 응답 출력

      if (res && res.message && res.message.includes('회원가입이 완료되었습니다')) {
        // UserContext에 사용자 정보 저장
        setUserName(userName);
        setUserEmail(userEmail);
        setUserPwd(userPwd);

        // Firebase에 사용자 생성 시도
        try {
          const userCredential = await signInWithEmailAndPassword(auth, userEmail, userPwd);
          if (userCredential.user.emailVerified) {
            Alert.alert('확인', '회원가입이 완료되었습니다.');
            navigation.navigate('BasicInformation');
          } else {
            await deleteUser(userCredential.user);
            Alert.alert('오류', '이메일 인증이 완료되지 않았습니다. 다시 시도해주세요.');
          }
        } catch (error: any) {
          console.error('Error creating user:', error);
          Alert.alert('오류', '사용자 생성 중 문제가 발생했습니다.');
        }
      } else if (res && res.message) {
        Alert.alert('응답', res.message);
      } else {
        Alert.alert('오류', '회원가입 중 문제가 발생했습니다.');
      }
    } catch (error: any) {
      console.error('Error during registration:', error.response ? error.response.data : error);
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
        <TouchableOpacity style={styles.verifyButton} onPress={handleEmailVerification}>
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