import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import BottomTabNavigator from '../Navigation/BottomTabNavigator';

const Search = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>무엇을</Text>
          <Text style={styles.headerText2}>찾고 계신가요?</Text>
        </View>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="검색어를 입력하세요"
            placeholderTextColor="#999"
          />
          <Image
            source={require('../../assets/img/search/search.png')}
            style={styles.icon}
          />
        </View>
        <Text style={styles.recenttext}>최근 검색어</Text>
        <View style={styles.recentSearchContainer}>
          <TouchableOpacity>
            <View style={styles.searchItem}>
              <Text style={styles.recenttext2}>랄프 로렌 셔츠</Text>
              <Image
                source={require('../../assets/img/search/x.png')}
                style={styles.icon2}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={styles.searchItem}>
              <Text style={styles.recenttext2}>체크 셔츠</Text>
              <Image
                source={require('../../assets/img/search/x.png')}
                style={styles.icon2}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={styles.searchItem}>
              <Text style={styles.recenttext2}>데님 바지</Text>
              <Image
                source={require('../../assets/img/search/x.png')}
                style={styles.icon2}
              />
            </View>
          </TouchableOpacity>
        </View>
        <Text style={styles.recommendtext}>추천 검색어</Text>
        <View style={styles.recommendedSearchContainer}>
          <TouchableOpacity style={styles.recommendItem}>
            <Text style={styles.recommendtext2}>#랄프 로렌 셔츠</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.recommendItem}>
            <Text style={styles.recommendtext2}>#체크 셔츠</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.recommendItem}>
            <Text style={styles.recommendtext2}>#데님 바지</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.headerText3}>검색 결과를 보여드릴게요</Text>
        <View style={styles.resultContainer}>
          <View style={styles.imgRectangle}>
            <Image
              source={require('../../assets/img/main/top/top1.png')}
              style={styles.productImage}
            />
          </View>
          <View style={styles.bottomRectangle}>
            <View style={styles.textContainer}>
              <View style={styles.brandAndPrice}>
                <Text style={[styles.text, styles.brandName]}>브랜드명</Text>
                <Text style={styles.price}>219.000₩</Text>
              </View>
              <Text style={[styles.text, styles.clothName]}>옷 이름</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <View>
        <BottomTabNavigator />
      </View>
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
  recenttext2: {
    color: '#000',
  },
  recentSearchContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: '3%',
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
    marginTop: '1%',
    marginBottom: '3%',
    color: '#000',
    paddingHorizontal: '5%',
  },
  recommendtext2: {
    color: '#000',
  },
  recommendedSearchContainer: {
    paddingHorizontal: '5%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: '3%',
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
    marginTop: '6%',
    paddingHorizontal: '5%',
  },
  imgRectangle: {
    position: 'relative',
    backgroundColor: '#EBEBEB',
    alignItems: 'center',
    justifyContent: 'center',
    height: 250,
    borderRadius: 15,
    zIndex: 1,
    marginTop: '-3%',
  },
  productImage: {
    width: '50%',
    height: '90%',
    resizeMode: 'cover',
  },
  bottomRectangle: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    height: 80,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderWidth: 1,
    borderColor: '#DCDCDC',
    marginTop: '-3%',
    padding: 8,
  },
  textContainer: {
    flex: 1,
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
  price: {
    color: '#0000ff',
  },
});

export default Search;
