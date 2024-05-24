import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import BottomTabNavigator from '../Navigation/BottomTabNavigator';

const Comment = () => {
  return (
    <View style={styles.container}>
      <Text>Search Screen</Text>
      <BottomTabNavigator />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Comment;
