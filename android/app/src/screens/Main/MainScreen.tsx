import React, {useEffect, useRef, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Animated,
  TouchableOpacity,
  BackHandler,
  Alert,
} from 'react-native';
import BottomTabNavigator from '../Navigation/BottomTabNavigator';
import {RootStackParamList} from '../../../../../App';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {DATA_URL} from '../../Constant';
import {reqGet} from '../../utills/Request';
import path from 'path';
import {useUser} from '../UserContext';

type MainScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

const sections: string[] = ['상의', '하의', '아우터', '정장'];
const boxes: {text: string; image: any; recommended: boolean}[] = [
  {
    text: '스트릿 \nStreet',
    image: require('../../assets/img/main/style/street.png'),
    recommended: false,
  },
  {
    text: '캐주얼 \nCasual',
    image: require('../../assets/img/main/style/casual.png'),
    recommended: false,
  },
  {
    text: '빈티지 \nVintage',
    image: require('../../assets/img/main/style/vintage.png'),
    recommended: false,
  },
  {
    text: '레트로 \nRetro',
    image: require('../../assets/img/main/style/retro.png'),
    recommended: false,
  },
  {
    text: '프레피 \nPreppy',
    image: require('../../assets/img/main/style/preppy.png'),
    recommended: false,
  },
  {
    text: '페미닌 \nFeminine',
    image: require('../../assets/img/main/style/feminine.png'),
    recommended: false,
  },
  {
    text: '에슬레저 \nAthleisure',
    image: require('../../assets/img/main/style/athleisure.png'),
    recommended: false,
  },
  {
    text: '테일러 \nTailor',
    image: require('../../assets/img/main/style/tailor.png'),
    recommended: false,
  },
  {
    text: '아메카지 \nAmekaji',
    image: require('../../assets/img/main/style/amekaji.png'),
    recommended: false,
  },
];

const ProductCard: React.FC<{
  title: string;
  description: string;
  price: string;
  image: any;
  brand: string;
}> = ({title, description, price, image, brand}) => {
  const navigation = useNavigation<MainScreenNavigationProp>();
  return (
    <View style={styles.productCardContainer}>
      <View style={styles.topRectangle}>
        <Text style={styles.brandText}>{brand}</Text>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('ProductPage')}>
        <View style={styles.middleRectangle}>
          <Image source={image} style={styles.productImage} />
        </View>
      </TouchableOpacity>
      <View style={styles.bottomRectangle}>
        <View style={styles.productTextContainer}>
          <View style={styles.leftText}>
            <Text style={styles.productTitle}>{title}</Text>
            <Text style={styles.productDescription}>{description}</Text>
          </View>
          <Text style={styles.priceText}>{price}</Text>
        </View>
      </View>
    </View>
  );
};

const BlinkingText: React.FC<{children: React.ReactNode}> = ({children}) => {
  const opacity = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const blink = () => {
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => blink());
    };
    blink();
  }, [opacity]);

  return (
    <Animated.Text style={[styles.recommendText, {opacity}]}>
      {children}
    </Animated.Text>
  );
};

const Main: React.FC = () => {
  const [oneStyle, setoneStyle] = useState('1');
  const [twoStyle, settwoStyle] = useState('2');
  const [thrStyle, setthrStyle] = useState('3');
  const [fouStyle, setfouStyle] = useState('4');
  const {userEmail, userName} = useUser();

  const koreanTexts = boxes.map(box => {
    const koreanText = box.text.match(/[\u3131-\uD79D]+/g)?.join(' ') || '';
    return koreanText;
  });

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const response = await reqGet(
          path.join(DATA_URL, 'api', 'GetUserPreferStyle', `${userEmail}`),
        );
        setoneStyle(response[0].preferStyle);
        settwoStyle(response[1].preferStyle);
        setthrStyle(response[2].preferStyle);
        setfouStyle(response[3].preferStyle);
      } catch (error) {
        console.error('Error fetching user body info:', error);
      }
    };
    fetchInfo();
  }, [userEmail]);

  const styleArray = [oneStyle, twoStyle, thrStyle, fouStyle];

  const reboxes = [];
  const rn = Math.floor(Math.random() * 3 + 0);
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 9; j++) {
      if (styleArray[i] === koreanTexts[j]) {
        reboxes.push(boxes[j]);
      }
    }
  }

  if (reboxes.length === 4) {
    for (let i = 0; i < 4; i++) {
      if (i === rn) {
        reboxes[i].recommended = true;
      } else {
        reboxes[i].recommended = false;
      }
    }
  }

  const navigation = useNavigation<MainScreenNavigationProp>();
  const [selectedSection, setSelectedSection] = useState('상의');
  const [showProductGrid, setShowProductGrid] = useState(true);

  useEffect(() => {
    const backAction = () => {
      Alert.alert('종료', '앱을 종료하시겠습니까?', [
        {text: '아니오', onPress: () => null, style: 'cancel'},
        {text: '예', onPress: () => BackHandler.exitApp()},
      ]);
      return true;
    };

    const handleBackPress = () => {
      if (navigation.isFocused()) {
        return backAction();
      }
      return false;
    };

    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, [navigation]);

  const products = [
    {
      title: '폴로 랄프',
      description: '데님 셔츠',
      price: '219.000₩',
      image: require('../../assets/img/main/top/top1.png'),
      brand: 'Musinsa',
    },
    {
      title: '에스이오',
      description: '럭비 저지 탑',
      price: '168.000₩',
      image: require('../../assets/img/main/top/top2.png'),
      brand: 'Ably',
    },
    {
      title: '디파이클럽',
      description: '긴팔 티셔츠',
      price: '419.000₩',
      image: require('../../assets/img/main/top/top3.png'),
      brand: 'Eql',
    },
    {
      title: '슬로우애시드',
      description: '스웨트 셔츠',
      price: '519.000₩',
      image: require('../../assets/img/main/top/top4.png'),
      brand: 'Musinsa',
    },
  ];
  const bottomProducts = [
    {
      title: '위캔더스',
      description: '데님 팬츠',
      price: '198,000₩',
      image: require('../../assets/img/main/bottom/bottom1.png'),
      brand: 'Musinsa',
    },
    {
      title: '위캔더스',
      description: '카모 팬츠',
      price: '129.000₩',
      image: require('../../assets/img/main/bottom/bottom2.png'),
      brand: 'Musinsa',
    },
  ];

  const outerProducts = [
    {
      title: '아노트',
      description: '윈드브레이커',
      price: '98.000₩',
      image: require('../../assets/img/main/outer/outer1.png'),
      brand: 'Height',
    },
    {
      title: '코드그라피',
      description: '후드집업',
      price: '69.900₩',
      image: require('../../assets/img/main/outer/outer2.png'),
      brand: 'Height',
    },
  ];

  const suitproducts = [
    {
      title: '코어',
      description: '블레이저',
      price: '108.000₩',
      image: require('../../assets/img/main/suit/suit1.png'),
      brand: 'Height',
    },
    {
      title: '폴로 랄프',
      description: '수트 자켓',
      price: '138.000₩',
      image: require('../../assets/img/main/suit/suit2.png'),
      brand: 'Musinsa',
    },
  ];

  const renderProductGrid = () => {
    let productsToShow: any[] = [];
    if (selectedSection === '상의') {
      productsToShow = products;
    } else if (selectedSection === '하의') {
      productsToShow = bottomProducts;
    } else if (selectedSection === '아우터') {
      productsToShow = outerProducts;
    } else if (selectedSection === '정장') {
      productsToShow = suitproducts;
    }

    if (showProductGrid) {
      return (
        <View style={styles.productGrid}>
          {productsToShow.map((product, index) => (
            <ProductCard
              key={index}
              title={product.title}
              description={product.description}
              price={product.price}
              image={product.image}
              brand={product.brand}
            />
          ))}
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerText}>FitPin</Text>
            <Text style={styles.headerTextName}>{userName}님</Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate('CameraBodyPhoto')}>
              <Image
                source={require('../../assets/img/main/camera.png')}
                style={styles.icon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate('Cart')}>
              <Image
                source={require('../../assets/img/main/shop.png')}
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.line} />
        <Text style={styles.subtitle}>
          회원님의 체형과 취향 모두를 만족하는 옷이에요
        </Text>
        <View style={styles.sections}>
          {reboxes.slice(0, 4).map((box, index) => (
            <View key={index} style={styles.roundedBox}>
              {box.recommended && <BlinkingText>추천</BlinkingText>}
              <View style={styles.boxContent}>
                <Text style={styles.boxText}>{box.text}</Text>
                <Image source={box.image} style={styles.boxImage} />
              </View>
            </View>
          ))}
        </View>
        <View style={styles.sections}>
          {sections.map(section => (
            <TouchableOpacity
              key={section}
              style={styles.sectionButton}
              onPress={() => {
                setSelectedSection(section);
                setShowProductGrid(true);
              }}>
              <Text
                style={[
                  styles.sectionText,
                  {
                    color: selectedSection === section ? '#000' : '#919191',
                  },
                ]}>
                {section}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {renderProductGrid()}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: '4%',
    paddingHorizontal: '4%',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  headerTextName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#9e9898',
  },
  headerIcons: {
    flexDirection: 'row',
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
  line: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: '2%',
  },
  subtitle: {
    fontSize: 17,
    color: '#000',
    marginTop: '2%',
    marginBottom: '4%',
    fontWeight: 'bold',
    paddingHorizontal: '4%',
  },
  sections: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    paddingHorizontal: '4%',
  },
  sectionButton: {
    padding: 8,
    paddingHorizontal: '4%',
  },
  sectionText: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
  },
  roundedBox: {
    width: '49%',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    padding: '7.5%',
    marginBottom: '3%',
    alignItems: 'center',
    position: 'relative',
    paddingHorizontal: '3%',
  },
  boxContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '1%',
  },
  boxText: {
    fontSize: 14,
    color: '#000',
    flex: 1,
    fontWeight: 'bold',
    left: '5%',
  },
  boxImage: {
    width: '55%',
    height: '235%',
    resizeMode: 'contain',
    left: '25%',
  },
  recommendText: {
    fontSize: 12,
    color: '#1A16FF',
    fontWeight: 'bold',
    position: 'absolute',
    top: '16%',
    left: '8%',
    zIndex: 1,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: '5%',
    paddingHorizontal: '4%',
    marginBottom: '10%',
  },
  productCardContainer: {
    width: '48%',
    backgroundColor: '#fff',
    marginBottom: '2%',
  },
  topRectangle: {
    position: 'relative',
    backgroundColor: '#000',
    height: '12%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  middleRectangle: {
    position: 'relative',
    backgroundColor: '#EBEBEB',
    alignItems: 'center',
    justifyContent: 'center',
    height: 170,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    zIndex: 1,
  },
  bottomRectangle: {
    position: 'relative',
    height: 80,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DCDCDC',
    bottom: 10,
  },
  brandText: {
    position: 'relative',
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    left: '7%',
    bottom: '-15%',
  },
  productImage: {
    width: '80%',
    height: '100%',
    resizeMode: 'contain',
    top: -4,
  },
  productTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
    bottom: -20,
  },
  priceText: {
    fontSize: 13,
    color: '#0000ff',
    bottom: -11,
    left: 3.5,
  },
  productDescription: {
    fontSize: 14,
    color: '#3D3D3D',
    bottom: -22,
  },
  productTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  leftText: {
    flex: 1,
  },
});

export default Main;
