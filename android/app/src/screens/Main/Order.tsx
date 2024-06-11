import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import {RootStackParamList} from '../../../../../App';
import {StackNavigationProp} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';

type OrderNavigationProp = StackNavigationProp<
  RootStackParamList,
  'BasicInformation'
>;

const screenWidth = Dimensions.get('window').width;

// 금액 포맷 함수
const formatPrice = (price: number) => {
  return price.toLocaleString('ko-KR') + '원';
};

const Order = () => {
  const navigation = useNavigation<OrderNavigationProp>();
  const [isChecked, setIsChecked] = useState(true);

  // 각 상품의 수량을 별도로 관리
  const [quantity1, setQuantity1] = useState(1);
  const [quantity2, setQuantity2] = useState(1);

  // 각 상품의 단가
  const price1 = 219000;
  const price2 = 219000;

  // 수량 증가 함수
  const increaseQuantity = (
    setQuantity: React.Dispatch<React.SetStateAction<number>>,
  ) => {
    setQuantity((prevQuantity: number) => prevQuantity + 1);
  };

  // 수량 감소 함수
  const decreaseQuantity = (
    setQuantity: React.Dispatch<React.SetStateAction<number>>,
  ) => {
    setQuantity((prevQuantity: number) =>
      prevQuantity > 1 ? prevQuantity - 1 : 1,
    ); // 최소값 1
  };

  // 총 금액 계산
  const totalPrice = quantity1 * price1 + quantity2 * price2;
  const formattedTotalPrice = formatPrice(totalPrice);

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
          />
          <TouchableOpacity style={styles.inputButton}>
            <Text style={styles.inputButtonText}>주소찾기</Text>
          </TouchableOpacity>
        </View>
        <TextInput style={styles.input} placeholder="주소" />
        <TextInput style={styles.input} placeholder="상세 주소" />
        <Text style={styles.sectionTitle2}>전화번호</Text>
        <TextInput style={styles.input} placeholder="010-1111-2222" />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>상품정보</Text>
        <View style={styles.item}>
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
            <Text style={styles.itemQuantity}>수량 : {quantity1}</Text>
            <View style={styles.quantityAndPrice}>
              <View style={styles.quantityControl}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => decreaseQuantity(setQuantity1)}>
                  <Text style={styles.quantityButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.itemQuantityText}>{quantity1}</Text>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => increaseQuantity(setQuantity1)}>
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.itemPrice}>
                {formatPrice(quantity1 * price1)}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.removeButton}>
            <Text style={styles.removeButtonText}>X</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.separator} />

        <View style={styles.item}>
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
            <Text style={styles.itemQuantity}>수량 : {quantity2}</Text>
            <View style={styles.quantityAndPrice}>
              <View style={styles.quantityControl}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => decreaseQuantity(setQuantity2)}>
                  <Text style={styles.quantityButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.itemQuantityText}>{quantity2}</Text>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => increaseQuantity(setQuantity2)}>
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.itemPrice}>
                {formatPrice(quantity2 * price2)}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.removeButton}>
            <Text style={styles.removeButtonText}>X</Text>
          </TouchableOpacity>
        </View>

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
              onPress={() => navigation.navigate('OrderComplete')}>
              <Text style={styles.payButtonText}>결제하기</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>
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
