import React from 'react';
import {
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

export default function Body_photo() {
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
      <Text style={styles.firstLine}>정확한 분석으로</Text>
      <Text style={styles.secondLine}>당신에게 맞는 핏을 추천해드립니다.</Text>
      <Text style={styles.thirdLine}>체형 사진</Text>
      <View style={styles.imageContainer}>
        <TouchableOpacity style={styles.rectangleContainer}>
          <View style={styles.plusButton}>
            <Text style={styles.plusText}>+</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.rectangleContainer}>
          <View style={styles.plusButton}>
            <Text style={styles.plusText}>+</Text>
          </View>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.longButton}>
        <Text style={styles.longButtonText}>계속하기</Text>
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
    fontSize: 18,
    color: '#000',
    textAlign: 'left',
    fontWeight: 'bold',
  },
  secondLine: {
    position: 'relative',
    top: '23%',
    marginHorizontal: '10%',
    fontSize: 18,
    color: '#878787',
    textAlign: 'left',
  },
  thirdLine: {
    position: 'relative',
    top: '27%',
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
    top: '47%',
    marginHorizontal: '10%',
  },
  rectangleContainer: {
    width: '50%',
    height: '58%',
    marginHorizontal: '2%',
    backgroundColor: '#DFDFDF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    overflow: 'hidden',
  },
  plusButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  longButton: {
    position: 'relative',
    marginHorizontal: '8%',
    bottom: '-7%',
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
