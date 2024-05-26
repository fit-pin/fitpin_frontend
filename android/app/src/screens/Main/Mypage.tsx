/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import BottomTabNavigator from '../Navigation/BottomTabNavigator';

const Mypage = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.platformName}>마이페이지</Text>
        <View style={styles.cartButtonWrapper}>
          <TouchableOpacity style={styles.cartButton}>
            <Image
              source={require('../../assets/img/main/shop.png')}
              style={styles.cartImage}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* 프로필 */}
      <View style={styles.section}>
        <Image
          source={require('../../assets/img/mypage/profile.png')}
          style={styles.profile}
        />
        <View style={styles.textWrapper}>
          <Text style={styles.name}>오주희</Text>
          <Text style={styles.email}>ohjuhee@example.com</Text>
        </View>
      </View>
      <View style={styles.line} />

      {/* 구매내역 / 체형재측정 */}
      <View style={[styles.section, {marginBottom: -20}]}>
        <Image
          source={require('../../assets/img/mypage/buy.png')}
          style={styles.image}
        />
        <Text style={styles.text}>구매내역</Text>
      </View>

      <View style={styles.section}>
        <Image
          source={require('../../assets/img/mypage/camera.png')}
          style={styles.image}
        />
        <Text style={styles.text}>체형 재측정</Text>
      </View>
      <View style={styles.line} />

      {/* 핏보관함 / 내가 작성한 핏 코멘트 */}
      <View style={[styles.section, {marginBottom: -20}]}>
        <Image
          source={require('../../assets/img/mypage/fitbox.png')}
          style={styles.image}
        />
        <Text style={styles.text}>핏 보관함</Text>
      </View>

      <View style={styles.section}>
        <Image
          source={require('../../assets/img/mypage/fitcomment.png')}
          style={styles.image}
        />
        <Text style={styles.text}>내가 작성한 핏 코멘트</Text>
      </View>
      <View style={styles.line} />

      {/* 로그아웃 / 회원탈퇴 */}
      <View style={[styles.section, {marginBottom: -20}]}>
        <Image
          source={require('../../assets/img/mypage/logout.png')}
          style={styles.image}
        />
        <Text style={styles.logout}>로그아웃</Text>
      </View>

      <View style={styles.section}>
        <Image
          source={require('../../assets/img/mypage/leave.png')}
          style={styles.image}
        />
        <Text style={styles.withdrawal}>회원탈퇴</Text>
      </View>
      <View style={styles.line} />
      <BottomTabNavigator />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: '1%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '8%',
    paddingHorizontal: '5%',
  },
  platformName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  cartButtonWrapper: {
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#F4F4F4',
    padding: '1.5%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartButton: {
    padding: 3,
  },
  cartImage: {
    width: 24,
    height: 24,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '5%',
    padding: '6.5%',
  },
  profile: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  image: {
    width: 24,
    height: 24,
    left: '20%',
  },
  textWrapper: {
    flexDirection: 'column',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000',
    paddingHorizontal: '5%',
  },
  email: {
    fontSize: 14,
    color: '#888',
    paddingHorizontal: '3%',
  },
  text: {
    fontSize: 16,
    color: '#000',
    paddingHorizontal: '5%',
  },
  line: {
    borderBottomWidth: 2,
    borderBottomColor: '#E9E9E9',
  },
  logout: {
    fontSize: 16,
    textAlign: 'center',
    color: '#000',
    paddingHorizontal: '5%',
  },
  withdrawal: {
    fontSize: 16,
    color: '#000',
    paddingHorizontal: '5%',
  },
});

export default Mypage;
