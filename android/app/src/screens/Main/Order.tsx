import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import {RootStackParamList} from '../../../../../App';
import {StackNavigationProp} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';
import PostcodeComponent from './PostcodeComponent';
import {DATA_URL} from '../../Constant.ts';
import path from 'path';
import {reqGet} from '../../utills/Request.ts';
import {useUser} from '../UserContext.tsx';

type OrderNavigationProp = StackNavigationProp<
  RootStackParamList,
  'BasicInformation'
>;

const screenWidth = Dimensions.get('window').width;

// 금액 포맷 함수
const formatPrice = (price: number) => {
  return price.toLocaleString('ko-KR') + '원';
};

interface CartItem {
  itemKey: number;
  userEmail: string;
  itemName: string;
  itemSize: string;
  itemType: string;
  itemPrice: number;
  pit: number;
}

const Order = () => {
  const navigation = useNavigation<OrderNavigationProp>();
  const {userEmail} = useUser(); // userEmail 가져오기
  const [cartItems, setCartItems] = useState<CartItem[]>([]); // cartItems 상태 추가
  const [isChecked, setIsChecked] = useState(true);
  const [isPostcodeVisible, setIsPostcodeVisible] = useState(false);
  const [postcode, setPostcode] = useState('');
  const [address, setAddress] = useState('');
  const [quantities, setQuantities] = useState<Record<number, number>>({});

  const fetchCartItems = async () => {
    try {
      if (userEmail) {
        const response: CartItem[] = await reqGet(
          path.join(DATA_URL, 'api', 'cart', 'get-store', userEmail),
        );
        if (response) {
          setCartItems(response);
        } else {
          console.error(`장바구니 항목을 가져오는데 실패했습니다`);
          setCartItems([]);
        }
      }
    } catch (error) {
      console.error('장바구니 항목을 가져오는 중 오류가 발생했습니다:', error);
      setCartItems([]);
    }
  };

  useEffect(() => {
    fetchCartItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleQuantityChange = (itemKey: number, delta: number) => {
    setQuantities(prevQuantities => ({
      ...prevQuantities,
      [itemKey]: Math.max((prevQuantities[itemKey] || 1) + delta, 1),
    }));
  };
  //총 가격 계산
  const totalPrice = cartItems.reduce((total, item) => {
    const quantity = quantities[item.itemKey] || 1;
    return total + item.itemPrice * quantity;
  }, 0);

  const formattedTotalPrice = formatPrice(totalPrice);

  const handleAddressSelected = (data: any) => {
    setPostcode(data.zonecode);
    setAddress(data.address);
    setIsPostcodeVisible(false);
  };

  const handlePayment = async (item: CartItem) => {
    const quantity = quantities[item.itemKey] || 1;
    const totalAmount = totalPrice + (isChecked ? 20000 : 0) + 2000; // 수선 비용
    try {
      const response = await fetch('https://kapi.kakao.com/v1/payment/ready', {
        method: 'POST',
        headers: {
          Authorization: 'KakaoAK 502625ee7d37c750f8771d99cf7b8cf9',
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
        body: `cid=TC0ONETIME&partner_order_id=${item.itemKey}&partner_user_id=${userEmail}&item_name=${item.itemName}&quantity=${quantity}&total_amount=${totalAmount}&vat_amount=200&tax_free_amount=0&approval_url=https://fit-pin.github.io/fitpin_frontend_web/success&fail_url=https://fit-pin.github.io/fitpin_frontend_web/fail&cancel_url=https://fit-pin.github.io/fitpin_frontend_web/cancel`,
      });

      if (response) {
        Alert.alert('카카오페이 결제', '결제 페이지로 이동합니다.');
        navigation.navigate('OrderComplete'); // 결제 완료 페이지로 이동
      } else {
        console.error(`결제 요청에 실패했습니다.`);
        Alert.alert('결제 실패', '결제 요청에 실패했습니다.');
      }
    } catch (error) {
      console.error('결제 요청 중 오류 발생:', error);
      Alert.alert('결제 실패', '결제 요청 중 오류가 발생했습니다.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>배송지</Text>
        <Text style={styles.sectionTitle2}>이름</Text>
        <TextInput style={styles.input} placeholder="" />
        <Text style={styles.sectionTitle2}>주소</Text>
        <View style={styles.inputWithButton}>
          <TextInput
            style={styles.inputWithButtonField}
            placeholder="우편번호"
            value={postcode}
            editable={false}
          />
          <TouchableOpacity
            style={styles.inputButton}
            onPress={() => setIsPostcodeVisible(true)}>
            <Text style={styles.inputButtonText}>주소찾기</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.input}
          placeholder="주소"
          value={address}
          editable={false}
        />
        <TextInput style={styles.input} placeholder="상세 주소" />
        <Text style={styles.sectionTitle2}>전화번호</Text>
        <TextInput style={styles.input} placeholder="010-1111-2222" />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>상품정보</Text>
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
                {' '}
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
                    {' '}
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
            <TouchableOpacity style={styles.removeButton}>
              <Text style={styles.removeButtonText}>X</Text>
            </TouchableOpacity>
          </View>
        ))}

        <View style={styles.separator} />

        <View style={styles.tailorContainer}>
          <View style={styles.tailorCheckBoxContainer}>
            <Text style={styles.tailorText}>수선해서 구매하기</Text>
            <CheckBox value={isChecked} onValueChange={setIsChecked} />
          </View>
          {isChecked && (
            <Text style={styles.tailorCost}>수선 비용 : 20,000원</Text>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.totalAmountContainer}>
          <Text style={styles.totalAmountLabel}>총 결제 금액</Text>
          <Text style={styles.totalAmountValue}>{formattedTotalPrice}</Text>
        </View>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>총 상품 금액</Text>
          <Text style={styles.totalValue}>{formattedTotalPrice}</Text>
        </View>
        {isChecked && (
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>총 예상 수선 금액</Text>
            <Text style={styles.totalValue}>20,000원</Text>
          </View>
        )}
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>배송비</Text>
          <Text style={styles.totalValue}>2,000원</Text>
        </View>
        <TouchableOpacity style={styles.payButton}>
          <View style={styles.payButtonContent}>
            <View style={styles.payButtonImageContainer}>
              <Image
                source={require('../../assets/img/main/payment.png')}
                style={styles.payButtonImage}
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                // 결제 처리 함수 호출
                if (cartItems.length === 0) {
                  Alert.alert('장바구니가 비어 있습니다.');
                  return;
                }
                handlePayment(cartItems[0]);
              }}>
              <Text style={styles.payButtonText}>결제하기</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>

      <PostcodeComponent
        isVisible={isPostcodeVisible}
        onClose={() => setIsPostcodeVisible(false)}
        onSelected={handleAddressSelected}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  section: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  sectionTitle: {
    fontSize: 20,
    color: '#000',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sectionTitle2: {
    fontSize: 15,
    color: '#000',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#8e8e8e',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 10,
  },
  inputWithButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#8e8e8e',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
  inputWithButtonField: {
    flex: 1,
    height: 40,
    paddingLeft: 10,
  },
  inputButton: {
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: '#d9d9d9',
    borderRadius: 2,
    marginRight: 5,
  },
  inputButtonText: {
    color: '#000',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#fff',
    marginVertical: 5,
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 10,
  },
  imageContainer: {
    width: screenWidth * 0.3,
    height: screenWidth * 0.4,
    backgroundColor: '#f4f4f4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
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
    fontSize: 17,
    color: '#000',
    fontWeight: 'bold',
    marginLeft: 25,
  },
  tailorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
    marginBottom: 10,
  },
  tailorCheckBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tailorText: {
    fontSize: 16,
    color: '#2D3FE3',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  tailorCost: {
    fontSize: 15,
    color: '#787878',
    marginTop: 60,
  },
  removeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 10,
  },
  removeButtonText: {
    color: '#787878',
  },
  totalAmountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    marginBottom: 5,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  totalLabel: {
    fontSize: 15,
    color: '#cecece',
    marginLeft: 14,
  },
  totalValue: {
    fontSize: 15,
    color: '#cecece',
    marginRight: 14,
  },
  totalAmountLabel: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 14,
  },
  totalAmountValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3FE3',
    marginRight: 14,
  },
  payButton: {
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
    margin: 16,
  },
  payButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  payButtonImageContainer: {
    width: screenWidth * 0.05,
    height: screenWidth * 0.05,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 3,
    marginRight: 3,
  },
  payButtonImage: {
    width: '180%',
    height: '180%',
    resizeMode: 'contain',
  },
  payButtonText: {
    fontSize: screenWidth * 0.05,
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default Order;
