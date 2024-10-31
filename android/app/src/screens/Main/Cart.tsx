import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {RootStackParamList} from '../../../../../App.tsx';
import {DATA_URL} from '../../Constant.ts';
import path from 'path';
import {reqGet} from '../../utills/Request.ts';
import {useUser} from '../UserContext.tsx';

const screenWidth = Dimensions.get('window').width;

interface CartItem {
  itemKey: number;
  userEmail: string;
  itemImgName: string;
  itemName: string;
  itemSize: string;
  itemType: string;
  itemPrice: number;
  pit: number;
  qty: number;
}

const Cart = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const {userEmail} = useUser();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const fetchCartItems = async () => {
    try {
      // 어차피 userEmail 없으면 알아서 예외 발생되어 아래 catch 문 실행
      const response: CartItem[] = await reqGet(
        path.join(DATA_URL, 'api', 'cart', 'get-store', userEmail),
      );

      if (Array.isArray(response)) {
        setCartItems(response);
        console.log('Fetched cart items:', response); // 여기서 응답을 확인
      } else {
        console.error('장바구니에 담긴 상품이 없습니다:', response);
        setCartItems([]); // 잘못된 형식의 응답 시 빈 배열로 초기화
      }
    } catch (error) {
      console.error('장바구니 항목을 가져오는 중 오류가 발생했습니다:', error);
      setCartItems([]); // 오류 발생 시 빈 배열로 초기화
    }
  };

  useEffect(() => {
    fetchCartItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 각 아이템의 수량과 가격을 관리하기 위한 상태
  const [quantities, setQuantities] = useState<Record<number, number>>({});

  useEffect(() => {
    const initialQuantities: Record<number, number> = {};
    cartItems.forEach(item => {
      initialQuantities[item.itemKey] = item.qty;
    });
    setQuantities(initialQuantities);
  }, [cartItems]);

  const handleQuantityChange = (itemKey: number, delta: number) => {
    setQuantities(prevQuantities => ({
      ...prevQuantities,
      [itemKey]: Math.max((prevQuantities[itemKey] || 1) + delta, 1),
    }));
  };

  // 총 가격 계산
  const totalPrice = cartItems.reduce((total, item) => {
    const quantity = quantities[item.itemKey] || 1;
    return total + item.itemPrice * quantity;
  }, 0);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        {cartItems.length === 0 ? (
          <View style={styles.emptyCartContainer}>
            <Text style={styles.emptyCartText}>
              장바구니에 담긴 상품이 없습니다
            </Text>
          </View>
        ) : (
          cartItems.map(item => (
            <View key={item.itemKey} style={styles.item}>
              <View style={styles.imageContainer}>
                <Image
                  source={{
                    uri: path.join(
                      DATA_URL,
                      'api',
                      'img',
                      'imgserve',
                      'itemimg',
                      item.itemImgName,
                    ),
                  }}
                  style={styles.itemImage}
                />
              </View>
              <View style={styles.itemDetails}>
                <Text style={styles.itemTitle}>{item.itemName}</Text>
                <Text style={styles.itemDescription}>{item.itemType}</Text>
                <Text style={styles.itemSize}>Size : {item.itemSize}</Text>
                <Text style={styles.itemQuantity}>
                  수량 : {quantities[item.itemKey] || item.qty}
                </Text>
                <View style={styles.quantityAndPrice}>
                  <View style={styles.quantityControl}>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => handleQuantityChange(item.itemKey, -1)}>
                      <Text style={styles.quantityButtonText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.itemQuantityText}>
                      {quantities[item.itemKey] || item.qty}
                    </Text>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => handleQuantityChange(item.itemKey, 1)}>
                      <Text style={styles.quantityButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.itemPrice}>
                    {(
                      item.itemPrice * (quantities[item.itemKey] || item.qty)
                    ).toLocaleString()}
                    원
                  </Text>
                </View>
              </View>
            </View>
          ))
        )}
        {/*         <View>
          <View style={styles.textContainer}>
            <Text style={styles.sectionTitle}>수선 ver</Text>
          </View>
          <View style={[styles.item, {borderBottomWidth: 0}]}>
            <View style={styles.imageContainer}>
              <Image
                source={require('../../assets/img/main/top/top1.png')}
                style={styles.itemImage}
              />
            </View>
            <View style={styles.itemDetails}>
              <Text style={styles.itemTitle}>폴로 랄프 로렌</Text>
              <Text style={styles.itemDescription}>데님 셔츠 - 블루</Text>
              <Text style={styles.itemSize}>Size : M</Text>
              <Text style={styles.itemQuantity}>수량 : 1</Text>
              <View style={styles.quantityAndPrice}>
                <View style={styles.quantityControl}>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => handleQuantityChange(0, -1)}>
                    <Text style={styles.quantityButtonText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.itemQuantityText}>1</Text>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => handleQuantityChange(0, 1)}>
                    <Text style={styles.quantityButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.itemPrice}>
                  {(20000).toLocaleString()}원
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.subTextContainer}>
            <Text style={styles.subText}>수선한 사이즈</Text>
            <View style={styles.sizeTable}>
              <View style={[styles.sizeColumn, styles.mColumn]}>
                <Text style={styles.sizeText}>M</Text>
              </View>
              <View style={[styles.sizeColumn, styles.borderColumn]}>
                <Text style={styles.sizeText}>50</Text>
              </View>
              <View style={[styles.sizeColumn, styles.borderColumn]}>
                <Text style={styles.sizeText}>50</Text>
              </View>
              <View style={[styles.sizeColumn, styles.borderColumn]}>
                <Text style={styles.sizeText}>50</Text>
              </View>
              <View style={[styles.sizeColumn, styles.borderColumn]}>
                <Text style={styles.sizeText}>50</Text>
              </View>
            </View>
            <Text style={styles.subText}>수선 비용 : 20,000원</Text>
          </View>
        </View> */}
      </ScrollView>
      {cartItems.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.footerTextContainer}>
            <Text style={styles.footerText}>예상 결제 금액</Text>
            <Text style={styles.footerPrice}>
              {totalPrice.toLocaleString()}원
            </Text>
          </View>
          <TouchableOpacity
            style={styles.orderButton}
            onPress={() => navigation.navigate('Order')}>
            <Text style={styles.orderButtonText}>주문하기</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flex: 1,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginVertical: 5,
  },
  textContainer: {
    position: 'absolute',
    top: 0,
    left: 16,
    zIndex: 1,
  },
  sectionTitle: {
    marginTop: 3,
    fontSize: 15,
    color: '#787878',
    fontWeight: 'bold',
    marginLeft: 7,
  },
  imageContainer: {
    width: screenWidth * 0.3,
    height: screenWidth * 0.4,
    backgroundColor: '#f4f4f4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    marginTop: 10,
    marginLeft: 10,
    borderRadius: 27,
  },
  itemImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  itemDetails: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 20,
    color: '#000',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemDescription: {
    fontSize: 15,
    color: '#494949',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemSize: {
    fontSize: 15,
    color: '#787878',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemQuantity: {
    fontSize: 15,
    color: '#8b8b8b',
    fontWeight: 'bold',
    marginBottom: 15,
  },
  quantityAndPrice: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    borderRadius: 12,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  quantityButton: {
    paddingVertical: 2,
    paddingHorizontal: 15,
  },
  quantityButtonText: {
    fontSize: 17,
    color: '#000',
    fontWeight: 'bold',
  },
  itemQuantityText: {
    fontSize: 17,
    marginHorizontal: 5,
    color: '#000',
    fontWeight: 'bold',
  },
  itemPrice: {
    fontSize: 20,
    color: '#000',
    fontWeight: 'bold',
    marginLeft: 15,
  },
  subTextContainer: {
    marginLeft: 16,
    marginBottom: 20,
  },
  subText: {
    fontSize: 16,
    color: '#787878',
    fontWeight: 'bold',
    marginBottom: 15,
  },
  sizeTable: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    width: 402,
  },
  sizeColumn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  sizeText: {
    fontSize: 14,
    color: '#000',
    fontWeight: 'bold',
  },
  mColumn: {
    backgroundColor: '#F4F4F4',
  },
  borderColumn: {
    borderWidth: 1,
    borderColor: '#F4F4F4',
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  footerTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  footerText: {
    fontSize: 22,
    color: '#000',
    fontWeight: 'bold',
  },
  footerPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3FE3',
  },
  orderButton: {
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
  },
  orderButtonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyCartText: {
    fontSize: 18,
    color: '#787878',
    fontWeight: 'bold',
  },
});

export default Cart;
