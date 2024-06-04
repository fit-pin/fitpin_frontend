import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import CheckBox from '@react-native-community/checkbox';

const Purchase = () => {
  const [isChecked, setIsChecked] = useState(true);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.date}>2024.04.10</Text>
        <Text style={styles.completed}>구매완료</Text>
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

        <View style={styles.divider} />

        <View>
          <Text style={styles.date}>2024.04.10</Text>
          <Text style={styles.completed}>구매 / 수선 완료</Text>
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
            <View style={styles.tailorCheckBoxContainer}>
              <Text style={styles.tailorText}>수선해서 구매하기</Text>
              <CheckBox value={isChecked} onValueChange={setIsChecked} />
            </View>
            <Text style={styles.tailorSize}>수선한 사이즈</Text>
            <Image
              source={require('../../assets/img/main/product/size.png')}
              style={styles.sizeChart}
            />
            <View style={styles.tailorCostContainer}>
              <Text style={styles.tailorCost}>수선 비용 : 20,000원</Text>
            </View>
          </View>
        </View>
      </ScrollView>
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
  date: {
    fontSize: 15,
    color: '#000',
    marginTop: 20,
    marginLeft: 20,
  },
  completed: {
    fontSize: 15,
    color: '#929292',
    marginLeft: 20,
    fontWeight: 'bold',
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
  divider: {
    height: 5,
    backgroundColor: '#f4f4f4',
    marginVertical: 10,
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
  tailorCheckBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tailorText: {
    fontSize: 16,
    color: '#2D3FE3',
    fontWeight: 'bold',
    marginLeft: 5,
    marginBottom: 5,
  },
  tailorSize: {
    fontSize: 15,
    color: '#787878',
    marginLeft: 10,
  },
  tailorCostContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: 10,
  },
  tailorCost: {
    fontSize: 15,
    color: '#787878',
    marginTop: 10,
    marginRight: 10,
  },
  sizeChart: {
    width: '90%',
    height: 20,
    marginVertical: '2%',
    marginLeft: 15,
  },
});

export default Purchase;