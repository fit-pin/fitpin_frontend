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
import {PERMISSIONS, request} from 'react-native-permissions';

type MainScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

interface Product {
  itemKey: number;
  itemName: string;
  itemBrand: string;
  itemPrice: number;
  itemImgNames: string[];
  itemStyle: string;
  averageBmi: number | null;
}

const CameraBubble = () => {
  const [visible, setVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    const showTimer = setTimeout(() => {
      setVisible(true);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();

      const hideTimer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 100,
            duration: 500,
            useNativeDriver: true,
          }),
        ]).start(() => setVisible(false));
      }, 4000);

      return () => clearTimeout(hideTimer);
    }, 3000);

    return () => clearTimeout(showTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return visible ? (
    <Animated.View
      style={[
        styles.bubble,
        {
          opacity: fadeAnim,
          transform: [{translateX: slideAnim}],
        },
      ]}>
      <Text style={styles.bubbleText}>카메라로 측정해 보세요!</Text>
      <View style={styles.triangle} />
    </Animated.View>
  ) : null;
};

const sections: string[] = ['상의', '하의', '아우터', '정장'];
const boxes: {text: string; image: any; recommended: boolean; key: string}[] = [
  {
    text: '스트릿 \nStreet',
    key: '스트릿',
    image: require('../../assets/img/main/style/street.png'),
    recommended: false,
  },
  {
    text: '캐주얼 \nCasual',
    key: '캐주얼',
    image: require('../../assets/img/main/style/casual.png'),
    recommended: false,
  },
  {
    text: '빈티지 \nVintage',
    key: '빈티지',
    image: require('../../assets/img/main/style/vintage.png'),
    recommended: false,
  },
  {
    text: '레트로 \nRetro',
    key: '레트로',
    image: require('../../assets/img/main/style/retro.png'),
    recommended: false,
  },
  {
    text: '프레피 \nPreppy',
    key: '프레피',
    image: require('../../assets/img/main/style/preppy.png'),
    recommended: false,
  },
  {
    text: '페미닌 \nFeminine',
    key: '페미닌',
    image: require('../../assets/img/main/style/feminine.png'),
    recommended: false,
  },
  {
    text: '에슬레저 \nAthleisure',
    key: '에슬레저',
    image: require('../../assets/img/main/style/athleisure.png'),
    recommended: false,
  },
  {
    text: '테일러 \nTailor',
    key: '테일러',
    image: require('../../assets/img/main/style/tailor.png'),
    recommended: false,
  },
  {
    text: '아메카지 \nAmekaji',
    key: '아메카지',
    image: require('../../assets/img/main/style/amekaji.png'),
    recommended: false,
  },
];

const ProductCard: React.FC<{
  title: string;
  description: string;
  price: string;
  itemKey: number;
  image: any;
  brand: string;
}> = ({title, description, price, image, brand, itemKey}) => {
  const navigation = useNavigation<MainScreenNavigationProp>();
  return (
    <View style={styles.productCardContainer}>
      <View style={styles.topRectangle}>
        <Text style={styles.brandText}>{brand}</Text>
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate('ProductPage', {itemkey: itemKey})}>
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
          duration: 1000, // 깜빡이는 속도를 느리게 (1초)
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 1000, // 깜빡이는 속도를 느리게 (1초)
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
  const [userStyles, setUserStyles] = useState<
    Array<{text: string; image: any; recommended: boolean; key: string}>
  >([]); // 스타일 상태 이름을 변경
  const {userEmail, userName, userHeight, userWeight} = useUser();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedSection, setSelectedSection] = useState('상의');
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);

  useEffect(() => {
    // 알림 권한 요청
    request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS).then(result => {
      console.log(result);
    });
  }, []);

  //사용자 스타일 테마 가지고 오기
  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const response = await reqGet(
          path.join(DATA_URL, 'api', 'GetUserPreferStyle', `${userEmail}`),
        );
        // eslint-disable-next-line @typescript-eslint/no-shadow
        const userStyles = response.map(
          (item: {preferStyle: any}) => item.preferStyle,
        );

        const reboxes = boxes.filter(box => userStyles.includes(box.key));

        const rn = Math.floor(Math.random() * reboxes.length); // reboxes 배열의 길이에 맞춰 랜덤 인덱스를 생성

        reboxes.forEach(box => {
          box.recommended = false;
        });

        if (reboxes.length > 0) {
          reboxes[rn].recommended = true;
        }
        setUserStyles(reboxes); // userStyles로 상태 설정
      } catch (error) {
        console.error('Error fetching user body info:', error);
      }
    };
    fetchInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navigation = useNavigation<MainScreenNavigationProp>();

  useEffect(() => {
    const handleBackPress = () => {
      if (navigation.isFocused()) {
        Alert.alert('종료', '앱을 종료하시겠습니까?', [
          {text: '아니오', onPress: () => null, style: 'cancel'},
          {
            text: '예',
            onPress: () => BackHandler.exitApp(),
          },
        ]);
        return true;
      }
      return false;
    };

    BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () =>
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
  }, [navigation]);

  // 제품 바꿀때 마다 상품정보 갱신
  useEffect(() => {
    // 상품 아이템들 띄우는 함수
    (async () => {
      try {
        const response: Product[] = await reqGet(
          path.join(DATA_URL, 'api', 'items', 'list', selectedSection),
        );

        let res = response;
        if (selectedStyle) {
          const myBMI = userWeight / ((userHeight / 100) * (userHeight / 100));
          res = response
            .filter(item => item.itemStyle === selectedStyle)
            // 제품 구매자들의 평균 BMI 지수와 내 지수를 비교하여 내 BMI와 가장 유사한 제품을 상단으로
            .sort((a, b) => {
              const aBmi = Math.abs(myBMI - (a.averageBmi || 0));
              const bBmi = Math.abs(myBMI - (b.averageBmi || 0));
              return aBmi - bBmi;
            });
        }

        setProducts(res);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSection, selectedStyle]);

  const renderProductGrid = () => {
    if (products.length > 0) {
      return (
        <View style={styles.productGrid}>
          {products.map(product => (
            <ProductCard
              key={product.itemKey}
              title={product.itemName}
              itemKey={product.itemKey}
              description={product.itemBrand}
              price={product.itemPrice.toString()}
              image={{
                uri: path.join(
                  DATA_URL,
                  'api',
                  'img',
                  'imgserve',
                  'itemimg',
                  `${product.itemImgNames[0]}`,
                ),
              }}
              brand={product.itemBrand}
            />
          ))}
        </View>
      );
    } else {
      return (
        <View style={styles.noProductsView}>
          <Text style={styles.noProductsText}>제품이 없습니다.</Text>
        </View>
      );
    }
  };

  const onSelectItemStyle = async (itemStyle: string) => {
    const itemStyleSelected = itemStyle.split('\n')[0].trim();

    if (selectedStyle === itemStyleSelected) {
      // 스타일 선택 해제 시, 초기 '상의' 상태로
      setSelectedStyle(null);
    } else {
      setSelectedStyle(itemStyleSelected);
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
            <View style={styles.relativePosition}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => navigation.navigate('CameraBodyPhoto')}>
                <Image
                  source={require('../../assets/img/main/camera.png')}
                  style={styles.icon}
                />
              </TouchableOpacity>
              <CameraBubble />
            </View>
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
          {userStyles.length ? (
            userStyles.slice(0, 4).map((box, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.roundedBox,
                  selectedStyle === box.key && {
                    borderColor: '#444',
                    borderWidth: 1.5,
                  },
                ]}
                onPress={() => onSelectItemStyle(box.text)}>
                {box.recommended && <BlinkingText>추천</BlinkingText>}
                <View style={styles.boxContent}>
                  <Text style={styles.boxText}>{box.text}</Text>
                  <Image source={box.image} style={styles.boxImage} />
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <></>
          )}
        </View>
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
    height: 92,
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
    flexShrink: 0,
    fontWeight: 'bold',
    left: '5%',
  },
  boxImage: {
    width: '55%',
    height: '235%',
    flexShrink: 0,
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
    marginTop: 15,
    paddingHorizontal: '4%',
    marginBottom: 100,
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
  },
  priceText: {
    fontSize: 13,
    color: '#0000ff',
    flexShrink: 1,
    bottom: 10,
  },
  productDescription: {
    fontSize: 14,
    color: '#3D3D3D',
  },
  productTextContainer: {
    height: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  leftText: {
    display: 'flex',
    flexShrink: 1,
    flexDirection: 'column',
  },
  relativePosition: {
    position: 'relative',
  },
  bubble: {
    position: 'absolute',
    top: 6,
    right: 60,
    backgroundColor: '#3B82F6',
    paddingVertical: 5, // 위아래 여백
    paddingHorizontal: 1, // 좌우 여백을 충분히 줌
    width: 150,
    borderRadius: 5,
    flexDirection: 'row', // 가로로 배치
    justifyContent: 'center', // 가로 중앙 정렬
    alignItems: 'center', // 세로 중앙 정렬
  },
  bubbleText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  triangle: {
    width: 0,
    height: 0,
    borderTopWidth: 10,
    borderTopColor: 'transparent',
    borderBottomWidth: 10,
    borderBottomColor: 'transparent',
    borderLeftWidth: 12,
    borderLeftColor: '#3B82F6',
    position: 'absolute',
    right: -13,
    top: '23%',
  },
  noProductsText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  noProductsView: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Main;
