import React, { useState } from 'react';
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

type ReviewDetailRouteProp = RouteProp<RootStackParamList, 'ReviewDetail'>;
type ReviewDetailNavigationProp = StackNavigationProp<RootStackParamList, 'ReviewDetail'>;

interface Review {
  imageUrl: string;
  brandName: string;
  productName: string;
  size: string | null;
  fit: string | null;
  reviewText: string;
  date: string;
}

const ReviewDetail: React.FC = () => {
  const navigation = useNavigation<ReviewDetailNavigationProp>();
  const route = useRoute<ReviewDetailRouteProp>();
  const [review, setReview] = useState<Review>(route.params.review);
  const [editMode, setEditMode] = useState(false);

  const handleSizeSelect = (size: string) => {
    setReview({ ...review, size });
  };

  const handleFitSelect = (fit: string) => {
    setReview({ ...review, fit });
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
      }
    } catch (error) {
      Alert.alert('저장 중 오류가 발생했습니다.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>핏 코멘트</Text>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: review.imageUrl }}
          style={styles.selectedImage}
        />
      </View>
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
              onPress={() => handleSizeSelect(size)}>
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
            onPress={() => handleFitSelect(fit)}>
            <View style={styles.fitTextContainer}>
              <Text
                style={[
                  styles.fitTextBold,
                  review.fit === fit && styles.selectedFitButtonText,
                ]}>
                사이즈
              </Text>
              <Text
                style={[
                  styles.fitButtonText,
                  review.fit === fit && styles.selectedFitButtonText,
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
        value={review.reviewText}
        editable={editMode}
        onChangeText={(text) => setReview({ ...review, reviewText: text })}
      />

      <TouchableOpacity style={styles.submitButton} onPress={editMode ? handleSave : () => setEditMode(true)}>
        <Text style={styles.submitButtonText}>{editMode ? "저장" : "수정"}</Text>
      </TouchableOpacity>

      {!editMode && (
        <TouchableOpacity style={[styles.submitButton, { backgroundColor: 'red' }]} onPress={handleDelete}>
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

export default ReviewDetail;