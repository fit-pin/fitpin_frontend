import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  SafeAreaView,
  View,
  Image,
} from 'react-native';
import {RootStackParamList} from '../../../../../App.tsx';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

type MainScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Remeasure'
>;

const Remeasure = () => {
  const navigation = useNavigation<MainScreenNavigationProp>();
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.firstLine}>정확한 분석으로</Text>
      <Text style={styles.secondLine}>당신에게 맞는 핏을 추천해드립니다.</Text>
      <Text style={styles.thirdLine}>체형 사진 업로드</Text>
      <View style={styles.imageContainer}>
        <TouchableOpacity
          style={styles.rectangleContainer}
          onPress={() => navigation.navigate('Camera')}>
          <View style={styles.plusButton}>
            <Image
              source={require('../../assets/img/write/camera.png')}
              style={styles.icon}
            />
            <Image
              source={require('../../assets/img/write/add.png')}
              style={styles.plusIcon}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.rectangleContainer}
          onPress={() => navigation.navigate('Camera')}>
          <View style={styles.plusButton}>
            <Image
              source={require('../../assets/img/write/camera.png')}
              style={styles.icon}
            />
            <Image
              source={require('../../assets/img/write/add.png')}
              style={styles.plusIcon}
            />
          </View>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.longButton}>
        <Text style={styles.longButtonText}>재측정하기</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
  },
  pageButtonContainer: {
    position: 'relative',
    top: '21%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginHorizontal: '8.5%',
  },
  pageButton: {
    marginHorizontal: '2%',
  },
  circle: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  activeCircle: {
    backgroundColor: '#D9D9D9',
  },
  blackCircle: {
    backgroundColor: '#000',
  },
  activeButton: {
    backgroundColor: 'transparent',
  },
  blackButton: {
    backgroundColor: 'transparent',
  },
  firstLine: {
    position: 'relative',
    top: '16%',
    marginHorizontal: '10%',
    fontSize: 18,
    color: '#000',
    textAlign: 'left',
    fontWeight: 'bold',
  },
  secondLine: {
    position: 'relative',
    top: '16.5%',
    marginHorizontal: '10%',
    fontSize: 18,
    color: '#878787',
    textAlign: 'left',
  },
  thirdLine: {
    position: 'relative',
    top: '21%',
    marginHorizontal: '10%',
    fontSize: 25,
    color: '#000',
    textAlign: 'left',
    fontWeight: 'bold',
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'relative',
    top: '45%',
    marginHorizontal: '10%',
  },
  rectangleContainer: {
    width: '48%',
    height: '55%',
    marginHorizontal: '2.5%',
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    overflow: 'hidden',
  },
  plusButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  plusIcon: {
    position: 'absolute',
    right: 5,
    bottom: 10,
    width: 27,
    height: 27,
    resizeMode: 'contain',
  },
  longButton: {
    marginHorizontal: '8%',
    backgroundColor: '#000',
    width: '85%',
    height: '8%',
    borderRadius: 31,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '15%',
    bottom: '4.5%',
  },
  longButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default Remeasure;
