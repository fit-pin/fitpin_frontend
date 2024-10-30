import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../../../App';
import BottomTabNavigator from '../Navigation/BottomTabNavigator';
import { useUser } from '../UserContext'; // UserContext 불러오기

interface FitComment {
  fitStorageKey: number;
  itemBrand: string;
  itemName: string;
  fitComment: string;
  itemSize: string;
  imageUrl: string;
  userEmail: string; // 사용자 이메일 필드 추가
}

const Comment: React.FC = () => {
  const { userEmail } = useUser(); // UserContext에서 이메일 가져오기
  const navigation = useNavigation<NavigationProp<RootStackParamList, 'Comment'>>();

  const [selectedSection, setSelectedSection] = useState<string>('상의');
  const [loading, setLoading] = useState<boolean>(true);
  const [comments, setComments] = useState<FitComment[]>([]);

  const sections: string[] = ['상의', '하의', '아우터', '정장'];

  useEffect(() => {
    fetchComments();
  }, []);

  const baseImageUrl = 'http://fitpitback.kro.kr:8080/api/img/imgserve/fitstorageimg/';

  const fetchComments = async () => {
    try {
      const response = await fetch('http://fitpitback.kro.kr:8080/api/fit_comment/get_fitcomment');
      if (response.ok) {
        const data = await response.json();
  
        // 리뷰가 있는 항목만 필터링 (fitComment가 존재하고 빈 문자열이 아닌 경우)
        const userComments = data.filter(
          (comment: FitComment) =>
            comment.userEmail === userEmail && comment.fitComment && comment.fitComment.trim() !== ''
        );
  
        setComments(adjustForOddItems(userComments)); // 홀수 개 처리
      } else {
        console.error('Failed to fetch comments');
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const adjustForOddItems = (items: FitComment[]) => {
    if (items.length % 2 !== 0) {
      return [...items, { fitStorageKey: -1, itemBrand: '', itemName: '', fitComment: '', itemSize: '', imageUrl: '', userEmail: '' }];
    }
    return items;
  };

  const renderHeader = () => (
    <>
      <View style={styles.header}>
        <Text style={styles.platformName}>옷에 대한 정보를 공유해요</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
          <Image source={require('../../assets/img/main/shop.png')} style={styles.cartImage} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchBar}>
        <TextInput style={styles.searchInput} placeholder="궁금한 옷 정보를 검색해보세요" />
        <TouchableOpacity>
          <Image source={require('../../assets/img/search/search.png')} style={styles.searchIcon} />
        </TouchableOpacity>
      </View>

      <View style={styles.sections}>
        {sections.map((section) => (
          <TouchableOpacity
            key={section}
            style={styles.sectionButton}
            onPress={() => setSelectedSection(section)}
          >
            <Text
              style={[
                styles.sectionText,
                { color: selectedSection === section ? '#000' : '#919191' },
              ]}
            >
              {section}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
  
  const renderItem = ({ item }: { item: FitComment }) => {
    if (item.fitStorageKey === -1) return <View style={styles.emptyCard} />;
  
    return (
      <TouchableOpacity
        style={styles.imgRectangle}
        onPress={() =>
          navigation.navigate('CommentReview', { fitStorageKey: item.fitStorageKey })
        }
      >
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.productImage}
          onError={() => console.warn(`Failed to load image: ${item.imageUrl}`)}
        />
        <View style={styles.textContainer}>
          <Text style={styles.brandName}>{item.itemBrand}</Text>
          {/* 사이즈를 옆으로 배치 */}
          <View style={styles.sizeContainer}>
            <Text style={styles.clothName}>{item.itemName}</Text>
            <Text style={styles.Size}>{item.itemSize}</Text>
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
        keyExtractor={(item) => item.fitStorageKey.toString()}
        numColumns={2}
        ListHeaderComponent={renderHeader}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.contentContainer}
      />

      {/* 플로팅 버튼 */}
        <TouchableOpacity
          style={styles.writeButton}
          onPress={() => navigation.navigate('WritePage', { selectedImageUri: undefined })}
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
    paddingHorizontal: '5%', // 여유 공간 확보
    paddingBottom: 100, // 탭바와의 간격 유지
  },
  columnWrapper: {
    justifyContent: 'space-between', // 양옆 여백 균등
    marginBottom: 15,
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
  cartButtonWrapper: {
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#F4F4F4',
    padding: '1.5%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartButton: {
    padding: 3,
  },
  cartImage: {
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
  searchButton: {
    marginLeft: '2%',
    padding: '2%',
  },
  searchIcon: {
    width: 21,
    height: 21,
  },
  sections: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: '1%',
  },
  sectionButton: {
    paddingVertical: '1%',
  },
  sectionText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultContainer: {
    flex: 1,
    margin: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#DCDCDC',
  },
  column: {
    justifyContent: 'space-between',
  },
  imgRectangle: {
    flex: 1,
    backgroundColor: '#EBEBEB',
    borderRadius: 15, // 카드 모서리 둥글게
    overflow: 'hidden',
    margin: 10, // 카드 간 간격
    height: 250, // 카드 높이 조정
  },
  productImage: {
    width: '100%',
    height: '70%', // 이미지가 카드의 70%를 차지하도록 조정
    resizeMode: 'cover', // 이미지 비율 유지하며 꽉 채우기
  },
  bottomRectangle: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    height: 80,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    padding: 8,
  },
  textContainer: {
    backgroundColor: '#fff',
    padding: 10,
    height: '30%', // 텍스트 영역이 카드의 30% 차지
    justifyContent: 'center', // 텍스트가 중앙에 오도록 정렬
  },
  brandAndPrice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: '#000',
  },
  brandName: {
    fontWeight: 'bold',
  },
  clothName: {
    marginTop: '1%',
    color: '#000',
  },
  Size: {
    color: '#000',
  },
  writeButton: {
    position: 'absolute',
    bottom: '12%',
    right: '0.5%',
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
  sizeContainer: {
    flexDirection: 'row', // 사이즈와 이름을 가로로 정렬
    justifyContent: 'space-between', // 두 텍스트를 양끝에 배치
    alignItems: 'center', // 수직 가운데 정렬
  },
});

export default Comment;