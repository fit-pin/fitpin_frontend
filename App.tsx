import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Body_photo from './android/app/src/screens/Join/Body_photo';
import Style_G from './android/app/src/screens/Join/Style_G';
import Congrats from './android/app/src/screens/Join/Congrats';

export type RootStackParamList = {
  Body_photo: undefined;
  Style_G: undefined;
  Congrats: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Body_photo">
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
