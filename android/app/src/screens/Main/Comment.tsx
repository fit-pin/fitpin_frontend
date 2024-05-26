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

  const sections: string[] = ['상의', '하의', '아우터', '원피스'];

  const products: Product[] = [
    {
      brand: '브랜드명1',
      name: '옷 이름1',
      price: '219,000₩',
      image: require('../../assets/img/main/top/top1.png'),
    },
    {
      brand: '브랜드명2',
      name: '옷 이름2',
      price: '199,000₩',
      image: require('../../assets/img/main/top/top1.png'),
    },
    {
      brand: '브랜드명3',
      name: '옷 이름3',
      price: '189,000₩',
      image: require('../../assets/img/main/top/top1.png'),
    },
    {
      brand: '브랜드명4',
      name: '옷 이름4',
      price: '299,000₩',
      image: require('../../assets/img/main/top/top1.png'),
    },
    {
      brand: '브랜드명5',
      name: '옷 이름5',
      price: '259,000₩',
      image: require('../../assets/img/main/top/top1.png'),
    },
    {
      brand: '브랜드명6',
      name: '옷 이름6',
      price: '279,000₩',
      image: require('../../assets/img/main/top/top1.png'),
    },
  ];

  const renderHeader = () => (
    <>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.platformName}>옷에 대한 정보를 공유해요</Text>
        <View style={styles.cartButtonWrapper}>
          <TouchableOpacity style={styles.cartButton}>
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
      <View style={styles.imgRectangle}>
        <Image source={item.image} style={styles.productImage} />
      </View>
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
