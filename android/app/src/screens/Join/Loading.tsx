import React, {useEffect} from 'react';
import {
  Text,
  StyleSheet,
  View,
  BackHandler,
  ToastAndroid,
  Dimensions,
  Image,
} from 'react-native';
import {RootStackParamList} from '../../../../../App';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {ArRequest, reqPost} from '../../utills/Request';
import path from 'path';
import {AR_URL, DATA_URL} from '../../Constant';
import {useUser} from '../UserContext';

const {width} = Dimensions.get('window');

type LodingRouteProp = RouteProp<RootStackParamList, 'Loading'>;

type MEAType = {
  fileName: string;
  result: {
    armSize: number;
    shoulderSize: number;
    bodySize: number;
    legSize: number;
  };
};

const workMEA = async (uri: string, userHeight: number) => {
  // 요청 FormData 만들기
  const formData = new FormData();
  const name = uri.split('/').pop();

  formData.append('anaFile', {
    uri: uri,
    name: name,
    type: 'image/jpeg',
  } as FormDataValue);
  formData.append('personKey', userHeight);

  const res = await ArRequest(path.join(AR_URL, 'bodymea'), formData);

  return {
    status: res.status,
    data: await res.json(),
  };
};

const saveDB = async (meaResult: MEAType, userEmail: string) => {
  const req = await reqPost(path.join(DATA_URL, 'api', 'userForm'), {
    ...meaResult,
    userEmail: userEmail,
  });

  console.log(req);
};

export default function Loading() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<LodingRouteProp>();
  const context = useUser();

  useEffect(() => {
    // 백버튼 막기
    const handler = BackHandler.addEventListener('hardwareBackPress', () => {
      return true;
    });

    workMEA(route.params.uri, context.userHeight)
      .then(res => {
        const message = res.data as MEAType;
        console.log(message);

        if (res.status === 200) {
          saveDB(message, context.userEmail).then(() => {
            if (route.params.isfirst) {
              if (context.userGender === 'female') {
                navigation.replace('Style_G');
              } else {
                navigation.replace('Style_B');
              }
            } else {
              navigation.replace('My_Fit');
            }
          });
        } else {
          let err = '';
          switch ((message as any).detail) {
            case 'not_detection':
              err = '사람감지에 실패하였습니다!';
              break;
            case 'many_detection':
              err =
                '여러 사람이 감지되었습니다. 혼자 나온 사진을 제시해 주세요';
              break;
            default:
              err = '채형 측정에 실패하였습니다!';
              break;
          }

          navigation.goBack();
          ToastAndroid.show(err, ToastAndroid.SHORT);
        }
      })
      .catch(_ => {
        navigation.goBack();
        ToastAndroid.show(
          '채형측정 서버에서 오류가 발생했습니다!',
          ToastAndroid.SHORT,
        );
      });

    return () => handler.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/img/join/loading.png')}
        style={styles.image}
      />
      <Text style={styles.text}>체형 측정 진행중 ···</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  image: {
    width: width * 0.4,
    height: width * 0.4,
    resizeMode: 'contain',
  },
  text: {
    marginTop: 20,
    fontSize: width * 0.05,
    color: '#000000',
  },
});
