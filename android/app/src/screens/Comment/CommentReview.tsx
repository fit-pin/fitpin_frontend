import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Modal,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../../../../../App';
import {reqGet} from '../../utills/Request';
import path from 'path';
import {DATA_URL} from '../../Constant';

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
  userName: string;
  userHeight: string;
  userWeight: string;
}

const CommentReview: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'CommentReview'>>();
  const {fitStorageKey} = route.params;

  const [comment, setComment] = useState<FitComment | null>(null);

  const [isModalVisible, setIsModalVisible] = useState(false); // 모달 상태 관리

  // API 호출하여 코멘트 데이터 가져오기
  const fetchComment = async () => {
    try {
      const fitResponse = await reqGet(
        path.join(
          DATA_URL,
          'api',
          'fit_comment',
          'get_fitcomment',
          `${fitStorageKey}`,
        ),
      );

      if (fitResponse.userEmail) {
        const userbodyinfo = await reqGet(
          path.join(DATA_URL, 'api', 'userbodyinfo', fitResponse.userEmail),
        );

        if (userbodyinfo.userHeight && userbodyinfo.userWeight) {
          setComment({
            ...fitResponse,
            userHeight: userbodyinfo.userHeight,
            userWeight: userbodyinfo.userWeight,
          });
        } else {
          throw new Error(
            `${fitResponse.userEmail}유저의 키, 몸무개를 가져 올 수 없음`,
          );
        }
      } else {
        throw new Error('핏코멘트에서 이메일을 확인할 수 없음');
      }
    } catch (e) {
      console.error('Error fetching comment:', e);
    }
  };

  useEffect(() => {
    fetchComment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!comment) {
    return <Text>핏 코멘트를 찾을 수 없습니다.</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      {/* 헤더 */}
      <Text style={styles.header}>{comment.userName}님의 핏코멘트</Text>

      {/* 터치시 모달로 보여주게 */}
      <TouchableOpacity onPress={() => setIsModalVisible(true)}>
        <Image
          source={{
            uri: path.join(
              DATA_URL,
              'api',
              'img',
              'imgserve',
              'fitstorageimg',
              comment.fitStorageImg,
            ),
          }}
          resizeMode="contain"
          style={styles.galleryImage}
        />
      </TouchableOpacity>

      {/* 모달 */}
      <Modal visible={isModalVisible} transparent={true}>
        <TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContent}>
              <Image
                source={{
                  uri: path.join(
                    DATA_URL,
                    'api',
                    'img',
                    'imgserve',
                    'fitstorageimg',
                    comment.fitStorageImg,
                  ),
                }}
                style={styles.modalImage}
                resizeMode="contain"
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

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
              <Text style={styles.tagText}>{comment.userHeight}cm</Text>
            </View>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>몸무게</Text>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{comment.userWeight}kg</Text>
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
        <Text style={styles.title}>{comment.userName}님의 한줄평</Text>
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

  // 모달 설정
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // 반투명 배경
  },
  modalContent: {
    width: '90%',
    height: '70%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
});

export default CommentReview;
