import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Splash from './android/app/src/screens/Start/Splash';
import Start from './android/app/src/screens/Start/Start';
import LognSignin from './android/app/src/screens/Join/LognSignin';
import Signin from './android/app/src/screens/Join/Signin';
import Login from './android/app/src/screens/Join/Login';
import BasicInformation from '././android/app/src/screens/Join/BasicInformation';
import Body_photo from './android/app/src/screens/Join/Body_photo';
import Style_G from './android/app/src/screens/Join/Style_G';
import Congrats from './android/app/src/screens/Join/Congrats';
import Main from './android/app/src/screens/Main/MainScreen';
import ProductPage from './android/app/src/screens/Main/ProductPage';
import Search from './android/app/src/screens/Main/Search';
import Comment from './android/app/src/screens/Main/Comment';
import CommentReview from './android/app/src/screens/Main/CommentReview';
import WritePage from './android/app/src/screens/Main/WritePage';
import Mypage from './android/app/src/screens/Main/Mypage';

export type RootStackParamList = {
  Splash: undefined;
  Start: undefined;
  LognSignin: undefined;
  Signin: undefined;
  Login: undefined;
  BasicInformation: undefined;
  Body_photo: undefined;
  Style_G: undefined;
  Congrats: undefined;
  Main: undefined;
  ProductPage: undefined;
  Search: undefined;
  Comment: undefined;
  CommentReview: undefined;
  WritePage: undefined;
  Mypage: undefined;
  BottomTabNavigator: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen
          name="Splash"
          component={Splash}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Start"
          component={Start}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="LognSignin"
          component={LognSignin}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Signin"
          component={Signin}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="BasicInformation"
          component={BasicInformation}
          options={{headerShown: false}}
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
          name="CommentReview"
          component={CommentReview}
          options={{headerTitle: ''}}
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
