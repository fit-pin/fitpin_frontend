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
  ListRenderItem,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import BottomTabNavigator from '../Navigation/BottomTabNavigator';
import {RootStackParamList} from '../../../../../App';
import {StackNavigationProp} from '@react-navigation/stack';

type CommentNavigationProp = StackNavigationProp<RootStackParamList, 'Comment'>;

interface Product {
  brand: string;
  name: string;
  price: string;
  image: any;
}

const Comment: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState<string>('상의');
  const navigation = useNavigation<CommentNavigationProp>();

  const sections: string[] = ['상의', '하의', '아우터', '정장'];

  const products: Product[] = [
    {
      brand: '폴로 랄프',
      name: '데님 셔츠',
      price: '219,000₩',
      image: require('../../assets/img/main/top/top1.png'),
    },
    {
      brand: '에스이오',
      name: '럭비 저지 탑',
      price: '168,000₩',
      image: require('../../assets/img/main/top/top2.png'),
    },
    {
      brand: '위캔더스',
      name: '데님 팬츠',
      price: '198,000₩',
      image: require('../../assets/img/main/bottom/bottom1.png'),
    },
    {
      brand: '위캔더스',
      name: '카모 팬츠',
      price: '129,000₩',
      image: require('../../assets/img/main/bottom/bottom2.png'),
    },
    {
      brand: '아노트',
      name: '윈드브레이커',
      price: '98,000₩',
      image: require('../../assets/img/main/outer/outer1.png'),
    },
    {
      brand: '코드그라피',
      name: '후드집업',
      price: '69,900₩',
      image: require('../../assets/img/main/outer/outer2.png'),
    },
  ];

  const renderHeader = () => (
    <>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.platformName}>옷에 대한 정보를 공유해요</Text>
        <View style={styles.cartButtonWrapper}>
          <TouchableOpacity
            style={styles.cartButton}
            onPress={() => navigation.navigate('Cart')}>
            <Image
              source={require('../../assets/img/main/shop.png')}
              style={styles.cartImage}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="궁금한 옷 정보를 검색해보세요"
        />
        <TouchableOpacity style={styles.searchButton}>
          <Image
            source={require('../../assets/img/search/search.png')}
            style={styles.searchIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Sections */}
      <View style={styles.sections}>
        {sections.map(section => (
          <TouchableOpacity
            key={section}
            style={styles.sectionButton}
            onPress={() => setSelectedSection(section)}>
            <Text
              style={[
                styles.sectionText,
                // eslint-disable-next-line react-native/no-inline-styles
                {
                  color: selectedSection === section ? '#000' : '#919191',
                },
              ]}>
              {section}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );

  const renderItem: ListRenderItem<Product> = ({item}) => (
    <View style={styles.resultContainer}>
      <TouchableOpacity
        style={styles.imgRectangle}
        onPress={() => navigation.navigate('CommentReview')}>
        <Image source={item.image} style={styles.productImage} />
      </TouchableOpacity>
      <View style={styles.bottomRectangle}>
        <View style={styles.textContainer}>
          <View style={styles.brandAndPrice}>
            <Text style={[styles.text, styles.brandName]}>{item.brand}</Text>
            <Text style={styles.price}>{item.price}</Text>
          </View>
          <Text style={[styles.text, styles.clothName]}>{item.name}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        ListHeaderComponent={renderHeader}
        columnWrapperStyle={styles.column}
        contentContainerStyle={styles.contentContainer}
      />
      <TouchableOpacity
        style={styles.writeButton}
        onPress={() => navigation.navigate('WritePage')}>
        <Image
          source={require('../../assets/img/main/write.png')}
          style={styles.writeIcon}
        />
      </TouchableOpacity>
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
  },
  contentContainer: {
    paddingHorizontal: '2%',
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
    position: 'relative',
    backgroundColor: '#EBEBEB',
    alignItems: 'center',
    justifyContent: 'center',
    height: 170,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  productImage: {
    width: '65%',
    height: '90%',
    resizeMode: 'cover',
    top: 3,
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
  writeButton: {
    position: 'absolute',
    bottom: '12%',
    right: '0.5%',
  },
  writeIcon: {
    width: 60,
    height: 60,
  },
});

export default Comment;
