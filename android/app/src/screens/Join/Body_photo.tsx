import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  SafeAreaView,
  View,
  ToastAndroid,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {RootStackParamList} from '../../../../../App.tsx';
import {useUser} from '../UserContext.tsx';

type BodyPhotoNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Body_photo'
>;

export default function Body_photo() {
  const navigation = useNavigation<BodyPhotoNavigationProp>();
  const context = useUser();

  const handleNextPress = () => {
    if (context.userGender === 'female') {
      navigation.navigate('Style_G');
    } else {
      navigation.navigate('Style_B');
    }
  };

  const handleSelectImg = async () => {
    const reqImg = await launchImageLibrary({
      mediaType: 'photo',
      includeBase64: false,
    });

    const uri = reqImg.assets!![0].uri;
    if (!uri) {
      ToastAndroid.show(
        '사진을 인식할 수 없습니다. 다시 선택하세요',
        ToastAndroid.SHORT,
      );
      return;
    }

    navigation.navigate('Loading', {uri: uri});
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.pageButtonContainer}>
        {[1, 2, 3, 4].map((pageNumber, index) => (
          <TouchableOpacity
            key={pageNumber}
            style={[
              styles.pageButton,
              index === 1 ? styles.blackButton : styles.activeButton,
            ]}>
            <View
              style={[
                styles.circle,
                index === 1 ? styles.blackCircle : styles.activeCircle,
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.firstLine}>정확한 분석으로</Text>
      <Text style={styles.secondLine}>당신에게 맞는 핏을 추천해드립니다.</Text>
      <Text style={styles.thirdLine}>체형 사진</Text>
      <View style={styles.imageContainer}>
        <TouchableOpacity
          style={styles.rectangleContainer}
          onPress={() => navigation.navigate('Camera')}>
          <View style={styles.plusButton}>
            <Text style={styles.plusText}>+</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.rectangleContainer}
          onPress={handleSelectImg}>
          <View style={styles.plusButton}>
            <Text style={styles.plusText}>+</Text>
          </View>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.longButton} onPress={handleNextPress}>
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
    width: '50%',
    height: '58%',
    marginHorizontal: '1.5%',
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
  plusText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
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
