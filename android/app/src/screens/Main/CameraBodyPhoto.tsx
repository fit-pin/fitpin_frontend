import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Platform,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {
  request,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from 'react-native-permissions';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../../../../App';

type CameraBodyPhotoNavigationProp = StackNavigationProp<
  RootStackParamList,
  'CameraBodyPhoto'
>;

const CameraBodyPhoto = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const cameraRef = useRef<RNCamera | null>(null);
  const navigation = useNavigation<CameraBodyPhotoNavigationProp>();

  const requestCameraPermission = async () => {
    const result =
      Platform.OS === 'android'
        ? await request(PERMISSIONS.ANDROID.CAMERA)
        : await request(PERMISSIONS.IOS.CAMERA);

    if (result === RESULTS.GRANTED) {
      setHasPermission(true);
    } else {
      setHasPermission(false);
      if (result === RESULTS.BLOCKED || result === RESULTS.UNAVAILABLE) {
        Alert.alert(
          'Permission Denied',
          'Camera permission is required to take photos.',
        );
      }
    }
  };

  useEffect(() => {
    requestCameraPermission();
  }, []);

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text>카메라 접근 권한이 없습니다.</Text>
        <TouchableOpacity
          onPress={() =>
            openSettings().catch(() => console.warn('설정을 열 수 없습니다.'))
          }
          style={styles.settingsButton}>
          <Text style={styles.buttonText}>설정 열기</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current && !isCapturing) {
      setIsCapturing(true);
      try {
        const data = await cameraRef.current.takePictureAsync({
          quality: 0.5,
          base64: false,
        });
        setPhotoUri(data.uri); // 사진 URI 저장
      } catch (error) {
        console.error('사진 촬영 실패:', error);
      } finally {
        setIsCapturing(false);
      }
    }
  };

  const confirmPicture = () => {
    if (photoUri) {
      navigation.navigate('SizeInfoScreen', {photoUri}); // SizeInfoScreen으로 이동
      setPhotoUri(null); // 초기화
    }
  };

  const retakePicture = () => {
    setPhotoUri(null); // 사진 다시 촬영
  };

  if (photoUri) {
    return (
      <View style={styles.container}>
        <Image source={{uri: photoUri}} style={styles.preview} />
        <View style={styles.bottomControls}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={confirmPicture}>
            <Text style={styles.buttonText}>확인</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={retakePicture}>
            <Text style={styles.buttonText}>취소</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <RNCamera ref={cameraRef} style={styles.preview} captureAudio={false} />
      <View style={styles.bottomControls}>
        <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
          <View style={styles.outerCircle}>
            <View style={styles.innerCircle} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  preview: {
    flex: 1,
    width: '100%',
  },
  bottomControls: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  captureButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
    borderColor: '#fff',
  },
  innerCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
  },
  actionButton: {
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  buttonText: {
    fontSize: 14,
    color: '#fff',
  },
  settingsButton: {
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
});

export default CameraBodyPhoto;
