import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../../../../../App';

type WriteCommentRouteProp = RouteProp<RootStackParamList, 'WriteComment'>;
type WriteCommentNavigationProp = StackNavigationProp<RootStackParamList, 'WriteComment'>;

interface Review {
  imageUrl: string;
  brandName: string;
  productName: string;
  size: string | null;
  fit: string | null;
  reviewText: string;
}

const WriteComment: React.FC = () => {
  const navigation = useNavigation<WriteCommentNavigationProp>();
  const route = useRoute<WriteCommentRouteProp>();
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const storedReviews = await AsyncStorage.getItem('reviews');
      if (storedReviews) {
        setReviews(JSON.parse(storedReviews));
      }
    };

    fetchReviews();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {reviews.map((review, index) => (
        <View key={index} style={styles.commentContainer}>
          <View style={styles.detailsContainer}>
            <Text style={styles.title}>{review.productName}</Text>
            <Text style={styles.size}>{review.size}</Text>
            <Text style={styles.comment}>
              {review.reviewText}
            </Text>
          </View>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: review.imageUrl }}
              style={styles.image}
            />
          </View>
        </View>
      ))}
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
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
