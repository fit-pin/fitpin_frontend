import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {RootStackParamList} from '../../../../../App';
import BottomTabNavigator from '../Navigation/BottomTabNavigator';
import {useFocusEffect} from '@react-navigation/native';
import {useCallback} from 'react';
import path from 'path';
import {DATA_URL} from '../../Constant';

interface FitComment {
  fitStorageKey: number;
  itemBrand: string | null;
  itemName: string | null;
  fitComment: string | null;
  itemSize: string | null;
  imageUrl?: string; // 이미지 경로를 위한 선택적 필드
  fitStorageImg: string; // 서버 응답에 포함된 이미지 파일명
  userEmail: string;
  userName: string | null;
}

let backupComment: FitComment[] | undefined;

type HeaderProps = {
  setComments: React.Dispatch<React.SetStateAction<FitComment[]>>;
};
const RenderHeader = (props: HeaderProps) => {
  const navigation =
    useNavigation<NavigationProp<RootStackParamList, 'Comment'>>();

  const searchHandler = (value: string) => {
    if (!backupComment) {
      return;
    }

    const result = backupComment.filter(itme => itme.itemName?.includes(value));
    props.setComments(result);
  };

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.platformName}>옷에 대한 정보를 공유해요</Text>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate('Cart')}>
          <Image
            source={require('../../assets/img/main/shop.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          onChangeText={searchHandler}
          placeholder="궁금한 옷 정보를 검색해보세요"
        />
        <TouchableOpacity>
          <Image
            source={require('../../assets/img/search/search.png')}
            style={styles.searchIcon}
          />
        </TouchableOpacity>
      </View>
    </>
  );
};

const Comment: React.FC = () => {
  const navigation =
    useNavigation<NavigationProp<RootStackParamList, 'Comment'>>();

  const [loading, setLoading] = useState<boolean>(true);
  const [comments, setComments] = useState<FitComment[]>([]);

  const baseImageUrl = path.join(
    DATA_URL,
    'api',
    'img',
    'imgserve',
    'fitstorageimg',
  );

  const fetchComments = async () => {
    try {
      setLoading(true); // 새로고침 시 로딩 상태 설정
      const response = await fetch(
        path.join(DATA_URL, 'api', 'fit_comment', 'get_fitcomment'),
      );
      if (response.ok) {
        const data = await response.json();
        console.log('Filtered User Comments:', data);
        backupComment = adjustForOddItems(data);
        setComments(adjustForOddItems(data));
      } else {
        console.error('Failed to fetch comments');
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchComments(); // 화면에 포커스될 때마다 리뷰 목록 새로고침
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  const adjustForOddItems = (items: FitComment[]) => {
    if (items.length % 2 !== 0) {
      return [
        ...items,
        {
          fitStorageKey: -1,
          itemBrand: '',
          itemName: '',
          fitComment: '',
          itemSize: '',
          fitStorageImg: '',
          userEmail: '',
          userName: null,
        },
      ];
    }
    return items;
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        작성된 리뷰가 없거나, 검색어를 찾을 수 없습니다.
      </Text>
    </View>
  );
  const renderItem = ({item}: {item: FitComment}) => {
    if (item.fitStorageKey === -1) return <View style={styles.emptyCard} />;
    const imageUrl = `${baseImageUrl}/${item.fitStorageImg}`;

    return (
      <TouchableOpacity
        style={styles.imgRectangle}
        onPress={() =>
          navigation.navigate('CommentReview', {
            fitStorageKey: item.fitStorageKey,
          })
        }>
        <Image
          source={{uri: imageUrl}}
          style={styles.productImage}
          onError={() => console.warn(`Failed to load image: ${imageUrl}`)}
        />
        <View style={styles.textContainer}>
          <Text style={styles.brandName}>{item.itemBrand || '브랜드'}</Text>
          <View style={styles.sizeContainer}>
            <Text style={styles.clothName}>{item.itemName || '옷 이름'}</Text>
            <Text style={styles.Size}>{item.itemSize || 'M'}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={comments}
        renderItem={renderItem}
        keyExtractor={item => item.fitStorageKey.toString()}
        numColumns={2} // 한 줄에 2개씩 배치
        columnWrapperStyle={styles.columnWrapper} // 컬럼 여백 스타일
        contentContainerStyle={styles.contentContainer} // 리스트 전체 여백
        ListHeaderComponent={<RenderHeader setComments={setComments} />} // 헤더 컴포넌트 추가
        ListEmptyComponent={renderEmptyComponent} // 데이터가 없을 때 표시할 컴포넌트
      />
      <TouchableOpacity
        style={styles.writeButton}
        onPress={() =>
          navigation.navigate('WritePage', {selectedImageUri: undefined})
        } // 상태 초기화를 위해 undefined 전달
      >
        <Image
          source={require('../../assets/img/main/write.png')}
          style={styles.writeIcon}
          onError={() => console.warn('Failed to load write icon.')}
        />
      </TouchableOpacity>

      <BottomTabNavigator />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingHorizontal: 10, // 좌우 여백 조정
    paddingBottom: 120, // 탭바와 간격 유지
  },
  columnWrapper: {
    justifyContent: 'space-between', // 컬럼 간격 균등하게 분배
    marginBottom: 12, // 아래쪽 간격 조정
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '8%',
    paddingHorizontal: '5%',
  },
  platformName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  iconButton: {
    marginLeft: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 8,
  },
  icon: {
    width: 24,
    height: 24,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: '4%',
    paddingHorizontal: '3%',
    borderRadius: 30,
    backgroundColor: '#F4F4F4',
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#000',
  },
  searchIcon: {
    width: 21,
    height: 21,
  },
  sections: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: '1%',
    marginBottom: 15,
  },
  sectionButton: {
    paddingVertical: '1%',
  },
  sectionText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  imgRectangle: {
    width: (Dimensions.get('window').width - 40) / 2, // 카드 너비 조정
    marginHorizontal: 5, // 카드 간 좌우 간격
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    overflow: 'hidden',
    height: 260, // 카드 높이 조정
    borderColor: '#E0E0E0',
    borderWidth: 1,
  },
  productImage: {
    width: '100%',
    height: '70%', // 이미지가 카드의 70% 차지
    resizeMode: 'cover', // 비율 유지하며 꽉 채우기
  },
  textContainer: {
    height: '30%',
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 6,
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  brandName: {
    fontSize: 13,
    color: '#919191',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  sizeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  clothName: {
    fontSize: 14,
    color: '#000',
    fontWeight: 'bold',
  },
  Size: {
    fontSize: 14,
    color: '#000',
  },
  writeButton: {
    position: 'absolute',
    bottom: '10%',
    right: '4%',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  writeIcon: {
    width: 60,
    height: 60,
  },
  emptyCard: {
    flex: 1,
    margin: 8,
    backgroundColor: 'transparent',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '50%',
  },
  emptyText: {
    fontSize: 16,
    color: '#919191',
    textAlign: 'center',
  },
});

export default Comment;
