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
  Modal,
  FlatList,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../../../../../App';
import { useUser } from '../UserContext';

type ReviewDetailRouteProp = RouteProp<RootStackParamList, 'ReviewDetail'>;
type ReviewDetailNavigationProp = StackNavigationProp<RootStackParamList, 'ReviewDetail'>;

interface Review {
  imageUrl: string;
  brandName: string;
  productName: string;
  size: string | null;
  fit: string | null;
  reviewText: string;
  category: string;
  date: string;
}

const ReviewDetail: React.FC = () => {
  const navigation = useNavigation<ReviewDetailNavigationProp>();
  const route = useRoute<ReviewDetailRouteProp>();
  const { userEmail } = useUser();
  const [review, setReview] = useState<Review>(route.params.review);
  const [editMode, setEditMode] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imageLoadError, setImageLoadError] = useState<boolean>(false);
  const [forceUpdateKey, setForceUpdateKey] = useState<number>(0); // 렌더링을 강제할 키 값

  useEffect(() => {
    if (editMode) {
      setImageLoadError(false);
    }
  }, [editMode]);

  useEffect(() => {
    console.log('Current Image URL:', review.imageUrl);
    setImageLoadError(false);
    setForceUpdateKey((prevKey) => prevKey + 1); // 이미지 URL 변경 시 강제 렌더링
  }, [review.imageUrl]);

  const fetchImagesFromBackend = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://fitpitback.kro.kr:8080/api/fitStorageImages/user/${userEmail}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      });
      const data = await response.json();

      if (Array.isArray(data)) {
        const imageUrls = data.map((item: { fitStorageImg: string }) =>
          `http://fitpitback.kro.kr:8080/api/img/imgserve/fitstorageimg/${item.fitStorageImg}`
        );
        setImages(imageUrls);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      Alert.alert('Error', 'Failed to fetch images.');
    } finally {
      setIsLoading(false);
    }
  };

  const openImageSelector = async () => {
    setImages([]);
    setImageLoadError(false);
    setIsModalVisible(true);
    await fetchImagesFromBackend();
  };

  const selectImage = (imageUri: string) => {
    console.log('Selected Image URL:', imageUri);
    setReview(prevReview => ({
      ...prevReview,
      imageUrl: imageUri,
    }));
    setImageLoadError(false);
    setIsModalVisible(false);
  };

  const handleDelete = async () => {
    try {
      const storedReviews = await AsyncStorage.getItem('reviews');
      if (storedReviews) {
        const reviews = JSON.parse(storedReviews) as Review[];
        const filteredReviews = reviews.filter((r: Review) => r.date !== review.date);
        await AsyncStorage.setItem('reviews', JSON.stringify(filteredReviews));
        Alert.alert('리뷰가 삭제되었습니다.');
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert('삭제 중 오류가 발생했습니다.');
    }
  };

  const handleSave = async () => {
    try {
      const storedReviews = await AsyncStorage.getItem('reviews');
      if (storedReviews) {
        const reviews = JSON.parse(storedReviews) as Review[];
        const updatedReviews = reviews.map((r: Review) => {
          if (r.date === review.date) {
            return review;
          }
          return r;
        });
        await AsyncStorage.setItem('reviews', JSON.stringify(updatedReviews));
        Alert.alert('리뷰가 수정되었습니다.');
        setEditMode(false);
        setImageLoadError(false);
      }
    } catch (error) {
      Alert.alert('저장 중 오류가 발생했습니다.');
    }
  };

  const enableEditMode = () => {
    setEditMode(true);
    setImageLoadError(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        {editMode ? (
          <TouchableOpacity onPress={openImageSelector}>
            {review.imageUrl && !imageLoadError ? (
              <Image
                source={{ uri: review.imageUrl }}
                style={styles.selectedImage}
                key={`image-${forceUpdateKey}`} // 렌더링 강제 키 값 사용
                resizeMode="cover"
                onError={(error) => {
                  console.error('Image Load Error:', error.nativeEvent.error);
                  setImageLoadError(true);
                }}
              />
            ) : (
              <Text style={styles.placeholderText}>이미지를 선택하세요</Text>
            )}
            {imageLoadError && <Text style={styles.errorText}>이미지를 불러오지 못했습니다.</Text>}
          </TouchableOpacity>
        ) : (
          review.imageUrl && !imageLoadError ? (
            <Image
              source={{ uri: review.imageUrl }}
              style={styles.selectedImage}
              key={`image-${forceUpdateKey}`} // 렌더링 강제 키 값 사용
              resizeMode="cover"
              onError={(error) => {
                console.error('Image Load Error:', error.nativeEvent.error);
                setImageLoadError(true);
              }}
            />
          ) : (
            <Text style={styles.placeholderText}>이미지 없음</Text>
          )
        )}
        {imageLoadError && <Text style={styles.errorText}>이미지를 불러오지 못했습니다.</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>카테고리</Text>
        {editMode ? (
          <RNPickerSelect
            onValueChange={(value) => setReview({ ...review, category: value })}
            items={[
              { label: '반팔', value: '반팔' },
              { label: '긴팔', value: '긴팔' },
              { label: '반팔 아우터', value: '반팔 아우터' },
              { label: '긴팔 아우터', value: '긴팔 아우터' },
              { label: '조끼', value: '조끼' },
              { label: '슬링', value: '슬링' },
              { label: '반바지', value: '반바지' },
              { label: '긴바지', value: '긴바지' },
              { label: '치마', value: '치마' },
              { label: '반팔 원피스', value: '반팔 원피스' },
              { label: '긴팔 원피스', value: '긴팔 원피스' },
              { label: '조끼 원피스', value: '조끼 원피스' },
              { label: '슬링 원피스', value: '슬링 원피스' },
            ]}
            value={review.category}
          />
        ) : (
          <Text style={styles.categoryText}>{review.category}</Text>
        )}
      </View>

      <View style={styles.line} />
      <View style={styles.inputContainer}>
        <Text style={styles.label}>브랜드명</Text>
        <TextInput
          placeholder="브랜드 이름을 적어주세요📝"
          placeholderTextColor="#999"
          style={styles.input}
          value={review.brandName}
          editable={editMode}
          onChangeText={(text) => setReview({ ...review, brandName: text })}
        />
      </View>

      <View style={styles.line} />
      <View style={styles.inputContainer}>
        <Text style={styles.label}>제품명</Text>
        <TextInput
          placeholder="제품명을 적어주세요📝"
          placeholderTextColor="#999"
          style={styles.input}
          value={review.productName}
          editable={editMode}
          onChangeText={(text) => setReview({ ...review, productName: text })}
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
                review.size === size && styles.selectedSizeButton,
              ]}
              disabled={!editMode}
              onPress={() => setReview({ ...review, size })}>
              <Text
                style={[
                  styles.sizeButtonText,
                  review.size === size && styles.selectedSizeButtonText,
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
        {['약간 작다', '딱 맞는다', '약간 크다'].map((fit, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.fitButton,
              review.fit === fit && styles.selectedFitButton,
            ]}
            disabled={!editMode}
            onPress={() => setReview({ ...review, fit })}>
            <Text
              style={[
                styles.fitButtonText,
                review.fit === fit && styles.selectedFitButtonText,
              ]}>
              {fit}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.line} />
      <Text style={styles.reviewText}>한줄평</Text>
      <TextInput
        placeholder="한줄평을 적어주세요"
        placeholderTextColor="#999"
        style={styles.reviewInput}
        value={review.reviewText}
        editable={editMode}
        onChangeText={(text) => setReview({ ...review, reviewText: text })}
      />

      <TouchableOpacity style={styles.submitButton} onPress={editMode ? handleSave : enableEditMode}>
        <Text style={styles.submitButtonText}>{editMode ? "저장" : "수정"}</Text>
      </TouchableOpacity>

      {!editMode && (
        <TouchableOpacity style={[styles.submitButton, { backgroundColor: 'red' }]} onPress={handleDelete}>
          <Text style={styles.submitButtonText}>삭제</Text>
        </TouchableOpacity>
      )}

      {/* 이미지 선택 모달 */}
      <Modal visible={isModalVisible} transparent={true} onRequestClose={() => setIsModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {isLoading ? (
              <ActivityIndicator size="large" color="#000" />
            ) : (
              <FlatList
                data={images}
                keyExtractor={(_item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => selectImage(item)} style={styles.modalImageContainer}>
                    <Image source={{ uri: item }} style={styles.modalImage} />
                  </TouchableOpacity>
                )}
                numColumns={2}
                columnWrapperStyle={styles.row}
              />
            )}
            <TouchableOpacity style={styles.closeButton} onPress={() => setIsModalVisible(false)}>
              <Text style={styles.closeButtonText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: '6%',
    backgroundColor: '#fff',
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
  selectedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    marginTop: 8,
    fontSize: 14,
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
  categoryText: {
    fontSize: 16,
    color: '#525252',
    fontWeight: 'bold',
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
  fitButtonText: {
    fontSize: 14,
    color: '#000',
    textAlign: 'center',
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
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: '95%',
    height: screenHeight * 0.9,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
  },
  modalImageContainer: {
    flex: 1,
    margin: 5,
  },
  modalImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  closeButton: {
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
});

export default ReviewDetail;