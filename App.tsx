import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import BasicInformation from '././android/app/src/screens/Join/BasicInformation';
import Body_photo from './android/app/src/screens/Join/Body_photo';
import Style_G from './android/app/src/screens/Join/Style_G';
import Congrats from './android/app/src/screens/Join/Congrats';
import Main from './android/app/src/screens/Main/MainScreen';

export type RootStackParamList = {
  BasicInformation: undefined;
  Body_photo: undefined;
  Style_G: undefined;
  Congrats: undefined;
  Main: undefined;
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
