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
import RNFS from 'react-native-fs';
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
  const cameraRef = useRef<RNCamera | null>(null);
  const navigation = useNavigation<CameraBodyPhotoNavigationProp>();

  // 카메라 권한 요청
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

  // 권한 요청 호출
  useEffect(() => {
    requestCameraPermission();
  }, []);

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text>No access to camera</Text>
        <TouchableOpacity
          onPress={() =>
            openSettings().catch(() => console.warn('Cannot open settings'))
          }
          style={styles.settingsButton}>
          <Text style={styles.buttonText}>Open Settings</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 사진 촬영
  const takePicture = async () => {
    if (cameraRef.current) {
      const data = await cameraRef.current.takePictureAsync({
        quality: 0.5,
        base64: false,
      });
      setPhotoUri(data.uri);
    }
  };

  // 로컬 저장 경로 생성
  const getLocalFilePath = async () => {
    const dir =
      Platform.OS === 'android'
        ? `${RNFS.ExternalDirectoryPath}/FitBox`
        : `${RNFS.DocumentDirectoryPath}/FitBox`;
    await RNFS.mkdir(dir); // 폴더 생성
    const timestamp = new Date().toISOString().replace(/[:.-]/g, ''); // 파일명에 타임스탬프 추가
    return `${dir}/photo_${timestamp}.jpg`;
  };

  // 사진 로컬 저장
  const saveToLocalStorage = async (uri: string) => {
    const newPath = await getLocalFilePath();
    try {
      await RNFS.moveFile(uri, newPath);
      return `file://${newPath}`;
    } catch (error) {
      console.error('Failed to save photo.', error);
      return null;
    }
  };

  // 확인 버튼 클릭 시 로컬에 저장
  const confirmPicture = async () => {
    if (photoUri) {
      const localUri = await saveToLocalStorage(photoUri);
      if (localUri) {
        navigation.navigate('Fit_box', {newPhotoUri: localUri});
      }
      setPhotoUri(null);
    }
  };

  // 취소 버튼 클릭 시 다시 촬영
  const retakePicture = () => {
    setPhotoUri(null);
  };

  // 사진이 찍힌 경우 UI
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
    marginHorizontal: 20,
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
