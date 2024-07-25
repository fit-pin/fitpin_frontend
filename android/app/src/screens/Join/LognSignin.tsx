import React, {useEffect} from 'react';
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
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {RootStackParamList} from '../../../../../App';

const {width, height} = Dimensions.get('window');

const LognSignin = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const googleSigninConfigure = () => {
    GoogleSignin.configure({
      webClientId:
        '934828416095-s1b8nvithrntut57d35gnldpurudlfqk.apps.googleusercontent.com',
    });
  };

  useEffect(() => {
    googleSigninConfigure();
  }, []);

  const handleSigninPress = () => {
    navigation.navigate('Signin');
  };

  const handleLoginPress = () => {
    navigation.navigate('Login');
  };

  const handleGoogleSignin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const {idToken} = await GoogleSignin.signIn();

      // Google credential을 Firebase에 생성
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Firebase에 인증
      await auth().signInWithCredential(googleCredential);

      const currentUser = auth().currentUser;

      Alert.alert('로그인 성공', `환영합니다, ${currentUser?.displayName}!`);
      navigation.reset({
        index: 0,
        routes: [{name: 'BasicInformation'}],
      });
    } catch (error) {
      if (error instanceof Error) {
        console.log('Google Sign-In Error:', error.message);
        switch (error.message) {
          case statusCodes.SIGN_IN_CANCELLED:
            Alert.alert(
              '로그인 취소됨',
              '사용자가 로그인 과정을 취소했습니다.',
            );
            break;
          case statusCodes.IN_PROGRESS:
            Alert.alert('로그인 진행 중', '로그인 과정이 진행 중입니다.');
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            Alert.alert(
              'Play 서비스 사용 불가',
              'Google Play 서비스가 사용 불가능합니다.',
            );
            break;
          case statusCodes.SIGN_IN_REQUIRED:
            Alert.alert('로그인 필요', '로그인이 필요합니다.');
            break;
          default:
            Alert.alert('알 수 없는 오류', '알 수 없는 오류가 발생했습니다.');
            break;
        }
      } else {
        Alert.alert('알 수 없는 오류', '알 수 없는 오류가 발생했습니다.');
      }
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
