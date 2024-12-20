import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {RootStackParamList} from '../../../../../App.tsx';
import {StackNavigationProp} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';
import {DATA_URL} from '../../Constant.ts';
import {reqGet} from '../../utills/Request.ts';
import path from 'path';
import {useUser} from '../UserContext.tsx';

type MyFitNavigationProp = StackNavigationProp<RootStackParamList, 'My_Fit'>;
const My_Fit = () => {
  const [userHeight, setUserHeight] = useState(0);
  const [userWeight, setUserWeight] = useState(0);
  const [armSize, setArmSize] = useState(0);
  const [shoulderSize, setShoulderSize] = useState(0);
  const [bodySize, setBodySize] = useState(0);
  const [legSize, setLegSize] = useState(0);
  const {userEmail} = useUser();

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const response = await reqGet(
          path.join(DATA_URL, 'api', 'userbodyinfo', `${userEmail}`),
        );
        setUserHeight(response.userHeight);
        setUserWeight(response.userWeight);
        setArmSize(response.armSize);
        setShoulderSize(response.shoulderSize);
        setBodySize(response.bodySize);
        setLegSize(response.legSize);
      } catch (error) {
        console.error('Error fetching user body info:', error);
      }
    };
    fetchInfo();
  }, [userEmail]);

  const navigation = useNavigation<MyFitNavigationProp>();
  return (
    <View style={styles.container}>
      <Text style={styles.firstLine}>FitPin의 분석으로</Text>
      <Text style={styles.secondLine}>당신의 체형 정보를 알려드릴게요.</Text>
      <Text style={styles.thirdLine}>나의 키 / 몸무게</Text>
      <View style={styles.rectangle}>
        <Text style={styles.userfitLabel}>
          키 : <Text style={styles.userfitValue}>{userHeight}cm</Text>
        </Text>
        <Text style={styles.userfitLabel}>
          몸무게 : <Text style={styles.userfitValue}>{userWeight}kg</Text>
        </Text>
      </View>
      <Text style={styles.thirdLine2}>내 체형 정보 확인하기</Text>
      <View style={styles.rectangle2}>
        <View>
          <Text style={styles.measurementLabel}>
            어깨너비 :{' '}
            <Text style={styles.measurementValue}>{shoulderSize}cm</Text>
          </Text>
          <Text style={styles.measurementLabel}>
            소매 길이: <Text style={styles.measurementValue}>{armSize}cm</Text>
          </Text>
          <Text style={styles.measurementLabel}>
            상체 : <Text style={styles.measurementValue}>{bodySize}cm</Text>
          </Text>
          <Text style={styles.measurementLabel}>
            다리 길이: <Text style={styles.measurementValue}>{legSize}cm</Text>
          </Text>
        </View>
      </View>
      <Text style={styles.remeasureText}>내 체형 정보를 바꾸고 싶다면?</Text>
      <Text
        style={styles.remeasureText2}
        onPress={() => navigation.replace('Body_photo', {isfirst: false})}>
        재측정 하러 가기 →
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  firstLine: {
    position: 'relative',
    top: '0.5%',
    marginHorizontal: '6%',
    fontSize: 18,
    color: '#000',
    textAlign: 'left',
    fontWeight: 'bold',
  },
  secondLine: {
    position: 'relative',
    top: '1.2%',
    marginHorizontal: '6%',
    fontSize: 18,
    color: '#878787',
    textAlign: 'left',
  },
  thirdLine: {
    position: 'relative',
    top: '5%',
    marginHorizontal: '6%',
    fontSize: 25,
    color: '#000',
    textAlign: 'left',
    fontWeight: 'bold',
  },
  thirdLine2: {
    position: 'relative',
    top: '3%',
    marginHorizontal: '6%',
    fontSize: 25,
    color: '#000',
    textAlign: 'left',
    fontWeight: 'bold',
  },
  rectangle: {
    marginTop: '14%',
    marginHorizontal: '6%',
    padding: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  rectangle2: {
    marginTop: '12%',
    height: '37%',
    marginHorizontal: '6%',
    padding: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  userfitLabel: {
    fontSize: 20,
    color: '#000',
    position: 'relative',
    top: '2%',
    marginBottom: 15,
  },
  measurementLabel: {
    fontSize: 20,
    marginBottom: 15,
    color: '#000',
  },
  userfitValue: {
    color: '#2D3FE3',
  },
  measurementValue: {
    color: '#2D3FE3',
  },
  remeasureText: {
    position: 'absolute',
    top: '92.5%',
    right: 40,
    fontSize: 16,
    color: '#878787',
  },
  remeasureText2: {
    position: 'absolute',
    top: '96%',
    right: 40,
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
  },
});

export default My_Fit;
