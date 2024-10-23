import React, {useEffect, useState} from 'react';
import {RouteProp, useRoute} from '@react-navigation/native';
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
  Linking,
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
import {reqPost} from '../../utills/Request.ts';

type OrderNavigationProp = StackNavigationProp<RootStackParamList, 'Order'>;
type OrderRouteProp = RouteProp<RootStackParamList, 'Order'>;
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
  const route = useRoute<OrderRouteProp>(); // route의 타입을 지정
  const {purchaseData} = route.params || {};
  const {userEmail} = useUser(); // userEmail 가져오기
  const [cartItems, setCartItems] = useState<CartItem[]>([]); // cartItems 상태 추가
  const [isChecked, setIsChecked] = useState(true);
  const [isPostcodeVisible, setIsPostcodeVisible] = useState(false);
  const [postcode, setPostcode] = useState('');
  const [address, setAddress] = useState('');
  const [quantities, setQuantities] = useState<Record<number, number>>({});

  //이름, 전화번호
  const [buyerName, setBuyerName] = useState('');
  const [buyerTel, setBuyerTel] = useState('');

  const fetchCartItems = async () => {
    if (!purchaseData) {
      // 바로 구매가 아닌 경우에만 장바구니 항목을 불러옵니다.
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
        console.error(
          '장바구니 항목을 가져오는 중 오류가 발생했습니다:',
          error,
        );
        setCartItems([]);
      }
    } else {
      // 바로 구매인 경우 purchaseData를 cartItems 배열에 넣어줍니다.
      setCartItems([purchaseData]);
    }
  };

  useEffect(() => {
    fetchCartItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [purchaseData]);

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

    const data = {
      pg: 'kakaopay', // 카카오페이
      pay_method: 'card', // 결제 방식
      merchant_uid: `mid_${new Date().getTime()}`, // 고유 주문번호
      name: item.itemName, // 상품 이름
      amount: totalAmount, // 총 결제 금액
      buyer_email: userEmail || 'example@example.com', // 구매자 이메일
      buyer_name: buyerName, // 구매자 이름
      buyer_tel: buyerTel, // 구매자 전화번호
      buyer_addr: address, // 배송지 주소
      buyer_postcode: postcode, // 우편번호
    };

    try {
      // 카카오 결제 API 변경 https://developers.kakaopay.com
      // 기존에 있던 API는 이제 지원 중단임
      const response = await fetch(
        path.join(
          'https://open-api.kakaopay.com',
          'online',
          'v1',
          'payment',
          'ready',
        ),
        {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            Authorization:
              'SECRET_KEY DEV5BCEBFA4ED006CF1EA64F2466AE8D2F6343B8',
          },
          body: JSON.stringify({
            cid: 'TC0ONETIME',
            partner_order_id: data.merchant_uid,
            partner_user_id: userEmail,
            item_name: data.name,
            quantity: quantity,
            total_amount: data.amount,
            tax_free_amount: 0,
            // 리다이렉트 처리는 AR 백엔드에 해놓음
            approval_url: 'http://dmumars.kro.kr/payment/approval',
            cancel_url: 'http://dmumars.kro.kr/payment/cancel',
            fail_url: 'http://dmumars.kro.kr/payment/fail',
          }),
        },
      );

      //next_redirect_app_url 값에 경우 백엔드에 요청이 가지 않아서 next_redirect_mobile_url로 요청함
      const result = (await response.json()) as {
        tid: string;
        next_redirect_app_url: string;
        next_redirect_mobile_url: string;
        next_redirect_pc_url: string;
        android_app_scheme: string;
        ios_app_scheme: string;
        created_at: Date;
      };

      Linking.addEventListener('url', res => {
        // 등록한 url에서 재대로 redirect 처리 된 경우 해당 callback 작동함
        const getParamLine = res.url.split('?')[1];
        const param: {
          state: string;
          pg_token: string;
        } = getParamLine.split('&').reduce((obj, i) => {
          const [k, v] = i.split('=');
          obj[k] = v;
          return obj;
        }, {} as any);

        console.log(`카카오 페이 응답: ${JSON.stringify(param)}`);

        if (param.state === 'approval') {
          postOrder()
            .then(() => {
              //TODO: 이제 결제 완료하고 웹 웹소켓 통신을 구현 해야...
              navigation.reset({
                index: 1,
                routes: [{name: 'Main'}, {name: 'OrderComplete'}],
              });
            })
            .catch(_ => {
              Alert.alert('결제 실패', '주문 등록에 실패했습니다.');
            });
        } else if (param.state === 'cancel') {
          Alert.alert('결제 실패', '주문을 취소했습니다.');
        } else {
          Alert.alert('결제 실패', '카카오 페이 결제를 실패하였습니다.');
        }
        // 중복 이벤트 발생 해결
        Linking.removeAllListeners('url');
      });

      Linking.openURL(result.next_redirect_mobile_url).catch(() => {
        Alert.alert('결제 실패', '결제 페이지를 열 수 없습니다.');
      });
    } catch (error) {
      console.error('결제 요청 중 오류 발생:', error);
      Alert.alert('결제 실패', '결제 요청 중 오류가 발생했습니다.');
    }
  };

  const postOrder = async () => {
    if (!cartItems.length) {
      console.error('장바구니가 비어 있습니다.');
      return;
    }

    if (userEmail) {
      const data = {
        itemKey: cartItems[0].itemKey, // 상품 키
        userKey: '186', // 회원 고유번호 (예: 회원 정보에서 가져옴)
        userName: buyerName, // 구매자 이름
        userAddr: address, // 배송지 주소
        userNumber: buyerTel, // 구매자 전화번호
        itemName: cartItems[0].itemName, // 상품명
        itemSize: cartItems[0].itemSize, // 상품 사이즈
        itemPrice: cartItems[0].itemPrice, // 상품 가격
        itemTotal: totalPrice, // 총 결제 금액
        pitPrice: isChecked ? 20000 : 0, // 맞춤비용 (선택 사항)
        pcs: quantities[cartItems[0].itemKey] || 1, // 상품 수량 (선택 사항)
      };

      // API 호출: 주문 정보 전송
      const response = await reqPost(
        path.join(DATA_URL, 'api', 'order', 'post_order'), // API URL
        data, // 전송할 데이터
      );

      if (response) {
        // 주문 완료 알림
        console.log('주문이 성공적으로 등록되었습니다.');
      } else {
        // 주문 실패 시 오류 출력
        console.error('주문 등록에 실패했습니다.');
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>배송지</Text>
        <Text style={styles.sectionTitle2}>이름</Text>
        <TextInput
          style={styles.input}
          placeholder=""
          value={buyerName}
          onChangeText={setBuyerName}
        />
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
        <TextInput
          style={styles.input}
          placeholder="010-1111-2222"
          value={buyerTel}
          onChangeText={setBuyerTel}
        />
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
        <TouchableOpacity
          style={styles.payButton}
          onPress={() => {
            // 결제 처리 함수 호출
            if (cartItems.length === 0) {
              Alert.alert('장바구니가 비어 있습니다.');
              return;
            }
            handlePayment(cartItems[0]);
          }}>
          <View style={styles.payButtonContent}>
            <View style={styles.payButtonImageContainer}>
              <Image
                source={require('../../assets/img/main/payment.png')}
                style={styles.payButtonImage}
              />
            </View>
            <Text style={styles.payButtonText}>결제하기</Text>
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
