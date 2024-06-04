import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import CheckBox from '@react-native-community/checkbox';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flex: 1,
  },
  date: {
    fontSize: screenWidth * 0.04,
    color: '#000',
    marginTop: screenHeight * 0.02,
    marginLeft: screenWidth * 0.05,
  },
  completed: {
    fontSize: screenWidth * 0.04,
    color: '#929292',
    marginLeft: screenWidth * 0.05,
    fontWeight: 'bold',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: screenHeight * 0.02,
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
    width: '100%',
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
    marginLeft: screenWidth * 0.04,
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
    color: '#787878',
    marginTop: screenHeight * 0.01,
    marginRight: screenWidth * 0.02,
  },
  sizeChart: {
    width: '90%',
    height: screenHeight * 0.02,
    marginVertical: '2%',
    marginLeft: screenWidth * 0.02,
  },
});

export default Purchase;