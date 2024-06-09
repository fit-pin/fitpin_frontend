import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Platform,
  TouchableOpacity,
  Image,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {
  request,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from 'react-native-permissions';
import path from 'path';
import {ArRequest} from '../../utills/Request';
import {AR_URL} from '../../Constant';

const Camera = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [confirmedPhotoUri, setConfirmedPhotoUri] = useState<string | null>(
    null,
  );
  const cameraRef = useRef<RNCamera | null>(null);

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      const result = await request(PERMISSIONS.ANDROID.CAMERA);
      console.log('Camera permission status:', result);

      if (result === RESULTS.GRANTED) {
        setHasPermission(true);
      } else if (result === RESULTS.DENIED) {
        setHasPermission(false);
      } else if (result === RESULTS.BLOCKED || result === RESULTS.UNAVAILABLE) {
        setPermissionDenied(true);
      }
    } else {
      const result = await request(PERMISSIONS.IOS.CAMERA);
      if (result === RESULTS.GRANTED) {
        setHasPermission(true);
      } else if (result === RESULTS.DENIED) {
        setHasPermission(false);
      } else if (result === RESULTS.BLOCKED || result === RESULTS.UNAVAILABLE) {
        setPermissionDenied(true);
      }
    }
  };

  useEffect(() => {
    requestCameraPermission();
  }, []);

  useEffect(() => {
    console.log('Has permission:', hasPermission);
    console.log('Permission denied:', permissionDenied);
  }, [hasPermission, permissionDenied]);

  if (permissionDenied) {
    return (
      <View style={styles.container}>
        <Text>
          Camera permission was denied permanently. Please enable it in the app
          settings.
        </Text>
        <TouchableOpacity
          onPress={() => {
            openSettings().catch(() => console.warn('Cannot open settings'));
          }}
          style={styles.settingsButton}>
          <Text style={styles.buttonText}>Open Settings</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text>No access to camera</Text>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      const options = {
        quality: 0.5,
        base64: false,
      };

      const data = await cameraRef.current.takePictureAsync(options);

      // 요청 FormData 만들기
      const formData = new FormData();
      const name = data.uri.split('/').pop();
      formData.append('anaFile', {
        uri: data.uri,
        name: name,
        type: 'image/jpeg',
      } as FormDataValue);
      formData.append('personKey', '174');

      ArRequest(path.join(AR_URL, 'bodymea'), formData)
        .then(async res => {
          console.log(await res.json());
          // TODO: 여기에서 측정값 DB 에 넘기는거 해야함
        })
        .catch(e => console.log(e));

      setPhotoUri(data.uri);
    }
  };

  const confirmPicture = async () => {
    setConfirmedPhotoUri(photoUri);
    setPhotoUri(null);
  };

  const retakePicture = () => {
    setPhotoUri(null);
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

  if (confirmedPhotoUri) {
    return (
      <View style={styles.container}>
        <Image source={{uri: confirmedPhotoUri}} style={styles.preview} />
        <View style={styles.bottomControls}>
          <Text style={styles.buttonText}>저장된 사진</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <RNCamera
        ref={cameraRef}
        style={styles.preview}
        type={RNCamera.Constants.Type.back}
        flashMode={RNCamera.Constants.FlashMode.off}
        captureAudio={false}
      />
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

export default Camera;
