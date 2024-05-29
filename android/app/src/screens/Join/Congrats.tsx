import React from 'react';
import {
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../../../../App.tsx';

type CongratsNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

export default function Congrats() {
  const navigation = useNavigation<CongratsNavigationProp>();

  // 이미지
  const congratsImage = require('../../assets/img/join/congrats.png');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.pageButtonContainer}>
        {[1, 2, 3, 4].map((pageNumber, index) => (
          <TouchableOpacity
            key={pageNumber}
            style={[styles.pageButton, styles.activeButton]}>
            <View
              style={[
                styles.circle,
                index === 3 ? styles.blackCircle : styles.activeCircle,
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.firstLine}>환영합니다</Text>
      <View style={styles.imageContainer}>
        <Image source={congratsImage} style={styles.image} />
      </View>
      <Text style={styles.additionalText}>모든 단계가 끝났습니다!</Text>
      <Text style={styles.additionalText}>이제 버튼을 눌러</Text>
      <Text style={styles.additionalText}>당신의 핏을 찾아보세요</Text>
      <TouchableOpacity
        style={styles.longButton}
        onPress={() => navigation.navigate('Main')}>
        <Text style={styles.longButtonText}>시작하기</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

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
    backgroundColor: '#000',
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
  firstLine: {
    position: 'relative',
    top: '17%',
    marginHorizontal: '10%',
    fontSize: 25,
    color: '#000',
    textAlign: 'left',
    fontWeight: 'bold',
  },
  imageContainer: {
    position: 'relative',
    top: '23%',
    marginHorizontal: '10%',
  },
  image: {
    width: 156,
    height: 156,
  },
  additionalText: {
    position: 'relative',
    top: '26%',
    marginTop: '2%',
    marginHorizontal: '10%',
    fontSize: 18,
    color: '#555555',
    fontWeight: 'bold',
    textAlign: 'left',
  },
  longButton: {
    marginHorizontal: '8%',
    backgroundColor: '#000',
    width: '85%',
    height: '8%',
    borderRadius: 31,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '65%',
    bottom: '4.5%',
  },
  longButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});
