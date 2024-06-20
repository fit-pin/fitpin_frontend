import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  Animated,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../../../../App.tsx';
import {useUser} from '../UserContext';
import {DATA_URL} from '../../Constant';
import {reqPost} from '../../utills/Request';
import path from 'path';

const {width, height} = Dimensions.get('window');

const Congrats = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const {
    userName,
    userEmail,
    userGender,
    userPwd,
    userHeight,
    userWeight,
    userFit,
    style,
    selectedStyles,
  } = useUser();

  const imageOpacity = useRef(new Animated.Value(0)).current;
  const text1Opacity = useRef(new Animated.Value(0)).current;
  const text2Opacity = useRef(new Animated.Value(0)).current;
  const text3Opacity = useRef(new Animated.Value(0)).current;
  const text4Opacity = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    console.log('User Context:', {
      userName,
      userEmail,
      userPwd,
      userGender,
      userHeight,
      userWeight,
      userFit,
      style,
      selectedStyles,
    });

    Animated.sequence([
      Animated.timing(imageOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(text1Opacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(text2Opacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(text3Opacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(text4Opacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, [
    userName,
    userEmail,
    userPwd,
    userGender,
    userHeight,
    userWeight,
    userFit,
    style,
    selectedStyles,
    imageOpacity,
    text1Opacity,
    text2Opacity,
    text3Opacity,
    text4Opacity,
    buttonOpacity,
  ]);

  const handlePress = async () => {
    if (!userEmail) {
      Alert.alert('오류', '유저 이메일이 필요합니다.');
      return;
    }

    const body = {
      userName,
      userEmail,
      userGender: userGender === 'male' ? '남' : '여',
      userHeight,
      userWeight,
      userFit,
      style: selectedStyles.map(preferStyle => ({
        userEmail,
        preferStyle,
      })),
    };

    try {
      const res = await reqPost(
        path.join(DATA_URL, 'api', 'members', 'basicInfo', userEmail),
        body,
      );

      console.log('Server response:', res);

      if (res.message && res.message.includes('선호 스타일 등록 완료!')) {
        navigation.navigate('Main');
      } else if (res.message) {
        Alert.alert('응답', res.message);
      } else {
        Alert.alert('오류', '정보 전송 중 문제가 발생했습니다.');
      }
    } catch (error) {
      console.error('Error during information submission:', error);
      Alert.alert('오류', '서버와의 통신 중 문제가 발생했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.imageContainer, {opacity: imageOpacity}]}>
        <Image
          source={require('../../assets/img/join/start.png')}
          style={styles.image}
        />
      </Animated.View>

      <View style={styles.textContainer}>
        <Animated.Text style={[styles.text, {opacity: text1Opacity}]}>
          Find
        </Animated.Text>
        <Animated.Text style={[styles.text, {opacity: text2Opacity}]}>
          Your
        </Animated.Text>
        <Animated.Text style={[styles.text2, {opacity: text3Opacity}]}>
          Fit
        </Animated.Text>
        <Animated.Text style={[styles.text2, {opacity: text4Opacity}]}>
          Pin
        </Animated.Text>
      </View>

      <Animated.View style={{opacity: buttonOpacity}}>
        <TouchableOpacity style={styles.button} onPress={handlePress}>
          <Text style={styles.buttonText}>시작하기</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },

  imageContainer: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },

  image: {
    width: width,
    resizeMode: 'cover',
  },

  textContainer: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingLeft: width * 0.08,
  },

  text: {
    fontSize: width * 0.08,
    color: '#9D9D9D',
    fontWeight: 'bold',
    marginBottom: '0.2%',
  },

  text2: {
    fontSize: width * 0.08,
    color: '#000000',
    fontWeight: 'bold',
  },

  button: {
    backgroundColor: '#000000',
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.1,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginLeft: width * 0.08,
    marginTop: height * 0.03,
    marginBottom: '7%',
    width: 320,
    height: 65,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: width * 0.05,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default Congrats;
