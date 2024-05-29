import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const Remeasure = () => {
  return (
    <View style={styles.container}>
      <Text>체형 재측정</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
});

export default Remeasure;
