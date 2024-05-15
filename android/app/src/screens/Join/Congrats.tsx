import React from 'react';
import {
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';

export default function Congrats() {
  // 이미지
  const congratsImage = require('../../assets/img/congrats.png');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.pageButtonContainer}>
        {[1, 2, 3, 4].map(pageNumber => (
          <TouchableOpacity
            key={pageNumber}
            style={[styles.pageButton, styles.activeButton]}>
            <View style={[styles.circle, styles.activeCircle]} />
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
      <TouchableOpacity style={styles.longButton}>
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
    top: '30%',
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
  activeButton: {
    backgroundColor: 'transparent',
  },
  firstLine: {
    position: 'relative',
    top: '23%',
    marginHorizontal: '10%',
    fontSize: 25,
    color: '#000',
    textAlign: 'left',
    fontWeight: 'bold',
  },
  imageContainer: {
    position: 'relative',
    top: '28%',
    marginHorizontal: '10%',
  },
  image: {
    width: 156,
    height: 156,
  },
  additionalText: {
    position: 'relative',
    top: '30%',
    marginTop: '2%',
    marginHorizontal: '10%',
    fontSize: 18,
    color: '#555555',
    fontWeight: 'bold',
    textAlign: 'left',
  },
  longButton: {
    position: 'relative',
    marginHorizontal: '8%',
    top: '35%',
    backgroundColor: '#000',
    width: '85%',
    height: '7%',
    borderRadius: 31,
    justifyContent: 'center',
    alignItems: 'center',
  },
  longButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});
