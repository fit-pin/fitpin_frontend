/* eslint-disable react-native/no-inline-styles */
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
  itemName: string;
  itemSize: string;
  itemType: string;
  itemPrice: number;
  pit: number;
}

const Cart = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const {userEmail} = useUser();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        if (userEmail) {
          // userEmail이 있는 경우
          const productRes = await reqGet(
            path.join(DATA_URL, 'api', 'cart', 'get-store', userEmail),
          );

          if (productRes.ok) {
            const data: CartItem[] = await productRes.json();
            setCartItems(data);
          } else {
            console.error('장바구니 항목을 가져오는 데 실패했습니다.');
          }
        }
      } catch (error) {
        console.error('장바구니 항목을 가져오는 중 오류가 발생했습니다.');
      }
    };

    fetchCartItems();
  }, [userEmail]);
  // 각 아이템의 수량과 가격을 관리하기 위한 상태
  const [quantities, setQuantities] = useState<Record<number, number>>({});

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
        {cartItems.map(item => (
          <View key={item.itemKey} style={styles.item}>
            <View style={styles.imageContainer}>
              <Image
                source={require('../../assets/img/main/top/top1.png')}
                style={styles.itemImage}
              />
            </View>
            <View style={styles.itemDetails}>
              <Text style={styles.itemTitle}>{item.itemName}</Text>
              <Text style={styles.itemDescription}>{item.itemType}</Text>
              <Text style={styles.itemSize}>Size : {item.itemSize}</Text>
              <Text style={styles.itemQuantity}>
                수량 : {quantities[item.itemKey] || 1}
              </Text>
              <View style={styles.quantityAndPrice}>
                <View style={styles.quantityControl}>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => handleQuantityChange(item.itemKey, -1)}>
                    <Text style={styles.quantityButtonText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.itemQuantityText}>
                    {quantities[item.itemKey] || 1}
                  </Text>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => handleQuantityChange(item.itemKey, 1)}>
                    <Text style={styles.quantityButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.itemPrice}>
                  {(
                    item.itemPrice * (quantities[item.itemKey] || 1)
                  ).toLocaleString()}
                  원
                </Text>
              </View>
            </View>
          </View>
        ))}
        <View>
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
            <Text style={styles.subText}>수선 비용 : 20,000원</Text>
          </View>
        </View>
      </ScrollView>
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
    fontSize: 15,
    color: '#787878',
    fontWeight: 'bold',
    marginBottom: 40,
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
});

export default Cart;
