import React from 'react';
import {StyleSheet, View, Image, Dimensions, ScrollView} from 'react-native';

const FitBox = () => {
  const images = [
    require('../../assets/img/mypage/fit_box_image1.png'),
    require('../../assets/img/mypage/fit_box_image2.png'),
    require('../../assets/img/mypage/fit_box_image3.png'),
    require('../../assets/img/mypage/fit_box_image4.png'),
  ];

  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.contentContainer}>
      <View style={styles.row}>
        {images.slice(0, 2).map((image, index) => (
          <Image key={index} source={image} style={styles.image} />
        ))}
      </View>
      <View style={styles.row}>
        {images.slice(2, 4).map((image, index) => (
          <Image key={index} source={image} style={styles.image} />
        ))}
      </View>
    </ScrollView>
  );
};

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  image: {
    width: screenWidth * 0.45,
    height: screenWidth * 0.45,
    borderRadius: 10,
  },
});

export default FitBox;
