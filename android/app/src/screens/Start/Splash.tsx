import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../../../../App.tsx';
import {useUser, getItem, setItem} from '../UserContext';
import {DATA_URL} from '../../Constant.ts';
import {reqPost, reqGet} from '../../utills/Request.ts';
import path from 'path';

const {width} = Dimensions.get('window');

const Splash = () => {
  //로컬에 저장된 이메일을 저장할 변수
  const [stoageData, setstoageData] = useState<{
    stoageEmail: string;
    stoagePwd: string;
  }>();

  const {
    setUserEmail,
    setUserPwd,
    setUserName,
    setUserGender,
    setUserHeight,
    setUserWeight,
    setUserFit,
    setSelectedStyles,
  } = useUser();

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  //로컬에 저장된 이메일을 불러옴 (없으면 LognSignin 로 이동)
  const Emailget = async () => {
    const Email = await getItem('userEmail');
    const Pwd = await getItem('userPwd');
    console.log(`저장된아이디 : ${Email}`);
    console.log(`저장된비밀번호 : ${Pwd}`);
    if (Email && Pwd) {
      setstoageData({stoageEmail: Email, stoagePwd: Pwd});
    } else {
      navigation.replace('LognSignin');
    }
  };

  useEffect(() => {
    Emailget();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (stoageData) {
      getUserData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stoageData]);

  // 시작시 유저 데이터 불러오기
  const getUserData = async () => {
    const body = {
      userEmail: stoageData?.stoageEmail,
      userPwd: stoageData?.stoagePwd,
    };

    try {
      const resUser = await reqPost(path.join(DATA_URL, 'api', 'login'), body);

      if (
        resUser.userEmail === stoageData?.stoageEmail &&
        resUser.userPwd === stoageData?.stoagePwd
      ) {
        // 선택한 4개의 스타일 정보 가져오기
        const resStyle = await reqGet(
          path.join(DATA_URL, 'api', 'GetUserPreferStyle', resUser.userEmail),
        );

        if (resStyle) {
          // 선호 스타일 정보를 selectedStyles 배열에 저장
          const styles = resStyle.map(
            (item: {preferStyle: string}) => item.preferStyle,
          );

          setSelectedStyles(styles);
          setUserEmail(resUser.userEmail);
          setUserPwd(resUser.userPwd);
          setUserName(resUser.userName);
          setUserGender(resUser.userGender);
          setUserHeight(resUser.userHeight);
          setUserWeight(resUser.userWeight);
          setUserFit(resUser.userFit);
          // 메인페이지로 이동
          navigation.replace('Main');
          return;
        }
      }
      Alert.alert(
        '오류',
        '로그인 과정에서 문제가 발생했습니다. 다시 로그인 해주세요',
      );
      // 문제 발생시 초기화
      setItem('userEmail', '');
      setItem('userPwd', '');
      navigation.replace('LognSignin');
    } catch (error) {
      setItem('userEmail', '');
      setItem('userPwd', '');
      console.error('Error during login:', error);
      Alert.alert('오류', '서버와의 통신 중 문제가 발생했습니다.');
    }
  };

  return (
    <TouchableOpacity style={styles.container}>
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
