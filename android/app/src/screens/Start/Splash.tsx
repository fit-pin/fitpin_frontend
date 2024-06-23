import React, { useState, useEffect } from 'react';
import {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  Alert
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../../../../App.tsx';
import {useUser,getItem} from '../UserContext';
import {DATA_URL} from '../../Constant.ts';
import {reqPost,reqGet} from '../../utills/Request.ts';
import path from 'path';

const {width} = Dimensions.get('window');

const Splash = () => {

  //로컬에 저장된 이메일을 저장할 변수
  const [stoageEmail, setstoageEmail] = useState('');
  const [stoagePwd, setstoagePwd] = useState('');

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

  //로컬에 저장된 이메일을 불러옴
  const Emailget = async () => {
    const Email = await getItem('userEmail');
    const Pwd = await getItem('userPwd');
    setstoageEmail(Email);
    setstoagePwd(Pwd);
  };
  //로그가 3번찍힘 해결필요
  useEffect(() => {
    Emailget();
    console.log(`저장된아이디 : ${stoageEmail}`);
    console.log(`저장된비밀번호 : ${stoagePwd}`);
  });
  
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handlePress = async () => {

    const body = {
      'userEmail' : stoageEmail,
      'userPwd' : stoagePwd
    }

    const res = await reqPost(path.join(DATA_URL, 'api', 'login'), body);

      if (stoageEmail == res.userEmail && stoagePwd == res.userPwd) {
        setUserEmail(stoageEmail);
        setUserPwd(stoagePwd);
        setUserName(res.userName);
        setUserGender(res.userGender);
        setUserHeight(res.userHeight);
        setUserWeight(res.userWeight);
        setUserFit(res.userFit);

        // 선택한 4개의 스타일 정보 가져오기
        getStyleInfo();
      }
      else{
        Alert.alert('오류', '비밀번호가 틀립니다 다시 로그인해주세요.');
        navigation.navigate('LognSignin');
      }
  };

  const getStyleInfo = async () => {
    try {
      const res = await reqGet(
        path.join(DATA_URL, 'api', 'GetUserPreferStyle', stoageEmail),
      );

      if (res) {
        // 선호 스타일 정보를 selectedStyles 배열에 저장
        const styles = res.map(
          (item: {preferStyle: string}) => item.preferStyle,
        );
        setSelectedStyles(styles);

        console.log(styles);
        // 메인페이지로 이동
        navigation.navigate('Main');
      } else if (res.message) {
        Alert.alert('응답', res.message);
      } else {
        Alert.alert('오류', '문제가 발생했습니다.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      Alert.alert('오류', '서버와의 통신 중 문제가 발생했습니다.');
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
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
