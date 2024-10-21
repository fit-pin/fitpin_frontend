import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  useNavigation,
  useRoute,
  RouteProp,
  useFocusEffect,
} from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../../../App';
import { useUser } from '../UserContext';  // 유저 정보 가져오는 Context 사용

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
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation<WriteCommentNavigationProp>();
  const { userEmail } = useUser();  // 로그인한 유저의 이메일 가져옴

  // 서버에서 리뷰 데이터 가져오기
  const fetchReviews = async () => {
    try {
      const response = await fetch(
        `http://fitpitback.kro.kr:8080/api/fitStorageImages/user/${userEmail}`
      );

      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      } else {
        Alert.alert('오류', '리뷰를 불러오는 데 실패했습니다.');
      }
    } catch (error) {
      console.error('리뷰를 불러오는 중 오류 발생:', error);
      Alert.alert('오류', '서버와의 연결에 문제가 있습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();  // 컴포넌트가 마운트될 때 리뷰를 가져옴
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchReviews();  // 페이지 포커스 시 리뷰 데이터 갱신

      return () => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Comment' }],
        });
      };
    }, [navigation])
  );

  const handleReviewPress = (review: Review) => {
    navigation.navigate('ReviewDetail', { review });
  };

  return (
    <ScrollView style={styles.container}>
      {loading ? (
        <Text>로딩 중...</Text>
      ) : reviews.length > 0 ? (
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
        <Text>작성된 리뷰가 없습니다.</Text>
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
    marginBottom: 15,
  },
  size: {
    fontSize: 17,
    color: '#767676',
    marginBottom: 10,
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
});

export default WriteComment;