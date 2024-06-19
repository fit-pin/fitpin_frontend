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
} from 'react-native';
import BottomTabNavigator from '../Navigation/BottomTabNavigator';
import {RootStackParamList} from '../../../../../App.tsx';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import { DATA_URL } from '../../Constant.ts';
import { reqGet } from '../../utills/Request.ts';
import path from 'path';

type MainScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

const sections: string[] = ['상의', '하의', '아우터', '원피스'];
const boxes: {text: string; image: any; recommended: boolean}[] = [
  {
    text: '스트릿 \nStreet',
    image: require('../../assets/img/main/style/street.png'),
    recommended: true,
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
}> = ({title, description, price, image}) => {
  const navigation = useNavigation<MainScreenNavigationProp>();
  return (
    <View style={styles.productCardContainer}>
      <View style={styles.topRectangle}>
        <Text style={styles.brandText}>Musinsa</Text>
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
  
  //회원 스타일을 저장하는 변수
  const [oneStyle, setoneStyle] = useState("1");
  const [twoStyle, settwoStyle] = useState("2");
  const [thrStyle, setthrStyle] = useState("3");
  const [fouStyle, setfouStyle] = useState("4");
  const [userEmail, setuserEmail] = useState("master@naver.com");

  //boxes배열에서 text의 value값만 저장
  const koreanTexts = boxes.map(box => {
    const koreanText = box.text.match(/[\u3131-\uD79D]+/g)?.join(' ') || '';
    return koreanText;
  });

  useEffect(() => {
    const fetchInfo = async() => {
      try {
        const response = await reqGet(path.join(DATA_URL, 'api', 'GetUserPreferStyle', `${userEmail}`));
        setoneStyle(response[0].preferStyle);
        settwoStyle(response[1].preferStyle);
        setthrStyle(response[2].preferStyle);
        setfouStyle(response[3].preferStyle);
      } catch (error) {
        console.error('Error fetching user body info:', error);
      }
    }
    fetchInfo();
  }, []);

  //회원 스타일을 임시적으로 저장할 변수
  const styleArray = [];
  styleArray.push(oneStyle,twoStyle,thrStyle,fouStyle);

  //받아온 정보를 저장할 변수
  const reboxes = [];
  let i,j;
  for(i = 0; i < 4; i++){
    for(j = 0; j < 9; j++){
      if(styleArray[i] == koreanTexts[j]){
        reboxes.push(boxes[j]);
      }
    }
  }

  const navigation = useNavigation<MainScreenNavigationProp>();
  const [selectedSection, setSelectedSection] = React.useState('상의');
  const [showProductGrid, setShowProductGrid] = React.useState(true);

  const products = [
    {
      title: '폴로 랄프',
      description: '데님 셔츠',
      price: '219.000₩',
      image: require('../../assets/img/main/top/top1.png'),
    },
    {
      title: '에스이오',
      description: '럭비 저지 탑',
      price: '168.000₩',
      image: require('../../assets/img/main/top/top2.png'),
    },
    {
      title: '폴로 랄프',
      description: '데님 셔츠',
      price: '419.000₩',
      image: require('../../assets/img/main/top/top2.png'),
    },
    {
      title: '폴로 랄프',
      description: '데님 셔츠',
      price: '519.000₩',
      image: require('../../assets/img/main/top/top2.png'),
    },
  ];
  const bottomProducts = [
    {
      title: '위캔더스',
      description: '데님 팬츠',
      price: '198,000₩',
      image: require('../../assets/img/main/bottom/bottom1.png'),
    },
    {
      title: '제품2',
      description: '하의 제품 설명',
      price: '129.000₩',
      image: require('../../assets/img/main/bottom/bottom1.png'),
    },
    {
      title: '제품3',
      description: '하의 제품 설명',
      price: '149.000₩',
      image: require('../../assets/img/main/bottom/bottom1.png'),
    },
  ];

  const renderProductGrid = () => {
    if (showProductGrid) {
      const productsToShow =
        selectedSection === '상의' ? products : bottomProducts;
      return (
        <View style={styles.productGrid}>
          {productsToShow.map((product, index) => (
            <ProductCard
              key={index}
              title={product.title}
              description={product.description}
              price={product.price}
              image={product.image}
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
          <Text style={styles.headerText}>FitPin</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate('CameraBodyPhoto')}>
              {/* 임시로 사이즈 페이지 보려고 size로 한거기에 카메라 부분 다 완성되면 onPress={() => navigation.navigate('Camera')}> */}
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
          000님의 체형과 취향 모두를 만족하는 옷이에요
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
    paddingHorizontal: '4%',
  },
  boxContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '1%',
  },
  boxText: {
    fontSize: 15,
    color: '#000',
    flex: 1,
    fontWeight: 'bold',
    left: '5%',
  },
  boxImage: {
    width: '55%',
    height: '245%',
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
    bottom: '-20%',
  },
  productImage: {
    width: '80%',
    height: '100%',
    resizeMode: 'contain',
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
