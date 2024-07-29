import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {useUser} from '../UserContext';
import {reqPost} from '../../utills/Request';
import {DATA_URL} from '../../Constant';
import path from 'path';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {RootStackParamList} from '../../../../../App';

const {width, height} = Dimensions.get('window');

GoogleSignin.configure();

const LognSignin = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const {setUserName, setUserEmail, setUserPwd} = useUser();

  const handleSigninPress = () => {
    navigation.navigate('Signin');
  };

  const handleLoginPress = () => {
    navigation.navigate('Login');
  };

  const handleGoogleSignin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      const {email, name, id} = userInfo.user;
      const password = id; // 구글 사용자 id를 pw로 사용

      // 유저 정보 등록
      const registerBody = {
        userEmail: email,
        userPwd: password,
        userName: name || 'Unknown User',
        userPwdConfirm: password,
      };

      const registerRes = await reqPost(
        path.join(DATA_URL, 'api', 'members', 'register'),
        registerBody,
      );

      console.log('Server response:', registerRes);

      if (
        registerRes.message &&
        registerRes.message.includes('회원가입이 완료되었습니다')
      ) {
        // UserContext에 사용자 정보 저장
        setUserName(name || 'Unknown User'); // null일 경우 기본 값 설정
        setUserEmail(email);
        setUserPwd(password);

        Alert.alert('회원가입 성공', `환영합니다, ${name || 'Unknown User'}!`);

        navigation.reset({
          index: 0,
          routes: [{name: 'BasicInformation'}],
        });
      } else if (registerRes.message) {
        Alert.alert('응답', registerRes.message);
      } else {
        Alert.alert('오류', '회원가입 중 문제가 발생했습니다.');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      Alert.alert('오류', '서버와의 통신 중 문제가 발생했습니다.');
    }
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

      <TouchableOpacity
        style={[styles.button, styles.buttonOutlined]}
        onPress={handleGoogleSignin}>
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
    color: '#000000',
    marginTop: height * 0.03,
    marginBottom: height * 0.01,
    fontWeight: 'bold',
  },
  button: {
    width: width * 0.8,
    padding: height * 0.015,
    borderRadius: 5,
    marginTop: height * 0.02,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonFilled: {
    backgroundColor: '#000000',
  },
  buttonOutlined: {
    borderWidth: 2,
    borderColor: '#000000',
  },
  buttonKakao: {
    backgroundColor: '#FFEB00',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  buttonText: {
    fontSize: width * 0.045,
    color: '#000000',
    fontWeight: 'bold',
  },
  buttonText2: {
    fontSize: width * 0.045,
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default LognSignin;
