import React, {useState} from 'react';
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
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../../../../App';
import {useUser} from '../UserContext';
import {DATA_URL} from '../../Constant';
import {useFocusEffect} from '@react-navigation/native';
import path from 'path';
import {reqDelete, reqGet, reqPost} from '../../utills/Request';

type ReviewDetailRouteProp = RouteProp<RootStackParamList, 'ReviewDetail'>;
type ReviewDetailNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ReviewDetail'
>;

interface Review {
  userEmail: string;
  fitStorageImg: string;
  fitComment: string;
  itemName: string;
  itemType: string;
  itemBrand: string;
  itemSize: string;
  option: string;
  date: string;
}

const ReviewDetail: React.FC = () => {
  const navigation = useNavigation<ReviewDetailNavigationProp>();
  const route = useRoute<ReviewDetailRouteProp>();
  const {userEmail} = useUser();
  const [review, setReview] = useState<Review>(route.params.review);
  const [editMode, setEditMode] = useState(false);
  const [imageLoadError, setImageLoadError] = useState<boolean>(false);
  const formattedImageUri = path.join(
    DATA_URL,
    'api',
    'img',
    'imgserve',
    'fitstorageimg',
    review.fitStorageImg,
  );

  useFocusEffect(
    React.useCallback(() => {
      fetchReview();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  const handleDelete = async () => {
    const url = path.join(DATA_URL, 'api', 'fit_comment', 'delete_comment');

    const body = {
      userEmail: review.userEmail,
      fitStorageImg: review.fitStorageImg,
    };

    try {
      await reqDelete(url, body);

      Alert.alert('리뷰가 삭제되었습니다.');
      navigation.navigate('WriteComment', {
        review: review,
      });
    } catch (error) {
      Alert.alert('삭제 중 오류가 발생했습니다.');
      console.error('이미지 삭제 오류:', error);
    }
  };

  const handleSave = async () => {
    const url = path.join(DATA_URL, 'api', 'fit_comment', 'update_comment');

    const updatedReview = {
      userEmail: review.userEmail,
      fitStorageImg: review.fitStorageImg,
      fitComment: review.fitComment || '',
      itemName: review.itemName || '',
      itemType: review.itemType || '',
      itemBrand: review.itemBrand || '',
      itemSize: review.itemSize || '',
      option: review.option || '',
    };

    try {
      const response = await reqPost(url, updatedReview);
      console.log(response);

      Alert.alert('리뷰가 수정되었습니다.');
      await fetchReview();
      setEditMode(false);
      setImageLoadError(false);
    } catch (error) {
      Alert.alert('오류', '리뷰를 수정하지 못했습니다');
      console.error('Network Error:', error);
    }
  };

  const fetchReview = async () => {
    try {
      const data: Review[] = await reqGet(
        path.join(DATA_URL, 'api', 'fitStorageImages', 'user', userEmail),
      );

      console.log('리뷰 목록:', data);
      const latestReview = data.find(
        (item: Review) => item.fitStorageImg === review.fitStorageImg,
      );

      if (latestReview) {
        console.log('Latest Review Found:', latestReview);
        setReview(latestReview);
      } else {
        console.warn('Latest review not found.');
      }
    } catch (error) {
      console.error('Error fetching review:', error);
      Alert.alert('리뷰를 가져오는 중 오류가 발생했습니다.');
    }
  };

  const enableEditMode = () => {
    setEditMode(true);
    setImageLoadError(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={{uri: formattedImageUri}}
          style={styles.selectedImage}
          resizeMode="cover"
          onError={error => {
            console.error('Image Load Error:', error.nativeEvent.error);
            setImageLoadError(true);
          }}
        />
        {imageLoadError && (
          <Text style={styles.errorText}>이미지를 불러오지 못했습니다.</Text>
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>브랜드명</Text>
        <TextInput
          placeholder="브랜드 이름을 적어주세요📝"
          placeholderTextColor="#999"
          style={styles.input}
          value={review.itemBrand}
          editable={editMode}
          onChangeText={text => setReview({...review, itemBrand: text})}
        />
      </View>

      <View style={styles.line} />
      <View style={styles.inputContainer}>
        <Text style={styles.label}>제품명</Text>
        <TextInput
          placeholder="제품명을 적어주세요📝"
          placeholderTextColor="#999"
          style={styles.input}
          value={review.itemName}
          editable={editMode}
          onChangeText={text => setReview({...review, itemName: text})}
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
                review.itemSize === size && styles.selectedSizeButton,
              ]}
              disabled={!editMode}
              onPress={() => setReview({...review, itemSize: size})}>
              <Text
                style={[
                  styles.sizeButtonText,
                  review.itemSize === size && styles.selectedSizeButtonText,
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
              review.option === fit && styles.selectedFitButton,
            ]}
            disabled={!editMode}
            onPress={() => setReview({...review, option: fit})}>
            <Text
              style={[
                styles.fitButtonText,
                review.option === fit && styles.selectedFitButtonText,
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
        value={review.fitComment}
        editable={editMode}
        onChangeText={text => setReview({...review, fitComment: text})}
      />

      <TouchableOpacity
        style={styles.submitButton}
        onPress={editMode ? handleSave : enableEditMode}>
        <Text style={styles.submitButtonText}>
          {editMode ? '저장' : '수정'}
        </Text>
      </TouchableOpacity>

      {!editMode && (
        <TouchableOpacity
          style={[styles.submitButton, {backgroundColor: 'red'}]}
          onPress={handleDelete}>
          <Text style={styles.submitButtonText}>삭제</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

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
});

export default ReviewDetail;
