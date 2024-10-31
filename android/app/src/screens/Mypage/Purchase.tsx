/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import {DATA_URL} from '../../Constant.ts';
import path from 'path';
import {reqGet} from '../../utills/Request.ts';
import {useUser} from '../UserContext.tsx';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

type Order = {
  itemKey: number;
  userEmail: string;
  optional: string;
  itemImg: string;
  itemSize: string;
  itemPrice: number;
  itemTotal: number;
  qty: number;
  pitStatus: string;
  displayPitPrice: string;
  displayOrderStatus: string;
};

const Purchase = () => {
  const {userEmail} = useUser();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response: Order[] = await reqGet(
          path.join(DATA_URL, 'api', 'order', 'get_order', userEmail),
        );

        if (Array.isArray(response)) {
          if (response.length === 0) {
            console.warn('주문 내역이 없습니다.'); // 주문이 없을 때
          } else {
            console.log('Fetched orders:', response); // 주문을 성공적으로 가져온 경우
          }
          setOrders(response);
        } else {
          console.error('잘못된 형식의 응답', response);
          setOrders([]);
        }
      } catch (error) {
        console.error('주문 목록을 불러오는 중 오류 발생:', error);
        setOrders([]); // 빈 배열로 초기화
      }
    };

    if (userEmail) {
      fetchOrders();
    }
  }, [userEmail]);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        {orders.length === 0 ? (
          <View style={styles.noOrdersContainer}>
            <Text style={styles.noOrdersText}>구매한 제품이 없습니다.</Text>
          </View>
        ) : (
          orders.map((order, index) => (
            <View key={index}>
              <Text style={styles.completed}>
                {order.displayOrderStatus === '결제 완료'
                  ? '[ 구매 완료 ]'
                  : order.displayOrderStatus}
              </Text>

              <View style={[styles.item, {borderBottomWidth: 0}]}>
                <View style={styles.imageContainer}>
                  <Image
                    source={{
                      uri: path.join(
                        DATA_URL,
                        'api',
                        'img',
                        'imgserve',
                        'itemimg',
                        `${order.itemImg}`,
                      ),
                    }}
                    style={styles.itemImage}
                  />
                </View>
                <View style={styles.itemDetails}>
                  <Text style={styles.itemTitle}>{order.optional}</Text>
                  <Text style={styles.itemSize}>Size : {order.itemSize}</Text>
                  <Text style={styles.itemQuantity}>수량 : {order.qty}</Text>
                  <Text style={styles.itemPrice}>
                    가격 : {order.itemPrice}원
                  </Text>
                </View>
              </View>

              <View style={styles.subTextContainer}>
                {order.pitStatus === '수선 있음' ? (
                  <>
                    <Text style={styles.tailorText}>수선 ver.</Text>
                    <Text style={styles.tailorSize}>수선한 사이즈</Text>
                    <View style={styles.sizeChartRow2}>
                      <Text style={styles.sizeChartCell}>90</Text>
                      <Text style={styles.sizeChartCell}>71</Text>
                      <Text style={styles.sizeChartCell}>90</Text>
                      <Text style={styles.sizeChartCell}>43</Text>
                      <Text style={styles.sizeChartCell}>50</Text>
                      <Text style={styles.sizeChartCell}>64</Text>
                    </View>
                    <Text style={styles.tailorCost}>
                      수선 비용 : {order.displayPitPrice}원
                    </Text>
                  </>
                ) : (
                  <Text style={styles.tailorText}>수선 선택 X</Text>
                )}
              </View>
              <View style={styles.separator} />
            </View>
          ))
        )}
      </ScrollView>
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
  completed: {
    fontSize: screenWidth * 0.04,
    color: '#444',
    marginLeft: screenWidth * 0.05,
    fontWeight: 'bold',
    marginBottom: -5,
    marginTop: 15,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: screenWidth * 0.02,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginVertical: screenHeight * 0.01,
  },
  divider: {
    height: screenHeight * 0.007,
    backgroundColor: '#f4f4f4',
    marginVertical: screenHeight * 0.02,
  },
  textContainer: {
    position: 'absolute',
    top: 0,
    left: screenWidth * 0.04,
    zIndex: 1,
  },
  sectionTitle: {
    fontSize: screenWidth * 0.04,
    color: '#787878',
    fontWeight: 'bold',
    marginLeft: screenWidth * 0.02,
  },
  imageContainer: {
    width: screenWidth * 0.3,
    height: screenWidth * 0.4,
    backgroundColor: '#f4f4f4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: screenWidth * 0.04,
    marginTop: screenHeight * 0.01,
    marginLeft: screenWidth * 0.02,
    borderRadius: 27,
  },
  itemImage: {
    width: '90%',
    height: '100%',
    resizeMode: 'contain',
  },
  itemDetails: {
    flex: 1,
  },
  itemTitle: {
    fontSize: screenWidth * 0.05,
    color: '#000',
    fontWeight: 'bold',
    marginBottom: screenHeight * 0.01,
  },
  itemDescription: {
    fontSize: screenWidth * 0.04,
    color: '#494949',
    fontWeight: 'bold',
    marginBottom: screenHeight * 0.01,
  },
  itemSize: {
    fontSize: screenWidth * 0.04,
    color: '#787878',
    fontWeight: 'bold',
    marginBottom: screenHeight * 0.01,
  },
  itemQuantity: {
    fontSize: screenWidth * 0.04,
    color: '#8b8b8b',
    fontWeight: 'bold',
    marginBottom: screenHeight * 0.02,
  },
  quantityAndPrice: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: screenHeight * 0.01,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    borderRadius: 12,
    paddingVertical: screenHeight * 0.003,
    paddingHorizontal: screenWidth * 0.03,
  },
  quantityButton: {
    paddingVertical: screenHeight * 0.002,
    paddingHorizontal: screenWidth * 0.04,
  },
  quantityButtonText: {
    fontSize: screenWidth * 0.04,
    color: '#000',
    fontWeight: 'bold',
  },
  itemQuantityText: {
    fontSize: screenWidth * 0.04,
    marginHorizontal: screenWidth * 0.01,
    color: '#000',
    fontWeight: 'bold',
  },
  itemPrice: {
    fontSize: screenWidth * 0.05,
    color: '#000',
    fontWeight: 'bold',
  },
  subTextContainer: {
    marginLeft: screenWidth * 0.04,
    marginBottom: screenHeight * 0.03,
  },
  subText: {
    fontSize: screenWidth * 0.04,
    color: '#787878',
    fontWeight: 'bold',
    marginBottom: screenHeight * 0.04,
  },
  tailorCheckBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tailorText: {
    fontSize: screenWidth * 0.04,
    color: '#2D3FE3',
    fontWeight: 'bold',
    marginLeft: screenWidth * 0.01,
    marginBottom: screenHeight * 0.01,
  },
  tailorText2: {
    fontSize: screenWidth * 0.04,
    color: '#2D3FE3',
    fontWeight: 'bold',
    marginLeft: screenWidth * 0.05,
    marginBottom: screenHeight * 0.01,
  },
  tailorSize: {
    fontSize: screenWidth * 0.04,
    color: '#787878',
    marginLeft: screenWidth * 0.02,
  },
  tailorCostContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: screenWidth * 0.02,
  },
  tailorCost: {
    fontSize: screenWidth * 0.04,
    color: '#444',
    marginTop: screenHeight * 0.01,
    marginRight: screenWidth * 0.02,
  },
  sizeChart: {
    width: '90%',
    height: screenHeight * 0.02,
    marginVertical: '2%',
    marginLeft: screenWidth * 0.02,
  },
  sizeChartRow2: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '90%',
    marginTop: 10,
    marginLeft: 10,
    paddingVertical: 5,
  },
  sizeChartCell: {
    flex: 1,
    textAlign: 'center',
    borderWidth: 0.3,
    borderColor: '#444',
    paddingVertical: 5,
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
    marginBottom: 10,
    marginVertical: -5,
  },
  noOrdersContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: screenHeight,
  },
  noOrdersText: {
    fontSize: screenWidth * 0.05,
    color: '#888',
    fontWeight: 'bold',
  },
});

export default Purchase;
