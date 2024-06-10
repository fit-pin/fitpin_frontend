import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';

const WriteComment = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.commentContainer}>
        <View style={styles.detailsContainer}>
          <Text style={styles.title}>폴로 랄프 로렌 - 데님셔츠</Text>
          <Text style={styles.size}>M</Text>
          <Text style={styles.comment}>
            제가 산 사이즈는 M이고 평소에는 L을 입는데 이 옷은 M사이즈도 크게
            느껴졌다
          </Text>
        </View>
        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/img/main/top/top1.png')}
            style={styles.image}
          />
        </View>
      </View>

      <View style={styles.commentContainer}>
        <View style={styles.detailsContainer}>
          <Text style={styles.title}>상품이름</Text>
          <Text style={styles.size}>사이즈 보여주기</Text>
          <Text style={styles.comment}>
            사용자가 적은 한줄평 보여주기 최대 2줄
          </Text>
        </View>
        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/img/main/top/top2.png')}
            style={styles.image}
          />
        </View>
      </View>

      <View style={styles.commentContainer}>
        <View style={styles.detailsContainer}>
          <Text style={styles.title}>상품이름</Text>
          <Text style={styles.size}>사이즈 보여주기</Text>
          <Text style={styles.comment}>
            사용자가 적은 한줄평 보여주기 최대 2줄
          </Text>
        </View>
        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/img/main/street.png')}
            style={styles.image}
          />
        </View>
      </View>

      <View style={styles.commentContainer}>
        <View style={styles.detailsContainer}>
          <Text style={styles.title}>상품이름</Text>
          <Text style={styles.size}>사이즈 보여주기</Text>
          <Text style={styles.comment}>
            사용자가 적은 한줄평 보여주기 최대 2줄
          </Text>
        </View>
        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/img/main/vintage.png')}
            style={styles.image}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  commentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginVertical: 5,
  },
  detailsContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    color: '#000',
    fontWeight: 'bold',
    marginBottom: 15,
  },
  size: {
    fontSize: 17,
    color: '#767676',
    marginBottom: 10,
  },
  comment: {
    fontSize: 15,
    color: '#767676',
  },
  imageContainer: {
    width: screenWidth * 0.22,
    height: screenWidth * 0.22,
    backgroundColor: '#f4f4f4',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginLeft: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: 10,
  },
});

export default WriteComment;
