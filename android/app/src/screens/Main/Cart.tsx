import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {RootStackParamList} from '../../../../../App.tsx';
import {DATA_URL} from '../../Constant.ts';
import path from 'path';
import {reqGet} from '../../utills/Request.ts';
import {useUser} from '../UserContext.tsx';

const screenWidth = Dimensions.get('window').width;

interface PitItemCart {
  itemKey: number;
  cartKey: number;
  itemType: string;
  itemSize: string;
  itemHeight?: number;
  itemShoulder?: number;
  itemChest?: number;
  itemSleeve?: number;
  frontrise?: number;
  itemWaists?: number;
  itemhipWidth?: number;
  itemThighs?: number;
  itemHemWidth?: number;
}

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
  cartKey: number;
  userEmail: string;
  itemImgName: string;
  itemName: string;
  itemSize: string;
  itemType: string;
  itemPrice: number;
  pitStatus: boolean;
  pitPrice: number | null;
  qty: number;
  pitItemCart: PitItemCart | null;
  pitTopInfo?: PitTopInfo | null;
  pitBottomInfo?: PitBottomInfo | null;
}

const Cart = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const {userEmail} = useUser();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const fetchCartItems = async () => {
    try {
      const response: CartItem[] = await reqGet(
        path.join(DATA_URL, 'api', 'cart', 'get-store', userEmail),
      );

      if (Array.isArray(response)) {
        setCartItems(response);
        console.log('Fetched cart items:', response);
      } else {
        console.error('장바구니에 담긴 상품이 없습니다:', response);
        setCartItems([]);
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

  const deleteCartItem = async (cartKey: number) => {
    try {
      const response = await fetch(
        `http://fitpitback.kro.kr:8080/api/cart/delete/${cartKey}`,
        {
          method: 'DELETE',
        },
      );

      if (response.ok) {
        console.log(
          `Item with cartKey ${cartKey} successfully deleted from cart`,
        );
        setCartItems(prevItems =>
          prevItems.filter(item => item.cartKey !== cartKey),
        );
      } else {
        const errorData = await response.json();
        console.error('Failed to delete item:', errorData.message);
      }
    } catch (error) {
      console.error('장바구니 항목을 삭제하는 중 오류가 발생했습니다:', error);
    }
  };

  const confirmDelete = (cartKey: number) => {
    Alert.alert(
      '삭제',
      '이 제품을 장바구니에서 삭제하시겠습니까?',
      [
        {
          text: '아니오',
          style: 'cancel',
        },
        {
          text: '예',
          onPress: () => deleteCartItem(cartKey),
        },
      ],
      {cancelable: true},
    );
  };

  const [quantities, setQuantities] = useState<Record<number, number>>({});

  useEffect(() => {
    const initialQuantities: Record<number, number> = {};
    cartItems.forEach(item => {
      initialQuantities[item.cartKey] = item.qty;
    });
    setQuantities(initialQuantities);
  }, [cartItems]);

  const handleQuantityChange = (cartKey: number, delta: number) => {
    setQuantities(prevQuantities => ({
      ...prevQuantities,
      [cartKey]: Math.max((prevQuantities[cartKey] || 1) + delta, 1),
    }));
  };
  const totalPrice = cartItems.reduce((total, item) => {
    const quantity = quantities[item.cartKey] || 1;
    const itemTotal = item.itemPrice * quantity;
    const alterationCost = item.pitStatus && item.pitPrice ? item.pitPrice : 0;
    return total + itemTotal + alterationCost;
  }, 0);

  const handleOrder = () => {
    const Orderdata = cartItems.map((item, index) => ({
      itemKey: item.itemKey,
      userEmail: item.userEmail,
      itemImgName: item.itemImgName,
      itemName: item.itemName,
      itemSize: item.itemSize,
      itemType: item.itemType,
      itemPrice: item.itemPrice,
      pitPrice: item.pitStatus ? item.pitPrice : null,
      pit: index,
      qty: quantities[item.cartKey] || item.qty,
      pitStatus: item.pitStatus,
      pitTopInfo:
        item.pitStatus && item.pitItemCart?.itemType === '상의'
          ? {
              itemHeight: item.pitItemCart?.itemHeight,
              itemShoulder: item.pitItemCart?.itemShoulder,
              itemChest: item.pitItemCart?.itemChest,
              itemSleeve: item.pitItemCart?.itemSleeve,
            }
          : null,
      pitBottomInfo:
        item.pitStatus && item.pitItemCart?.itemType === '하의'
          ? {
              itemHeight: item.pitItemCart?.itemHeight,
              frontrise: item.pitItemCart?.frontrise,
              itemWaists: item.pitItemCart?.itemWaists,
              itemhipWidth: item.pitItemCart?.itemhipWidth,
              itemThighs: item.pitItemCart?.itemThighs,
              itemHemWidth: item.pitItemCart?.itemHemWidth,
            }
          : null,
    }));

    navigation.navigate('Order', {Orderdata});
  };

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
          cartItems.map((item, index) => (
            <View key={index} style={styles.itemContainer}>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => confirmDelete(item.cartKey)}>
                <Text style={styles.deleteButtonText}>X</Text>
              </TouchableOpacity>
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
                    수량 : {quantities[item.cartKey] || item.qty}
                  </Text>

                  <View style={styles.quantityAndPrice}>
                    <View style={styles.quantityControl}>
                      <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => handleQuantityChange(item.cartKey, -1)}>
                        <Text style={styles.quantityButtonText}>-</Text>
                      </TouchableOpacity>
                      <Text style={styles.itemQuantityText}>
                        {quantities[item.cartKey] || item.qty}
                      </Text>
                      <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => handleQuantityChange(item.cartKey, 1)}>
                        <Text style={styles.quantityButtonText}>+</Text>
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.itemPrice}>
                      {(
                        item.itemPrice * (quantities[item.cartKey] || item.qty)
                      ).toLocaleString()}{' '}
                      원
                    </Text>
                  </View>
                </View>
              </View>

              {/* 수선한 사이즈 */}
              {item.pitStatus && item.pitItemCart && (
                <View style={styles.subTextContainer}>
                  <Text style={styles.subText}>수선한 사이즈</Text>
                  <View style={styles.sizeTable}>
                    <View style={[styles.sizeColumn, styles.mColumn2]}>
                      <Text style={styles.sizeText}>{item.itemSize}</Text>
                    </View>
                    <View style={[styles.sizeColumn, styles.mColumn]}>
                      <Text style={styles.sizeText}>
                        {item.pitItemCart.itemHeight}
                      </Text>
                    </View>
                    {item.pitItemCart.itemType === '상의' ? (
                      <>
                        <View style={[styles.sizeColumn, styles.mColumn]}>
                          <Text style={styles.sizeText}>
                            {item.pitItemCart.itemShoulder}
                          </Text>
                        </View>
                        <View style={[styles.sizeColumn, styles.mColumn]}>
                          <Text style={styles.sizeText}>
                            {item.pitItemCart.itemChest}
                          </Text>
                        </View>
                        <View style={[styles.sizeColumn, styles.mColumn]}>
                          <Text style={styles.sizeText}>
                            {item.pitItemCart.itemSleeve}
                          </Text>
                        </View>
                      </>
                    ) : (
                      <>
                        <View style={[styles.sizeColumn, styles.mColumn]}>
                          <Text style={styles.sizeText}>
                            {item.pitItemCart.frontrise}
                          </Text>
                        </View>
                        <View style={[styles.sizeColumn, styles.mColumn]}>
                          <Text style={styles.sizeText}>
                            {item.pitItemCart.itemWaists}
                          </Text>
                        </View>
                        <View style={[styles.sizeColumn, styles.mColumn]}>
                          <Text style={styles.sizeText}>
                            {item.pitItemCart.itemhipWidth}
                          </Text>
                        </View>
                        <View style={[styles.sizeColumn, styles.mColumn]}>
                          <Text style={styles.sizeText}>
                            {item.pitItemCart.itemThighs}
                          </Text>
                        </View>
                        <View style={[styles.sizeColumn, styles.mColumn]}>
                          <Text style={styles.sizeText}>
                            {item.pitItemCart.itemHemWidth}
                          </Text>
                        </View>
                      </>
                    )}
                  </View>
                  <Text style={styles.subText2}>
                    수선 비용 :{' '}
                    {item.pitPrice ? item.pitPrice.toLocaleString() : '0'}원
                  </Text>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>

      {cartItems.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.footerTextContainer}>
            <Text style={styles.footerText}>예상 결제 금액</Text>
            <Text style={styles.footerPrice}>
              {totalPrice.toLocaleString()}원
            </Text>
          </View>
          <TouchableOpacity style={styles.orderButton} onPress={handleOrder}>
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
  itemContainer: {
    paddingVertical: 16,
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
    marginTop: 2,
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
    marginTop: 20,
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
  alteredLabel: {
    fontSize: 17,
    color: '#2D3FE3',
    fontWeight: 'bold',
    marginBottom: 12,
    marginLeft: 15,
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 20,
    zIndex: 1,
  },
  deleteButtonText: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
  },
});

export default Cart;
