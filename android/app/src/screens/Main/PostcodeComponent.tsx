import React from 'react';
import {Modal, View, Button, StyleSheet} from 'react-native';
import Postcode from '@actbase/react-daum-postcode';

interface PostcodeComponentProps {
  isVisible: boolean;
  onClose: () => void;
  onSelected: (data: any) => void;
}

const PostcodeComponent: React.FC<PostcodeComponentProps> = ({
  isVisible,
  onClose,
  onSelected,
}) => {
  const handleError = (error: any) => {
    console.error('Postcode error:', error);
    onClose();
  };

  return (
    <Modal visible={isVisible} animationType="slide">
      <View style={styles.container}>
        <Postcode
          style={styles.postcode}
          jsOptions={{animation: true}}
          onSelected={onSelected}
          onError={handleError} // onError 속성 추가
        />
        <Button title="닫기" onPress={onClose} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  postcode: {
    width: '100%',
    height: '100%',
  },
});

export default PostcodeComponent;
