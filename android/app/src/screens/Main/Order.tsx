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
import {RootStackParamList} from '../../../../../App';
import {StackNavigationProp} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';
import PostcodeComponent from './PostcodeComponent';
import {AR_URL, AUCTION_URL, DATA_URL} from '../../Constant.ts';
import path from 'path';
import {useUser} from '../UserContext.tsx';
import {reqPost} from '../../utills/Request.ts';

type OrderNavigationProp = StackNavigationProp<RootStackParamList, 'Order'>;
type OrderRouteProp = RouteProp<RootStackParamList, 'Order'>;
const screenWidth = Dimensions.get('window').width;

// 금액 포맷 함수
const formatPrice = (price: number) => {
  return price.toLocaleString('ko-KR') + '원';
};

interface PitTopInfo {
  itemHeight?: number;
  itemShoulder?: number;
  itemChest?: number;
  itemSleeve?: number;
}

interface PitBottomInfo {
  itemHeight?: number;
  frontrise?: number;
  itemWaists?: number;
  itemhipWidth?: number;
  itemThighs?: number;
  itemHemWidth?: number;
}

interface CartItem {
  itemKey: number;
  userEmail: string;
  itemImgName: string;
  itemName: string;
  itemSize: string;
  itemType: string;
  itemPrice: number;
  pitStatus: boolean;
  pitPrice: number | null;
  qty: number;
  pitTopInfo?: PitTopInfo | null;
  pitBottomInfo?: PitBottomInfo | null;
}

const Order = () => {
  const navigation = useNavigation<OrderNavigationProp>();
  const route = useRoute<OrderRouteProp>();
  const {Orderdata} = route.params || {};
  const {userEmail} = useUser();
  const [isPostcodeVisible, setIsPostcodeVisible] = useState(false);
  const [postcode, setPostcode] = useState('');
  const [address, setAddress] = useState('');
  const [addressDetail, setAddressDetail] = useState('');
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [buyerName, setBuyerName] = useState('');
  const [buyerTel, setBuyerTel] = useState('');

  useEffect(() => {
    const initialQuantities: Record<number, number> = {};
    Orderdata.forEach(item => {
      initialQuantities[item.itemKey] = item.qty;
    });
    setQuantities(initialQuantities);
  }, [Orderdata]);

  // TODO: 장바구니 에서 온경우 장바구니 키값으로
  // 바로 구매에서 온 경우는 그냥 itemKey로
  // 중복 제품 구매 시 수량이 같이 바뀌는 문제가 있을 수 있음
  const handleQuantityChange = (itemKey: number, delta: number) => {
    setQuantities(prevQuantities => ({
      ...prevQuantities,
      [itemKey]: Math.max((prevQuantities[itemKey] || 1) + delta, 1),
    }));
  };

  // 상품 금액 계산
  const totalProductPrice = Orderdata.reduce((total, item) => {
    const quantity = quantities[item.itemKey] || 1;
    return total + item.itemPrice * quantity; // 상품 가격만 합산
  }, 0);

  // 수선 비용 계산
  const totalTailorCost = Orderdata.reduce((total, item) => {
    const quantity = quantities[item.itemKey] || 1;
    if (item.pitStatus && item.pitPrice !== null) {
      return total + item.pitPrice * quantity; // 수선된 제품에 대해 수선비 추가
    }
    return total;
  }, 0);

  // 배송비
  const shippingCost = 2000;

  // 총 결제 금액
  const totalAmount = totalProductPrice + totalTailorCost + shippingCost;

  const formattedTotalProductPrice = formatPrice(totalProductPrice); // 상품 금액
  const formattedTotalTailorCost = formatPrice(totalTailorCost); // 수선 금액
  const formattedShippingCost = formatPrice(shippingCost); // 배송비
  const formattedTotalAmount = formatPrice(totalAmount); // 총 결제 금액

  const handleAddressSelected = (data: any) => {
    setPostcode(data.zonecode);
    setAddress(data.address);
    setAddressDetail(data.addressdetail);
    setIsPostcodeVisible(false);
  };
  const handlePayment = async (item: CartItem) => {
    const quantity = quantities[item.itemKey] || item.qty;

    const data = {
      pg: 'direct_payment', // 결제방식 직접 처리
      pay_method: 'card', // 결제 방식 (카드 등)
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
      // 카카오 결제 API 요청 부분 주석 처리
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
              'SECRET_KEY DEV5BCEBFA4ED006CF1EA64F2466AE8D2F6343B8', // 카카오페이 비밀키
          },
          body: JSON.stringify({
            cid: 'TC0ONETIME',
            partner_order_id: data.merchant_uid,
            partner_user_id: userEmail,
            item_name: data.name,
            quantity: quantity,
            total_amount: data.amount,
            tax_free_amount: 0,

            // 리다이렉트 처리 제거
            approval_url: `${AR_URL}payment/approval`,
            cancel_url: `${AR_URL}payment/cancel`,
            fail_url: `${AR_URL}payment/fail`,
          }),
        },
      );
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
              navigation.reset({
                index: 1,
                routes: [{name: 'Main'}, {name: 'OrderComplete'}],
              });
            })
            .catch(e => {
              console.error('결제 요청 중 오류 발생:', e);
              Alert.alert('결제 실패', '주문 등록에 실패했습니다.');
            });
        } else if (param.state === 'cancel') {
          Alert.alert('결제 실패', '주문을 취소했습니다.');
        } else {
          Alert.alert('결제 실패', '카카오 페이 결제를 실패하였습니다.');
        }
        Linking.removeAllListeners('url');
      });

      Linking.openURL(result.next_redirect_mobile_url).catch(() => {
        Alert.alert('결제 실패', '결제 페이지를 열 수 없습니다.');
      });

      navigation.reset({
        index: 1,
        routes: [{name: 'Main'}, {name: 'OrderComplete'}],
      });
    } catch (error) {
      console.error('결제 요청 중 오류 발생:', error);
      Alert.alert('결제 실패', '결제 요청 중 오류가 발생했습니다.');
    }
  };

  const postOrder = async () => {
    try {
      // 주문 항목들 준비
      const orderItems = Orderdata.map(item => {
        const pitStatus = item.pitStatus;
        let pitItemOrder = null;

        if (pitStatus) {
          // 수선 정보가 있을 경우
          if (item.itemType === '상의' && item.pitTopInfo) {
            // 상의 정보가 있을 때
            pitItemOrder = {
              itemType: '상의',
              itemSize: item.itemSize,
              itemHeight: item.pitTopInfo.itemHeight,
              itemShoulder: item.pitTopInfo.itemShoulder,
              itemChest: item.pitTopInfo.itemChest,
              itemSleeve: item.pitTopInfo.itemSleeve,
              pitPrice: item.pitPrice,
            };
          } else if (item.itemType === '하의' && item.pitBottomInfo) {
            // 하의 정보가 있을 때
            pitItemOrder = {
              itemType: '하의',
              itemSize: item.itemSize,
              itemHeight: item.pitBottomInfo.itemHeight,
              frontrise: item.pitBottomInfo.frontrise,
              itemWaists: item.pitBottomInfo.itemWaists,
              itemhipWidth: item.pitBottomInfo.itemhipWidth,
              itemThighs: item.pitBottomInfo.itemThighs,
              itemHemWidth: item.pitBottomInfo.itemHemWidth,
              pitPrice: item.pitPrice,
            };
          }
        }

        return {
          itemKey: item.itemKey,
          itemName: item.itemName,
          itemSize: item.itemSize,
          itemPrice: item.itemPrice,
          qty: item.qty,
          pitStatus: pitStatus,
          pitPrice: item.pitPrice, // 수선 비용, 수선이 없으면 null
          pitItemOrder: pitItemOrder,
        };
      });

      // API 요청 본문
      const orderBody = {
        userEmail: userEmail,
        userName: buyerName,
        userAddr: address,
        userAddrDetail: addressDetail,
        userNumber: buyerTel,
        itemTotal: totalAmount,
        pitPrice: totalTailorCost,
        items: orderItems, // 수정된 items 리스트 추가
      };

      // API 호출: 주문 정보 전송
      const response = await reqPost(
        path.join(DATA_URL, 'api', 'order', 'post_order'),
        orderBody,
      );

      // 수선 경매 업체들 웹소켓에 전달 (속도 문제로 비동기 호출)
      reqPost(path.join(AUCTION_URL, 'weborder'), orderBody)
        .then(() => {
          console.log('경매 전달 완료');
        })
        .catch(e => console.log(`경매 전달 실패: ${e}`));

      if (response.message === '주문 등록 완료.') {
        console.log('주문이 성공적으로 등록되었습니다.');
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('주문 등록 중 오류 발생:', error);
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
        <TextInput
          style={styles.input}
          value={addressDetail}
          placeholder="상세 주소"
          onChangeText={setAddressDetail}
        />
        <Text style={styles.sectionTitle2}>전화번호</Text>
        <TextInput
          style={styles.input}
          placeholder="010-1111-2222"
          value={buyerTel}
          onChangeText={setBuyerTel}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle3}>상품정보</Text>
        {Orderdata.map((item, index) => (
          <View key={index} style={styles.itemContainer}>
            {/* 수선된 제품 라벨 */}
            {item.pitStatus && (
              <Text style={styles.alteredLabel}>수선 요청</Text>
            )}
            {/* 제품 정보 */}
            <View style={styles.itemInfo}>
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
                    ).toLocaleString()}{' '}
                    원
                  </Text>
                </View>
              </View>
            </View>
            {item.pitStatus && (
              <View style={styles.subTextContainer}>
                <Text style={styles.subText}>수선한 사이즈</Text>
                <View style={styles.sizeTable}>
                  <View style={[styles.sizeColumn, styles.mColumn2]}>
                    <Text style={styles.sizeText}>{item.itemSize}</Text>
                  </View>

                  {/* 상의 */}
                  {item.pitTopInfo && (
                    <>
                      <View style={[styles.sizeColumn, styles.mColumn]}>
                        <Text style={styles.sizeText}>
                          {item.pitTopInfo.itemHeight}
                        </Text>
                      </View>
                      <View style={[styles.sizeColumn, styles.mColumn]}>
                        <Text style={styles.sizeText}>
                          {item.pitTopInfo.itemShoulder}
                        </Text>
                      </View>
                      <View style={[styles.sizeColumn, styles.mColumn]}>
                        <Text style={styles.sizeText}>
                          {item.pitTopInfo.itemChest}
                        </Text>
                      </View>
                      <View style={[styles.sizeColumn, styles.mColumn]}>
                        <Text style={styles.sizeText}>
                          {item.pitTopInfo.itemSleeve}
                        </Text>
                      </View>
                    </>
                  )}

                  {/* 하의 */}
                  {item.pitBottomInfo && (
                    <>
                      <View style={[styles.sizeColumn, styles.mColumn]}>
                        <Text style={styles.sizeText}>
                          {item.pitBottomInfo.itemHeight}
                        </Text>
                      </View>
                      <View style={[styles.sizeColumn, styles.mColumn]}>
                        <Text style={styles.sizeText}>
                          {item.pitBottomInfo.frontrise}
                        </Text>
                      </View>
                      <View style={[styles.sizeColumn, styles.mColumn]}>
                        <Text style={styles.sizeText}>
                          {item.pitBottomInfo.itemWaists}
                        </Text>
                      </View>
                      <View style={[styles.sizeColumn, styles.mColumn]}>
                        <Text style={styles.sizeText}>
                          {item.pitBottomInfo.itemhipWidth}
                        </Text>
                      </View>
                      <View style={[styles.sizeColumn, styles.mColumn]}>
                        <Text style={styles.sizeText}>
                          {item.pitBottomInfo.itemThighs}
                        </Text>
                      </View>
                      <View style={[styles.sizeColumn, styles.mColumn]}>
                        <Text style={styles.sizeText}>
                          {item.pitBottomInfo.itemHemWidth}
                        </Text>
                      </View>
                    </>
                  )}
                </View>
                {item.pitStatus && item.pitPrice !== null && (
                  <Text style={styles.subText2}>
                    수선 비용 : {formatPrice(item.pitPrice)}
                  </Text>
                )}
              </View>
            )}
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.totalAmountContainer}>
          <Text style={styles.totalAmountLabel}>결제 금액</Text>
          <Text style={styles.totalAmountValue}>{formattedTotalAmount}</Text>
        </View>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>상품 금액</Text>
          <Text style={styles.totalValue}>{formattedTotalProductPrice}</Text>
        </View>

        {/* 수선 금액이 있을 때만 보여짐 */}
        {totalTailorCost > 0 && (
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>예상 수선 금액</Text>
            <Text style={styles.totalValue}>{formattedTotalTailorCost}</Text>
          </View>
        )}

        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>배송비</Text>
          <Text style={styles.totalValue}>{formattedShippingCost}</Text>
        </View>

        {/* 결제 버튼 */}
        <TouchableOpacity
          style={styles.payButton}
          onPress={() => {
            if (Orderdata.length === 0) {
              Alert.alert('장바구니가 비어 있습니다.');
              return;
            }
            handlePayment(Orderdata[0]);
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
  sectionTitle3: {
    fontSize: 20,
    color: '#000',
    fontWeight: 'bold',
    marginBottom: -3,
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
  subTextContainer: {
    flexDirection: 'column',
    marginRight: 10,
    marginBottom: 10,
  },
  sizeTable: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    marginBottom: 15,
    marginLeft: 20,
    width: '92%',
  },
  subText: {
    fontSize: 16,
    color: '#787878',
    fontWeight: 'bold',
    marginBottom: 15,
    marginLeft: 20,
    marginTop: 15,
  },
  subText2: {
    fontSize: 16,
    color: '#787878',
    fontWeight: 'bold',
    marginLeft: 20,
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
    backgroundColor: '#fff',
    borderWidth: 0.9,
    borderColor: '#ddd',
  },
  mColumn2: {
    backgroundColor: '#ddd',
    borderWidth: 0.9,
    borderColor: '#ddd',
  },
  itemContainer: {
    paddingVertical: 20,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginVertical: 5,
  },
  itemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    bottom: 5,
  },
  alteredLabel: {
    fontSize: 17,
    color: '#2D3FE3',
    fontWeight: 'bold',
    marginBottom: 12,
    marginLeft: 15,
  },
});

export default Order;
