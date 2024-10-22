import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import {
  useNavigation,
  useRoute,
  RouteProp,
} from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../../../App';
import { useUser } from '../UserContext';

type WriteCommentRouteProp = RouteProp<RootStackParamList, 'WriteComment'>;
type WriteCommentNavigationProp = StackNavigationProp<
  RootStackParamList,
  'WriteComment'
>;

interface Review {
  userEmail: string;
  fitStorageImg: string;
  fitComment: string;
  itemType: string;
  itemBrand: string;
  itemSize: string;
  option: string;
}

const WriteComment: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const navigation = useNavigation<WriteCommentNavigationProp>();
  const { userEmail } = useUser();

  // 리뷰 목록 불러오기
  const fetchReviews = async () => {
    try {
      const response = await fetch(
        `http://fitpitback.kro.kr:8080/api/fitStorageImages/user/${userEmail}`
      );
      const data = await response.json();
      if (Array.isArray(data)) {
        setReviews(data);
      } else {
        Alert.alert('오류', '리뷰 데이터를 불러오지 못했습니다.');
      }
    } catch (error) {
      console.error('리뷰 로드 오류:', error);
      Alert.alert('오류', '리뷰를 불러오는 중 문제가 발생했습니다.');
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // 리뷰 클릭 시 상세 페이지로 이동하는 함수
  const handleReviewPress = (review: Review) => {
    navigation.navigate('ReviewDetail', { review });
  };

  return (
    <ScrollView style={styles.container}>
      {reviews.length > 0 ? (
        reviews.map((review, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleReviewPress(review)}>
            <View style={styles.commentContainer}>
              <View style={styles.detailsContainer}>
                <Text style={styles.title}>{review.itemBrand}</Text>
                <Text style={styles.size}>{review.itemSize}</Text>
                <Text style={styles.comment}>{review.fitComment}</Text>
              </View>
              <View style={styles.imageContainer}>
                <Image
                  source={{
                    uri: `http://fitpitback.kro.kr:8080/api/img/imgserve/fitstorageimg/${review.fitStorageImg}`,
                  }}
                  style={styles.image}
                />
              </View>
            </View>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={styles.noReviewText}>작성된 리뷰가 없습니다.</Text>
      )}
    </ScrollView>
  );
};

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    flex: 1,
  },
  commentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginVertical: 5,
  },
  detailsContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    color: '#000',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  size: {
    fontSize: 17,
    color: '#767676',
    marginBottom: 5,
  },
  comment: {
    fontSize: 15,
    color: '#767676',
  },
  imageContainer: {
    width: screenWidth * 0.22,
    height: screenWidth * 0.22,
    backgroundColor: '#f4f4f4',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginLeft: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: 10,
  },
  noReviewText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginTop: 20,
  },
});

export default WriteComment;