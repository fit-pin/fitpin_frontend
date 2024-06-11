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
import Style_B from './android/app/src/screens/Join/Style_B';
import Congrats from './android/app/src/screens/Join/Congrats';
import Main from './android/app/src/screens/Main/MainScreen';
import ProductPage from './android/app/src/screens/Main/ProductPage';
import Cart from './android/app/src/screens/Main/Cart';
import Order from './android/app/src/screens/Main/Order';
import OrderComplete from './android/app/src/screens/Main/OrderComplete';
import Camera from './android/app/src/screens/Main/Camera';
import Size from './android/app/src/screens/Main/Size';
import Search from './android/app/src/screens/Search/Search';
import Comment from './android/app/src/screens/Comment/Comment';
import CommentReview from './android/app/src/screens/Comment/CommentReview';
import WritePage from './android/app/src/screens/Comment/WritePage';
import Mypage from './android/app/src/screens/Mypage/Mypage';
import Purchase from './android/app/src/screens/Mypage/Purchase';
import Remeasure from './android/app/src/screens/Mypage/Remeasure';
import Fit_box from './android/app/src/screens/Mypage/Fit_box';
import WriteComment from './android/app/src/screens/Mypage/WriteComment';

export type RootStackParamList = {
  Splash: undefined;
  Start: undefined;
  LognSignin: undefined;
  Signin: undefined;
  Login: undefined;
  BasicInformation: undefined;
  Body_photo: {gender: 'female' | 'male' | null};
  Style_G: undefined;
  Style_B: undefined;
  Congrats: {selectedStyles: string[]};
  Main: undefined;
  ProductPage: undefined;
  Cart: undefined;
  Order: undefined;
  OrderComplete: undefined;
  Camera: undefined;
  Size: undefined;
  Search: undefined;
  Comment: undefined;
  CommentReview: undefined;
  WritePage: undefined;
  Mypage: undefined;
  Purchase: undefined;
  Remeasure: undefined;
  Fit_box: undefined;
  WriteComment: undefined;
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
          options={{headerShown: false}} //상단에 화살표 안 보이게
        />
        <Stack.Screen
          name="Body_photo"
          component={Body_photo}
          options={{headerTitle: ''}} //상단에 화살표 보이게
        />
        <Stack.Screen
          name="Style_G"
          component={Style_G}
          options={{headerTitle: ''}}
        />
        <Stack.Screen
          name="Style_B"
          component={Style_B}
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
          options={{headerShown: false}} //MainScreen.tsx
        />
        <Stack.Screen
          name="ProductPage"
          component={ProductPage}
          options={{headerTitle: ''}}
        />
        <Stack.Screen
          name="Cart"
          component={Cart}
          options={{
            headerTitle: '장바구니',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="Order"
          component={Order}
          options={{
            headerTitle: '주문 / 결제',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="OrderComplete"
          component={OrderComplete}
          options={{headerTitle: ''}}
        />
        <Stack.Screen
          name="Camera"
          component={Camera}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Size"
          component={Size}
          options={{headerShown: false}}
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
        <Stack.Screen
          name="Purchase"
          component={Purchase}
          options={{
            headerTitle: '주문내역',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="Remeasure"
          component={Remeasure}
          options={{
            headerTitle: '체형 재측정',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="Fit_box"
          component={Fit_box}
          options={{
            headerTitle: '핏 보관함',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="WriteComment"
          component={WriteComment}
          options={{
            headerTitle: '내가 작성한 핏 코멘트',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;