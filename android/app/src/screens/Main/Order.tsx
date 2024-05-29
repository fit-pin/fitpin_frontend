import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const Order = () => {
  return (
    <View style={styles.container}>
      <Text>주문/결제 페이지</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
});

export default Order;
