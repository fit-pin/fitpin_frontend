import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  LayoutChangeEvent,
  Dimensions,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import {useRoute, useNavigation, RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../../../../App';
import {useUser} from '../UserContext';
import RNPickerSelect from 'react-native-picker-select';
import {ArRequest, reqFileUpload} from '../../utills/Request';
import path from 'path';
import {AR_URL, DATA_URL} from '../../Constant';

type SizeInfoScreenRouteProp = RouteProp<RootStackParamList, 'SizeInfoScreen'>;
type SizeInfoScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'SizeInfoScreen'
>;

const SizeInfoScreen: React.FC = () => {
  const route = useRoute<SizeInfoScreenRouteProp>();
  const navigation = useNavigation<SizeInfoScreenNavigationProp>();
  const {userEmail} = useUser();
  const {photoUri} = route.params;
  const [isUploading, setIsUploading] = useState(false);
  const [imageWidth, setImageWidth] = useState(300); // 초기 값 설정
  const [isModalVisible, setIsModalVisible] = useState(false); // 모달 상태 관리

  //TODO: 테스트 시 useState 값을 photoUri 로 해놓으셈
  const [meaPhotoUri, setMeaPhotoUri] = useState<string | undefined>(undefined); //의류측정 uri

  const generateTimestampedName = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
    return `photo_${year}${month}${day}T${hours}${minutes}${seconds}${milliseconds}Z.jpg`;
  };

  // 핏보관함 저장시 이미지 업로드 부분
  const handleUploadImage = async () => {
    if (!meaPhotoUri) {
      Alert.alert('알림', '카테고리를 선택하여 측정을 진행 해 주세요');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    const timestampedName = generateTimestampedName();

    formData.append('userEmail', userEmail);
    formData.append('image', {
      uri: meaPhotoUri,
      type: 'image/jpeg',
      name: timestampedName,
    });

    const response = await reqFileUpload(
      path.join(DATA_URL, 'api', 'fitStorageImages', 'upload'),
      formData,
    );

    console.log('Uploading image:', timestampedName);
    console.log('Upload result:', response.data);

    if (response.ok) {
      Alert.alert('성공', '사진이 핏 보관함에 저장되었습니다.');
      navigation.reset({
        index: 1,
        routes: [{name: 'Main'}, {name: 'Fit_box', params: {fromUpload: true}}],
      });
    } else {
      Alert.alert('업로드 실패', response.data || '업로드에 실패했습니다.');
    }

    setIsUploading(false);
  };

  // 카테고리 지정하면 오프라인 의류측정 시작
  const handleCatagory = async (value: string) => {
    if (meaPhotoUri) {
      setMeaPhotoUri(undefined);
    }
    setIsUploading(true);
    const formData = new FormData();
    const timestampedName = generateTimestampedName();

    formData.append('clothesImg', {
      uri: photoUri,
      type: 'image/png',
      name: timestampedName,
    });
    formData.append('clothesType', value);

    const response = await ArRequest(path.join(AR_URL, 'clothesmea'), formData);

    if (!response.ok) {
      const data = await response.json();
      if (data.detail === 'not_detection_card') {
        Alert.alert('의류 측정 실패', '사진에서 카드를 감지하지 못했습니다.');
      } else {
        Alert.alert('의류 측정 실패', JSON.stringify(data));
      }

      setIsUploading(false);
    } else {
      const blob = await response.blob();

      const fileReaderInstance = new FileReader();
      fileReaderInstance.readAsDataURL(blob);
      fileReaderInstance.onload = () => {
        const base64data = fileReaderInstance.result;
        setMeaPhotoUri(base64data as string);
      };
    }

    setIsUploading(false);
  };

  // 핏 코멘트 이동시 이미지 업로드 부분
  const goToWritePage = async () => {
    if (!meaPhotoUri) {
      Alert.alert('알림', '카테고리를 선택하여 측정을 진행 해 주세요');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    const timestampedName = generateTimestampedName();

    formData.append('userEmail', userEmail);
    formData.append('image', {
      uri: meaPhotoUri,
      type: 'image/jpeg',
      name: timestampedName,
    });

    const response = await reqFileUpload(
      path.join(DATA_URL, 'api', 'fitStorageImages', 'upload'),
      formData,
    );

    console.log('Uploading image:', timestampedName);
    console.log('Upload result:', response.data);

    if (response.ok) {
      // `uploadedImageName` 전달
      navigation.navigate('WritePage', {uploadedImageName: timestampedName});
    } else {
      Alert.alert('이미지 업로드 실패', '이미지를 업로드할 수 없습니다.');
    }

    setIsUploading(false);
  };

  const handleImageLayout = (event: LayoutChangeEvent) => {
    const {width} = event.nativeEvent.layout;
    setImageWidth(width);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>사이즈 정보를 알려드릴게요</Text>

      {/* 터치시 모달로 보여주게 */}
      <TouchableOpacity
        style={styles.imageContainer}
        onPress={() => setIsModalVisible(true)}>
        <Image
          source={{uri: meaPhotoUri || photoUri}}
          style={styles.image}
          onLayout={handleImageLayout}
        />
      </TouchableOpacity>

      {/* 모달 */}
      <Modal visible={isModalVisible} transparent={true}>
        <TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContent}>
              <Image
                source={{uri: meaPhotoUri || photoUri}}
                style={styles.modalImage}
                resizeMode="contain"
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>카테고리</Text>
        <RNPickerSelect
          onValueChange={handleCatagory}
          items={[
            {label: '반팔', value: '반팔'},
            {label: '긴팔', value: '긴팔'},
            {label: '반팔 아우터', value: '반팔 아우터'},
            {label: '긴팔 아우터', value: '긴팔 아우터'},
            {label: '조끼', value: '조끼'},
            {label: '슬링', value: '슬링'},
            {label: '반바지', value: '반바지'},
            {label: '긴바지', value: '긴바지'},
            {label: '치마', value: '치마'},
            {label: '반팔 원피스', value: '반팔 원피스'},
            {label: '긴팔 원피스', value: '긴팔 원피스'},
            {label: '조끼 원피스', value: '조끼 원피스'},
            {label: '슬링 원피스', value: '슬링 원피스'},
          ]}
          placeholder={{
            label: '카테고리를 선택하세요',
            value: null,
          }}
        />
      </View>

      <View style={styles.line} />

      <View style={[styles.buttonContainer, {width: imageWidth}]}>
        {isUploading ? (
          <View style={meaPhotoUri ? styles.button : {...styles.buttonDisable}}>
            <ActivityIndicator size="small" color="#fff" />
          </View>
        ) : (
          <TouchableOpacity
            style={meaPhotoUri ? styles.button : {...styles.buttonDisable}}
            onPress={handleUploadImage}>
            <Text style={styles.buttonText}>사진 보관하기</Text>
          </TouchableOpacity>
        )}

        {isUploading ? (
          <View style={meaPhotoUri ? styles.button : {...styles.buttonDisable}}>
            <ActivityIndicator size="small" color="#fff" />
          </View>
        ) : (
          <TouchableOpacity
            style={meaPhotoUri ? styles.button : {...styles.buttonDisable}}
            onPress={goToWritePage}>
            <Text style={styles.buttonText}>다른 사람들과 사진 공유하기 →</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: width * 0.03,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  title: {
    textAlign: 'left',
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#000',
    alignSelf: 'flex-start',
    marginLeft: width * 0.08,
    marginBottom: height * 0.02,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: height * 0.02,
  },
  image: {
    width: width * 0.9,
    height: height * 0.5,
    resizeMode: 'contain',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: height * 0.018,
    marginVertical: height * 0.01,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: height * 0.015,
    width: width * 0.8,
  },
  buttonDisable: {
    backgroundColor: '#EBEBE4',
    paddingVertical: height * 0.018,
    marginVertical: height * 0.01,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: height * 0.015,
    width: width * 0.8,
  },
  buttonText: {
    color: '#fff',
    fontSize: width * 0.042,
    fontWeight: 'bold',
  },
  inputContainer: {
    width: width * 0.8,
  },
  picker: {
    backgroundColor: 'red',
    padding: 0,
    margin: 0,
  },
  label: {
    paddingLeft: 15,
    paddingRight: 15,
    fontSize: 16,
    marginBottom: '1%',
    color: '#000',
    fontWeight: 'bold',
  },
  line: {
    height: 1,
    backgroundColor: '#E9E9E9',
    marginVertical: '2%',
    marginBottom: '3%',
  },

  // 모달 설정
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // 반투명 배경
  },
  modalContent: {
    width: '90%',
    height: '70%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
});

export default SizeInfoScreen;
