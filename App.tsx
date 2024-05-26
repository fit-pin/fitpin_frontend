import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import BasicInformation from '././android/app/src/screens/Join/BasicInformation';
import Body_photo from './android/app/src/screens/Join/Body_photo';
import Style_G from './android/app/src/screens/Join/Style_G';
import Congrats from './android/app/src/screens/Join/Congrats';
import Main from './android/app/src/screens/Main/MainScreen';
import Search from './android/app/src/screens/Main/Search';
import Comment from './android/app/src/screens/Main/Comment';
import Mypage from './android/app/src/screens/Main/Mypage';
import ProductPage from './android/app/src/screens/Main/ProductPage';
import WritePage from './android/app/src/screens/Main/WritePage';

export type RootStackParamList = {
  BasicInformation: undefined;
  Body_photo: undefined;
  Style_G: undefined;
  Congrats: undefined;
  Main: undefined;
  ProductPage: undefined;
  Search: undefined;
  Comment: undefined;
  WritePage: undefined;
  Mypage: undefined;
  BottomTabNavigator: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="BasicInformation">
        <Stack.Screen
          name="BasicInformation"
          component={BasicInformation}
          options={{headerTitle: ''}}
        />
        <Stack.Screen
          name="Body_photo"
          component={Body_photo}
          options={{headerTitle: ''}}
        />
        <Stack.Screen
          name="Style_G"
          component={Style_G}
          options={{headerTitle: ''}}
        />
        <Stack.Screen
          name="Congrats"
          component={Congrats}
          options={{headerTitle: ''}}
        />
        <Stack.Screen
          name="Main"
          component={Main}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ProductPage"
          component={ProductPage}
          options={{headerTitle: ''}}
        />
        <Stack.Screen
          name="Search"
          component={Search}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Comment"
          component={Comment}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="WritePage"
          component={WritePage}
          options={{headerTitle: ''}}
        />
        <Stack.Screen
          name="Mypage"
          component={Mypage}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
