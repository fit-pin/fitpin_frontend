import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, Image, Text, StyleSheet} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';

import {RootStackParamList} from '../../../../../App.tsx';
import {StackNavigationProp} from '@react-navigation/stack';

type BottomTabNavigatorNavigationProp = StackNavigationProp<
  RootStackParamList,
  'BottomTabNavigator'
>;

const BottomTabNavigator = () => {
  const navigation = useNavigation<BottomTabNavigatorNavigationProp>();
  const route = useRoute();
  const [activeTab, setActiveTab] = useState(route.name);

  useEffect(() => {
    setActiveTab(route.name);
  }, [route.name]);

  return (
    <View style={styles.bottomBar}>
      {/* 홈 */}
      <TouchableOpacity
        style={styles.iconButton2}
        onPress={() => navigation.navigate('Main')}>
        <View style={styles.iconContainer}>
          <Image
            source={
              activeTab === 'Main'
                ? require('../../assets/img/main/bar/home2.png')
                : require('../../assets/img/main/bar/home.png')
            }
            style={styles.icon2}
          />
          <Text
            style={[styles.iconText, activeTab === 'Main' && styles.boldText]}>
            홈
          </Text>
        </View>
      </TouchableOpacity>
      {/* 검색 */}
      <TouchableOpacity
        style={styles.iconButton2}
        onPress={() => navigation.navigate('Search')}>
        <View style={styles.iconContainer}>
          <Image
            source={
              activeTab === 'Search'
                ? require('../../assets/img/main/bar/search2.png')
                : require('../../assets/img/main/bar/search.png')
            }
            style={styles.icon2}
          />
          <Text
            style={[
              styles.iconText,
              activeTab === 'Search' && styles.boldText,
            ]}>
            검색
          </Text>
        </View>
      </TouchableOpacity>
      {/* 핏 코멘트 */}
      <TouchableOpacity
        style={styles.iconButton2}
        onPress={() => navigation.navigate('Comment')}>
        <View style={styles.iconContainer}>
          <Image
            source={
              activeTab === 'Comment'
                ? require('../../assets/img/main/bar/comment2.png')
                : require('../../assets/img/main/bar/comment.png')
            }
            style={styles.icon2}
          />
          <Text
            style={[
              styles.iconText,
              activeTab === 'Comment' && styles.boldText,
            ]}>
            핏 코멘트
          </Text>
        </View>
      </TouchableOpacity>
      {/* 마이페이지 */}
      <TouchableOpacity
        style={styles.iconButton2}
        onPress={() => navigation.navigate('Mypage')}>
        <View style={styles.iconContainer}>
          <Image
            source={
              activeTab === 'Mypage'
                ? require('../../assets/img/main/bar/mypage2.png')
                : require('../../assets/img/main/bar/mypage.png')
            }
            style={styles.icon2}
          />
          <Text
            style={[
              styles.iconText,
              activeTab === 'Mypage' && styles.boldText,
            ]}>
            마이페이지
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: '4%',
    paddingHorizontal: '4%',
    borderTopColor: '#ccc',
  },
  iconButton2: {
    backgroundColor: '#fff',
    flex: 1,
    alignItems: 'center',
  },
  iconContainer: {
    alignItems: 'center',
  },
  icon2: {
    width: 24,
    height: 24,
  },
  iconText: {
    marginTop: '4%',
    color: '#000',
    fontSize: 12,
  },
  boldText: {
    fontWeight: 'bold',
  },
});

export default BottomTabNavigator;
