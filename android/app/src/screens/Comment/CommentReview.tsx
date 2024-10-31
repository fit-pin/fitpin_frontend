import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../../../../../App';
import {useUser} from '../UserContext';

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
  const {fitStorageKey} = route.params;

  const {userName, userHeight, userWeight} = useUser();

  const [comment, setComment] = useState<FitComment | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // API 호출하여 코멘트 데이터 가져오기
  const fetchComment = async () => {
    try {
      const response = await fetch(
        `http://fitpitback.kro.kr:8080/api/fit_comment/get_fitcomment/${fitStorageKey}`,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!comment) {
    return <Text>해당 코멘트를 찾을 수 없습니다.</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      {/* 헤더 */}
      <Text style={styles.header}>{userName}님의 핏코멘트</Text>

      {/* 이미지 */}
      <Image
        source={{
          uri: `http://fitpitback.kro.kr:8080/api/img/imgserve/fitstorageimg/${comment.fitStorageImg}`,
        }}
        style={styles.galleryImage}
      />

      {/* 옷 이름과 종류 */}
      <View style={styles.textContainer}>
        <Text style={styles.clothingName}>{comment.itemName}</Text>
        <Text style={styles.clothingType}>{comment.itemType}</Text>
      </View>

      <View style={styles.line} />

      {/* 기본 정보 섹션 */}
      <View style={styles.infoSection}>
        <Text style={styles.title}>기본 정보</Text>
        <View style={styles.row}>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Size</Text>
            <View style={styles.blackTag}>
              <Text style={styles.whiteTagText}>{comment.itemSize}</Text>
            </View>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>키</Text>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{userHeight}cm</Text>
            </View>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>몸무게</Text>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{userWeight}kg</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.line} />

      <View style={styles.optionSection}>
        <Text style={styles.title}>선택 옵션</Text>
        <View style={styles.optionBox}>
          <Text style={styles.optionLabel}>사이즈</Text>
          <Text style={styles.optionText}>{comment.option}</Text>
        </View>
      </View>

      <View style={styles.line} />

      {/* 한줄평 섹션 */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{userName}님의 한줄평</Text>
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
  galleryImage: {
    width: '100%',
    height: 250,
    borderRadius: 10,
  },
  line: {
    height: 1,
    backgroundColor: '#E9E9E9',
    marginVertical: '2%',
  },
  infoSection: {
    marginVertical: '3%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  blackTag: {
    backgroundColor: '#000', // 검정색 배경
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  whiteTagText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff', // 하얀색 글씨
  },
  infoBox: {
    alignItems: 'center',
    width: '30%',
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  tag: {
    backgroundColor: '#F4F4F4',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  textContainer: {
    marginTop: '3%',
    marginBottom: '3%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  reviewText: {
    fontSize: 14,
    color: '#000',
    marginTop: '3%',
    marginBottom: '3%',
  },
  clothingName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  clothingType: {
    fontSize: 15,
    color: '#929292',
    marginBottom: '3%',
  },
  optionSection: {
    marginVertical: '3%',
  },
  optionBox: {
    backgroundColor: '#F4F4F4',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    minWidth: '30%',
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  optionText: {
    fontSize: 14,
    color: '#000',
  },
});

export default CommentReview;
