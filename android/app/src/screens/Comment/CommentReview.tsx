import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../../../../App';

interface FitComment {
  fitStorageKey: number;
  userEmail: string;
  fitStorageImg: string;
  fitComment: string;
  itemName: string;
  itemType: string;
  itemBrand: string;
  itemSize: string;
  option: string;
}

const CommentReview: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'CommentReview'>>();
  const { fitStorageKey } = route.params;

  const [comment, setComment] = useState<FitComment | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // API 호출하여 코멘트 데이터 가져오기
  const fetchComment = async () => {
    try {
      const response = await fetch(
        `http://fitpitback.kro.kr:8080/api/fit_comment/get_fitcomment/${fitStorageKey}`
      );
      if (response.ok) {
        const data = await response.json();
        setComment(data);
      } else {
        console.error('Comment not found');
      }
    } catch (error) {
      console.error('Error fetching comment:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComment();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!comment) {
    return <Text>해당 코멘트를 찾을 수 없습니다.</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>{comment.userEmail}님의 핏코멘트</Text>
      <Image
        source={{ uri: `http://fitpitback.kro.kr:8080/api/img/imgserve/fitstorageimg/${comment.fitStorageImg}` }}
        style={styles.image}
      />
      <View style={styles.line} />
      <View style={styles.textContainer}>
        <Text style={styles.clothingName}>{comment.itemName}</Text>
        <Text style={styles.clothingType}>{comment.itemType}</Text>
        <View style={styles.line} />
        <Text style={styles.title}>기본 정보</Text>
        <Text>브랜드: {comment.itemBrand}</Text>
        <Text>사이즈: {comment.itemSize}</Text>
        <Text>옵션: {comment.option}</Text>
      </View>
      <View style={styles.line} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>한줄평</Text>
        <Text style={styles.reviewText}>{comment.fitComment}</Text>
      </View>
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
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: '4%',
    color: '#000',
  },
  line: {
    height: 1,
    backgroundColor: '#E9E9E9',
    marginVertical: '2%',
  },
  textContainer: {
    marginTop: '3%',
    marginBottom: '3%',
  },
  clothingName: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#000',
  },
  clothingType: {
    fontSize: 15,
    color: '#666',
    marginBottom: '3%',
    marginTop: '1%',
  },
  title: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#000',
  },
  reviewText: {
    fontSize: 14,
    color: '#000',
    marginTop: '3%',
    marginBottom: '3%',
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginBottom: '3%',
  },
});

export default CommentReview;