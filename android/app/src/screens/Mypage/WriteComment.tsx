import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const WriteComment = () => {
  return (
    <View style={styles.container}>
      <Text>내가 작성한 핏 코멘트</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
});

export default WriteComment;
