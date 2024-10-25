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
import {RootStackParamList} from '../../../../../App';
import {StackNavigationProp} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';

type ProductPageoNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Search'
>;

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

// 검색 결과를 보여주는 함수 수정: 부분 일치 검색을 위해 filter 사용
const fetchSearchResults = async (searchWord: string): Promise<Item[]> => {
  try {
    const response: SearchResponse = await reqGet(
      path.join(DATA_URL, 'api', 'item-search', 'search', searchWord),
    );

    // 부분 일치 검색 구현
    const filteredResults = response.searchResult.filter(item =>
      item.itemName.includes(searchWord),
    );

    return filteredResults;
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
  const navigation = useNavigation<ProductPageoNavigationProp>();
  const [searchTerm, setSearchTerm] = useState<string>(''); // 사용자가 입력한 검색어
  const [results, setResults] = useState<Item[]>([]); // 검색 결과
  const [suggestions, setSuggestions] = useState<Item[]>([]); // 연관 검색어 제안
  const [recentSearches, setRecentSearches] = useState<Item[]>([]); // 최근 검색어
  const [recommendedSearches, setRecommendedSearches] = useState<string[]>([]); // 추천 검색어
  const [selectedRecommendation, setSelectedRecommendation] = useState<
    string | null
  >(null);
  const [isRecommendationSelected, setIsRecommendationSelected] =
    useState(false);

  useEffect(() => {
    // 추천 검색어
    const loadRecommendedSearches = async () => {
      const recommendations = await fetchRecommendedSearches();
      setRecommendedSearches(recommendations);
    };

    loadRecommendedSearches();
  }, []);

  const handleSearch = async (searchWord?: string) => {
    const term = searchWord || searchTerm;

    // 검색어가 비어 있을 경우 알림
    if (term.trim() === '') {
      Alert.alert('알림', '검색어를 입력하세요.');
      return;
    }

    const searchResults = await fetchSearchResults(term);

    // 검색 결과가 없을 경우 알림
    if (searchResults.length === 0) {
      Alert.alert('알림', '검색 결과가 없습니다.');
    }
    setResults(searchResults);

    // 검색 결과가 있으면 연관 검색어를 숨김
    setSuggestions([]);

    // 최근 검색어 중복 체크 후 추가
    const isAlreadySearched = recentSearches.some(
      item => item.itemName === term,
    );

    if (!isAlreadySearched) {
      setRecentSearches(prevSearches => [
        ...prevSearches,
        {
          itemKey: Date.now(),
          itemName: term,
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

    // 추천 검색어가 선택된 상태에서 다른 검색어 입력 시 선택 해제
    if (isRecommendationSelected) {
      setSelectedRecommendation(null);
      setIsRecommendationSelected(false);
    }
  };

  const handleRecommendClick = async (recommend: string) => {
    setSelectedRecommendation(recommend);
    setIsRecommendationSelected(true);
    setSearchTerm(recommend);
    await handleSearch(recommend);
  };

  const handleRecentClick = async (item: Item) => {
    setSearchTerm(item.itemName);
    await handleSearch(item.itemName);
  };

  // 선택된 연관 검색어로 검색 실행
  const handleSuggestionClick = (item: Item) => {
    setSearchTerm(item.itemName);
    setSuggestions([]); // 연관 검색어 리스트를 숨김
    handleSearch(item.itemName);
  };

  // 검색어 입력시 호출
  const handleInputChange = async (text: string) => {
    setSearchTerm(text);

    // 연관 검색어를 가져오는 로직 추가 필요
    const searchResults = await fetchSearchResults(text);
    setSuggestions(searchResults);
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
          onChangeText={handleInputChange}
        />
        <TouchableOpacity onPress={() => handleSearch()}>
          <Image
            source={require('../../assets/img/search/search.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>

      {/* 연관 검색어 리스트 */}
      {suggestions.length > 0 && (
        <FlatList
          data={suggestions}
          keyExtractor={item => item.itemKey.toString()}
          renderItem={({item}) => (
            <TouchableOpacity onPress={() => handleSuggestionClick(item)}>
              <View style={styles.suggestionItem}>
                <Text>{item.itemName}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      <Text style={styles.recenttext}>최근 검색어</Text>
      <FlatList
        data={recentSearches}
        keyExtractor={item => item.itemKey.toString()}
        renderItem={({item}) => (
          <TouchableOpacity onPress={() => handleRecentClick(item)}>
            <View style={styles.searchItem}>
              <Text>{item.itemName}</Text>
            </View>
          </TouchableOpacity>
        )}
        horizontal
        style={styles.recentSearchContainer}
        contentContainerStyle={styles.recentSearchContent}
      />

      <Text style={styles.recommendtext}>추천 검색어</Text>
      {/* View 태그 수정 */}
      <View style={styles.recommendedSearchWrapper}>
        <View style={styles.recommendedSearchContainer}>
          {recommendedSearches.map((item, i) => {
            return (
              <TouchableOpacity
                key={i}
                style={[
                  styles.recommendItem,
                  {
                    backgroundColor:
                      selectedRecommendation === item ? '#000' : '#fff',
                  },
                ]}
                onPress={() => handleRecommendClick(item)}>
                <Text
                  style={{
                    color: selectedRecommendation === item ? '#fff' : '#000',
                  }}>
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* 검색 결과 영역 */}
      <View style={styles.resultsWrapper}>
        <Text style={styles.headerText3}>검색 결과를 보여드릴게요</Text>
        <FlatList
          data={results}
          keyExtractor={item => item.itemKey.toString()}
          renderItem={({item}) => (
            <View style={styles.resultContainer}>
              <View style={styles.imgRectangle}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('ProductPage')}>
                  <Image
                    source={{
                      uri:
                        item.itemImgURL ||
                        'http://fitpitback.kro.kr:8080/api/img/imgserve/itemimg/optimize.png',
                    }}
                    style={styles.productImage}
                  />
                </TouchableOpacity>
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
          style={styles.scrollableResults}
        />
      </View>

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
    marginTop: '10%',
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
    maxHeight: 40,
  },
  recentSearchContent: {
    paddingLeft: '5%',
  },
  searchItem: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 20,
    marginRight: 10,
    borderColor: '#A69E9E',
    borderWidth: 1,
  },
  recommendtext: {
    fontSize: 15,
    marginTop: '10%',
    marginBottom: '3%',
    paddingHorizontal: '5%',
    color: '#000',
  },
  recommendedSearchWrapper: {
    marginBottom: '3%',
    paddingHorizontal: '5%',
  },
  recommendedSearchContainer: {
    flexDirection: 'row',
  },
  recommendedSearchContent: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
  },
  recommendItem: {
    marginRight: 10,
    display: 'flex',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#A69E9E',
  },
  resultContainer: {
    flexDirection: 'row',
    marginBottom: '5%',
    paddingHorizontal: '5%',
    marginTop: '4%',
  },
  imgRectangle: {
    width: 90,
    height: 90,
    backgroundColor: '#f2f2f2',
    borderRadius: 5,
    marginRight: '5%',
  },
  bottomRectangle: {
    flex: 1,
    justifyContent: 'center',
  },
  textContainer: {
    paddingVertical: '2%',
  },
  brandAndPrice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text: {
    fontSize: 15,
  },
  brandName: {
    fontWeight: 'bold',
    color: '#000',
  },
  price: {
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  clothName: {
    marginTop: '2%',
  },
  resultsWrapper: {
    flex: 1,
    marginTop: '5%',
  },
  scrollableResults: {
    flexGrow: 1,
  },
  resultContent: {
    paddingBottom: '10%',
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  suggestionItem: {
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    width: 350,
    marginLeft: 15,
  },
});

export default Search;
