import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../../../../../App';

type WritePageRouteProp = RouteProp<RootStackParamList, 'WritePage'>;
type WritePageNavigationProp = StackNavigationProp<RootStackParamList, 'WritePage'>;

const WritePage: React.FC = () => {
  const navigation = useNavigation<WritePageNavigationProp>();
  const route = useRoute<WritePageRouteProp>();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedFit, setSelectedFit] = useState<string | null>(null);
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [brandName, setBrandName] = useState<string>('');
  const [productName, setProductName] = useState<string>('');
  const [reviewText, setReviewText] = useState<string>('');

  useEffect(() => {
    if (route.params?.selectedImageUri) {
      setSelectedImageUri(route.params.selectedImageUri);
    }
  }, [route.params?.selectedImageUri]);

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
  };

  const handleFitSelect = (fit: string) => {
    setSelectedFit(fit);
  };

  const handleSubmit = async () => {
    if (!selectedImageUri) {
      Alert.alert('이미지를 선택해주세요.');
      return;
    }

    const review = {
      imageUrl: selectedImageUri,
      brandName,
      productName,
      size: selectedSize,
      fit: selectedFit,
      reviewText,
      date: new Date().toISOString(),
    };

    try {
      const storedReviews = await AsyncStorage.getItem('reviews');
      const reviews = storedReviews ? JSON.parse(storedReviews) : [];
      reviews.push(review);
      await AsyncStorage.setItem('reviews', JSON.stringify(reviews));

      navigation.reset({
        index: 0,
        routes: [{ name: 'WriteComment', params: { review, fromWritePage: true } }],
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        Alert.alert('리뷰 작성 중 오류가 발생했습니다.', error.message);
      } else {
        console.error('An unknown error occurred');
        Alert.alert('리뷰 작성 중 오류가 발생했습니다.', '알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  const fitOptions = ['약간 작다', '딱 맞는다', '약간 크다'];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>핏 코멘트 작성하기</Text>
      <View style={styles.imageContainer}>
        {selectedImageUri ? (
          <Image
            source={{ uri: selectedImageUri }}
            style={styles.selectedImage}
          />
        ) : (
          <TouchableOpacity
            onPress={() => navigation.navigate('Fit_box', {})}
            style={styles.selectImageButton}>
            <Image
              source={require('../../assets/img/write/camera.png')}
              style={styles.cameraIcon}
            />
            <Image
              source={require('../../assets/img/write/add.png')}
              style={styles.plusIcon}
            />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>브랜드명</Text>
        <TextInput
          placeholder="브랜드 이름을 적어주세요📝"
          placeholderTextColor="#999"
          style={styles.input}
          value={brandName}
          onChangeText={setBrandName}
        />
      </View>
      <View style={styles.line} />
      <View style={styles.inputContainer}>
        <Text style={styles.label}>제품명</Text>
        <TextInput
          placeholder="제품명을 적어주세요📝"
          placeholderTextColor="#999"
          style={styles.input}
          value={productName}
          onChangeText={setProductName}
        />
      </View>
      <View style={styles.line} />
      <View style={styles.sizeContainer}>
        <Text style={styles.sizeTitle}>Select Size</Text>
        <View style={styles.sizeButtons}>
          {['S', 'M', 'L', 'XL', 'XXL', 'Free'].map(size => (
            <TouchableOpacity
              key={size}
              style={[
                styles.sizeButton,
                selectedSize === size && styles.selectedSizeButton,
              ]}
              onPress={() => handleSizeSelect(size)}>
              <Text
                style={[
                  styles.sizeButtonText,
                  selectedSize === size && styles.selectedSizeButtonText,
                ]}>
                {size}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.line} />
      <Text style={styles.selectOptionText}>선택 옵션</Text>
      <View style={styles.fitOptions}>
        {fitOptions.map((fit, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.fitButton,
              selectedFit === fit && styles.selectedFitButton,
            ]}
            onPress={() => handleFitSelect(fit)}>
            <View style={styles.fitTextContainer}>
              <Text
                style={[
                  styles.fitTextBold,
                  selectedFit === fit && styles.selectedFitButtonText,
                ]}>
                사이즈
              </Text>
              <Text
                style={[
                  styles.fitButtonText,
                  selectedFit === fit && styles.selectedFitButtonText,
                ]}>
                {fit}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.line} />
      <Text style={styles.reviewText}>한줄평</Text>
      <TextInput
        placeholder="한줄평을 적어주세요"
        placeholderTextColor="#999"
        style={styles.reviewInput}
        value={reviewText}
        onChangeText={setReviewText}
      />
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>후기 올리기</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: '6%',
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: '4%',
    color: '#000',
  },
  imageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 16,
  },
  selectImageButton: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  cameraIcon: {
    width: 50,
    height: 50,
  },
  plusIcon: {
    width: 30,
    height: 30,
    position: 'absolute',
    right: 10,
    bottom: 10,
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  inputContainer: {
    marginBottom: '3%',
  },
  label: {
    fontSize: 16,
    marginBottom: '1%',
    color: '#000',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    fontSize: 16,
    color: '#000',
    marginTop: '2%',
  },
  line: {
    height: 1,
    backgroundColor: '#E9E9E9',
    marginVertical: '2%',
    marginBottom: '3%',
  },
  sizeContainer: {
    marginBottom: '2%',
  },
  sizeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000',
  },
  sizeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  sizeButton: {
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 8,
    flexBasis: '30%',
    alignItems: 'center',
  },
  selectedSizeButton: {
    backgroundColor: '#000',
  },
  sizeButtonText: {
    fontSize: 15,
    textAlign: 'center',
    color: '#000',
  },
  selectedSizeButtonText: {
    color: '#fff',
  },
  selectOptionText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000',
  },
  fitOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fitButton: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 8,
    flexBasis: '30%',
    alignItems: 'center',
  },
  selectedFitButton: {
    backgroundColor: '#000',
  },
  fitTextContainer: {
    alignItems: 'center',
  },
  fitTextBold: {
    fontWeight: 'bold',
    color: '#000',
    fontSize: 15,
    right: '19%',
  },
  fitButtonText: {
    fontSize: 14,
    color: '#000',
    textAlign: 'center',
    right: '10%',
  },
  selectedFitButtonText: {
    color: '#fff',
  },
  reviewText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000',
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    height: 100,
    fontSize: 16,
    color: '#000',
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: '#000',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: '4%',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    top: '-5%',
  },
});

export default WritePage;