import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
} from 'react-native';
import BottomTabNavigator from '../Navigation/BottomTabNavigator';
import {DATA_URL} from '../../Constant';
import {reqGet} from '../../utills/Request';
import path from 'path';

interface Item {
  itemKey: number;
  itemName: string;
  itemType: string;
  itemBrand: string;
  itemStyle: string;
  itemCnt: number;
  itemContent: string;
  itemPrice: number;
  itemDate: string;
  itemImgURL?: string;
}

interface SearchResponse {
  searchResult: Item[];
}

interface RecommendResponse {
  recommendations: string[];
}

const fetchSearchResults = async (searchWord: string): Promise<Item[]> => {
  try {
    const response: SearchResponse = await reqGet(
      path.join(DATA_URL, 'api', 'item-search', 'search', searchWord),
    );
    return response.searchResult;
  } catch (error) {
    console.error(error);
    return [];
  }
};

// 추천 검색어 API를 호출하는 함수
const fetchRecommendedSearches = async (): Promise<string[]> => {
  try {
    const response: RecommendResponse = await reqGet(
      path.join(DATA_URL, 'api', 'item-search', 'recommend'),
    );
    return response.recommendations;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const Search = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [results, setResults] = useState<Item[]>([]);
  const [recentSearches, setRecentSearches] = useState<Item[]>([]);
  const [recommendedSearches, setRecommendedSearches] = useState<string[]>([]);

  useEffect(() => {
    // 컴포넌트가 마운트될 때 추천 검색어를 불러옴
    const loadRecommendedSearches = async () => {
      const recommendations = await fetchRecommendedSearches();
      setRecommendedSearches(recommendations);
    };

    loadRecommendedSearches();
  }, []);

  const handleSearch = async () => {
    // 검색어가 비어 있을 경우 알림
    if (searchTerm.trim() === '') {
      Alert.alert('알림', '검색어를 입력하세요.');
      return;
    }
    const searchResults = await fetchSearchResults(searchTerm);
    // 검색 결과가 없을 경우 알림
    if (searchResults.length === 0) {
      Alert.alert('알림', '검색 결과가 없습니다.');
    }
    setResults(searchResults);

    // 최근 검색어 중복 체크 후 추가
    const isAlreadySearched = recentSearches.some(
      item => item.itemName === searchTerm,
    );

    if (!isAlreadySearched) {
      setRecentSearches(prevSearches => [
        ...prevSearches,
        {
          itemKey: Date.now(),
          itemName: searchTerm,
          itemType: '',
          itemBrand: '',
          itemStyle: '',
          itemCnt: 0,
          itemContent: '',
          itemPrice: 0,
          itemDate: '',
          itemImgURL: '',
        },
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>무엇을</Text>
        <Text style={styles.headerText2}>찾고 계신가요?</Text>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="검색어를 입력하세요"
          placeholderTextColor="#999"
          value={searchTerm}
          onChangeText={text => setSearchTerm(text)}
        />
        <TouchableOpacity onPress={handleSearch}>
          <Image
            source={require('../../assets/img/search/search.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.recenttext}>최근 검색어</Text>
      <FlatList
        data={recentSearches}
        keyExtractor={item => item.itemKey.toString()}
        renderItem={({item}) => (
          <View style={styles.searchItem}>
            <Text>{item.itemName}</Text>
          </View>
        )}
        horizontal
        style={styles.recentSearchContainer}
        contentContainerStyle={styles.recentSearchContent}
      />
      <Text style={styles.recommendtext}>추천 검색어</Text>
      <FlatList
        data={recommendedSearches}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <View style={styles.recommendItem}>
            <Text>{item}</Text>
          </View>
        )}
        horizontal
        style={styles.recommendedSearchContainer}
        contentContainerStyle={styles.recommendedSearchContent}
      />
      <Text style={styles.headerText3}>검색 결과를 보여드릴게요</Text>
      <FlatList
        data={results}
        keyExtractor={item => item.itemKey.toString()}
        renderItem={({item}) => (
          <View style={styles.resultContainer}>
            <View style={styles.imgRectangle}>
              <Image
                source={{
                  uri: 'http://fitpitback.kro.kr:8080/api/img/imgserve/itemimg/optimize.png',
                }}
                style={styles.productImage}
              />
            </View>
            <View style={styles.bottomRectangle}>
              <View style={styles.textContainer}>
                <View style={styles.brandAndPrice}>
                  <Text style={[styles.text, styles.brandName]}>
                    {item.itemBrand}
                  </Text>
                  <Text style={styles.price}>{item.itemPrice}₩</Text>
                </View>
                <Text style={[styles.text, styles.clothName]}>
                  {item.itemName}
                </Text>
              </View>
            </View>
          </View>
        )}
        contentContainerStyle={styles.resultContent}
      />
      <BottomTabNavigator />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: '1%',
  },
  headerContainer: {
    marginTop: '17%',
    paddingHorizontal: '6%',
  },
  headerText: {
    fontSize: 25,
    color: '#000',
  },
  headerText2: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#000',
  },
  headerText3: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#000',
    paddingHorizontal: '5%',
    marginTop: '-1%',
  },
  searchContainer: {
    marginTop: '3%',
    left: '3.2%',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    width: '82%',
    borderColor: '#ccc',
  },
  searchInput: {
    flex: 1,
    paddingVertical: '3%',
    fontSize: 17,
    color: '#000',
  },
  icon: {
    width: 20,
    height: 20,
    marginLeft: 8,
  },
  icon2: {
    width: 10,
    height: 10,
    marginLeft: 8,
  },
  recenttext: {
    fontSize: 15,
    marginTop: '5%',
    marginBottom: '3%',
    color: '#000',
    paddingHorizontal: '5%',
  },
  recentSearchContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: '3%',
  },
  recentSearchContent: {
    paddingHorizontal: '5%',
  },
  searchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 16,
    marginRight: 8,
    marginBottom: '3%',
  },
  recommendtext: {
    fontSize: 15,
    marginTop: '-3%',
    marginBottom: '3%',
    color: '#000',
    paddingHorizontal: '5%',
  },
  recommendedSearchContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: '3%',
  },
  recommendedSearchContent: {
    paddingHorizontal: '5%',
  },
  recommendItem: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 16,
    marginRight: 8,
    marginBottom: '3%',
  },
  resultContainer: {
    marginTop: '5%',
    paddingHorizontal: '5%',
  },
  resultContent: {
    paddingBottom: '5%',
  },
  imgRectangle: {
    position: 'relative',
    backgroundColor: '#EBEBEB',
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
    width: 380,
    borderRadius: 15,
    marginTop: '-1%',
  },
  productImage: {
    width: '60%',
    height: '80%',
    borderRadius: 15,
    marginTop: '-15%',
  },
  bottomRectangle: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    paddingHorizontal: 8,
    justifyContent: 'center',
    zIndex: 2,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    marginTop: '-3%',
  },
  brandAndPrice: {
    flexDirection: 'row',
  },
  text: {
    color: '#000',
    marginRight: 20,
  },
  brandName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 15,
    marginLeft: 20,
  },
  price: {
    fontSize: 16,
  },
  clothName: {
    fontSize: 16,
    color: '#999',
  },
});

export default Search;
