import React from 'react';
import {View, Text, StyleSheet, ScrollView, Image} from 'react-native';

const CommentReview: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>000님의 핏코멘트</Text>
      <ScrollView horizontal style={styles.imageScrollContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/img/comment/girl.png')}
            style={styles.image}
          />
        </View>
        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/img/main/top/top1.png')}
            style={styles.image}
          />
        </View>
        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/img/main/top/top1.png')}
            style={styles.image}
          />
        </View>
      </ScrollView>
      <View style={styles.line} />
      <View style={styles.textContainer}>
        <Text style={styles.clothingName}>옷 이름</Text>
        <Text style={styles.clothingType}>폴로셔츠</Text>
        <View style={styles.line} />

        <Text style={styles.title}>기본 정보</Text>
        <View style={styles.infoContainer}>
          <View style={styles.sizeLabelContainer}>
            <Text style={styles.sizeLabel}>Size</Text>
          </View>
          <View style={styles.sizeLabelContainer}>
            <Text style={styles.sizeLabel}>키</Text>
          </View>
          <View style={styles.sizeLabelContainer}>
            <Text style={styles.sizeLabel}>몸무게</Text>
          </View>
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.sizeContainer}>
            <Text style={styles.sizeText}>S</Text>
          </View>
          <View style={styles.sizeContainer}>
            <Text style={styles.sizeText}>170cm</Text>
          </View>
          <View style={styles.sizeContainer}>
            <Text style={styles.sizeText}>60kg</Text>
          </View>
        </View>
      </View>
      <View style={styles.line} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>선택 옵션</Text>
        <View style={styles.fitOptions}>
          <View style={styles.fitButton}>
            <Text style={styles.sizeTextBold}>사이즈</Text>
            <Text style={styles.fitButtonText}>조금 작아요</Text>
          </View>
        </View>
      </View>
      <View style={styles.line} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>000님의 한줄평</Text>
        <Text style={styles.reviewText}>
          제가 산 사이즈는 M이고 평소에는 L을 입는데 {'\n'} 이 옷은 M사이즈도
          크게 느껴졋다 어쩌구
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: '6%',
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: '4%',
    color: '#000',
  },
  clothingName: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#000',
  },
  clothingType: {
    fontSize: 15,
    color: '#666',
    marginBottom: '3%',
    marginTop: '1%',
  },
  line: {
    height: 1,
    backgroundColor: '#E9E9E9',
    marginVertical: '2%',
  },
  textContainer: {
    marginTop: '3%',
    marginBottom: '3%',
  },
  title: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#000',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '1%',
    left: '3%',
  },
  sizeLabel: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#000',
    marginTop: '1%',
    left: '13%',
  },
  sizeLabelContainer: {
    marginRight: '21.5%',
  },
  sizeContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingVertical: '2%',
    paddingHorizontal: '5%',
    alignItems: 'center',
    marginRight: '10%',
  },
  sizeText: {
    fontSize: 15,
    color: '#000',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  fitOptions: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  fitButton: {
    borderRadius: 20,
    width: '32%',
    height: 65,
    borderColor: '#ccc',
    paddingVertical: '2%',
    paddingHorizontal: '5%',
    marginTop: '3%',
    marginBottom: '1%',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  fitButtonText: {
    fontSize: 15,
    color: '#000',
    textAlign: 'center',
  },
  sizeTextBold: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: '3%',
    right: '20%',
  },
  reviewText: {
    fontSize: 14,
    color: '#000000',
    marginTop: '3%',
    marginBottom: '3%',
  },
  imageScrollContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  imageContainer: {
    width: 250,
    height: 270,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
});

export default CommentReview;
