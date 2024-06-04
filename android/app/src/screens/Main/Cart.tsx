import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../../../App.tsx';

const Cart = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
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
            <Text style={styles.itemQuantity}>수량 : 1</Text>
            <View style={styles.quantityAndPrice}>
              <View style={styles.quantityControl}>
                <TouchableOpacity style={styles.quantityButton}>
                  <Text style={styles.quantityButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.itemQuantityText}>1</Text>
                <TouchableOpacity style={styles.quantityButton}>
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.itemPrice}>219,000원</Text>
            </View>
          </View>
        </View>
        {/* 추가 아이템 */}
        <View>
          <View style={styles.textContainer}>
            <Text style={styles.sectionTitle}>수선 ver</Text>
          </View>
          <View style={[styles.item, { borderBottomWidth: 0 }]}>
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
                  <TouchableOpacity style={styles.quantityButton}>
                    <Text style={styles.quantityButtonText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.itemQuantityText}>1</Text>
                  <TouchableOpacity style={styles.quantityButton}>
                    <Text style={styles.quantityButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.itemPrice}>219,000원</Text>
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
          <Text style={styles.footerPrice}>458,000원</Text>
        </View>
        <TouchableOpacity style={styles.orderButton} onPress={() => navigation.navigate('Order')}>
          <Text style={styles.orderButtonText}>주문하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const screenWidth = Dimensions.get('window').width;

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