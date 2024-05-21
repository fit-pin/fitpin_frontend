import React, {useState} from 'react';
import {View, TouchableOpacity, Image, Text, StyleSheet} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import MainScreen from '../Main/MainScreen';
import Search from '../Main/Search';
import Comment from '../Main/Comment';
import MyPage from '../Main/Mypage';

// RootStackParamList 타입을 정의합니다.
export type RootStackParamList = {
  MainScreen: undefined;
  Search: undefined;
  Comment: undefined;
  MyPage: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const BottomTabNavigator = () => {
  const [activeTab, setActiveTab] = useState('홈');

  const handleTabPress = (tabName: string) => {
    setActiveTab(tabName);
    switch (tabName) {
      case '홈':
        <Stack.Screen
          name="MainScreen"
          component={MainScreen}
          options={{headerTitle: ''}}
        />;
        break;
      case '검색':
        <Stack.Screen
          name="Search"
          component={Search}
          options={{headerTitle: ''}}
        />;
        break;
      case '핏 코멘트':
        <Stack.Screen
          name="Comment"
          component={Comment}
          options={{headerTitle: ''}}
        />;
        break;
      case '마이페이지':
        <Stack.Screen
          name="MyPage"
          component={MyPage}
          options={{headerTitle: ''}}
        />;
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.bottomBar}>
      {/* 홈 아이콘 */}
      <TouchableOpacity
        style={styles.iconButton2}
        onPress={() => handleTabPress('홈')}>
        <View style={styles.iconContainer}>
          <Image
            source={
              activeTab === '홈'
                ? require('../../assets/img/main/bar/home2.png')
                : require('../../assets/img/main/bar/home.png')
            }
            style={styles.icon2}
          />
          <Text
            style={[styles.iconText, activeTab === '홈' && styles.boldText]}>
            홈
          </Text>
        </View>
      </TouchableOpacity>
      {/* 검색 아이콘 */}
      <TouchableOpacity
        style={styles.iconButton2}
        onPress={() => handleTabPress('검색')}>
        <View style={styles.iconContainer}>
          <Image
            source={
              activeTab === '검색'
                ? require('../../assets/img/main/bar/search2.png')
                : require('../../assets/img/main/bar/search.png')
            }
            style={styles.icon2}
          />
          <Text
            style={[styles.iconText, activeTab === '검색' && styles.boldText]}>
            검색
          </Text>
        </View>
      </TouchableOpacity>
      {/* 댓글 아이콘 */}
      <TouchableOpacity
        style={styles.iconButton2}
        onPress={() => handleTabPress('핏 코멘트')}>
        <View style={styles.iconContainer}>
          <Image
            source={
              activeTab === '핏 코멘트'
                ? require('../../assets/img/main/bar/comment2.png')
                : require('../../assets/img/main/bar/comment.png')
            }
            style={styles.icon2}
          />
          <Text
            style={[
              styles.iconText,
              activeTab === '핏 코멘트' && styles.boldText,
            ]}>
            핏 코멘트
          </Text>
        </View>
      </TouchableOpacity>
      {/* 마이페이지 아이콘 */}
      <TouchableOpacity
        style={styles.iconButton2}
        onPress={() => handleTabPress('마이페이지')}>
        <View style={styles.iconContainer}>
          <Image
            source={
              activeTab === '마이페이지'
                ? require('../../assets/img/main/bar/mypage2.png')
                : require('../../assets/img/main/bar/mypage.png')
            }
            style={styles.icon2}
          />
          <Text
            style={[
              styles.iconText,
              activeTab === '마이페이지' && styles.boldText,
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
    fontWeight: 'bold', // Bold text
  },
});

export default BottomTabNavigator;
