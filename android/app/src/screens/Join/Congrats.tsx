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
    padding: 8,
  },
  pageButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 100,
    marginHorizontal: 24,
  },
  pageButton: {
    marginHorizontal: 5,
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
    marginHorizontal: 30,
    fontSize: 25,
    color: '#000',
    textAlign: 'left',
    fontWeight: 'bold',
    marginTop: 38,
  },
  imageContainer: {
    alignItems: 'flex-end',
    marginRight: 210,
    marginTop: 20,
  },
  image: {
    width: 156,
    height: 156,
  },
  additionalText: {
    marginHorizontal: 30,
    fontSize: 18,
    color: '#555555',
    fontWeight: 'bold',
    textAlign: 'left',
    marginTop: 30,
    marginBottom: -25,
  },
  longButton: {
    marginHorizontal: 25,
    marginTop: 50,
    backgroundColor: '#000',
    width: 345,
    height: 62,
    borderRadius: 31,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
  },
  longButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});
