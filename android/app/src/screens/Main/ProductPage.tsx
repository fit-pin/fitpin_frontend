/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  TouchableWithoutFeedback, // 모달 외부 터치 감지용
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import {RootStackParamList} from '../../../../../App.tsx';
import {StackNavigationProp} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';
import {AR_URL, DATA_URL} from '../../Constant.ts';
import path from 'path';
import {ArRequest, reqGet, reqPost} from '../../utills/Request.ts';
import {useUser} from '../UserContext.tsx';

type ProductPageoNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ProductPage'
>;

const ProductPage = () => {
  const navigation = useNavigation<ProductPageoNavigationProp>();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [length, setLength] = useState(0);
  const [shoulder, setShoulder] = useState(0);
  const [chest, setChest] = useState(0);
  const [sleeve, setSleeve] = useState(0);
  const [isTailoringChecked, setIsTailoringChecked] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false); // 모달 상태 관리
  const [PordimgUri, setProdUri] = useState<string>(''); // 제품 페이지 uri 관리
  const [tryimgUri, settryimgUri] = useState<string>(''); // 입어보기 uri 관리
  const [productInfo, setProductInfo] = useState<{
    itemKey: number;
    itemName: string;
    itemBrand: string;
    itemType: string;
    itemStyle: string;
    itemPrice: number;
    itemContent: string;
    itemTopInfo: {
      itemSize: string;
      itemHeight: number;
      itemShoulder: number;
      itemArm: number;
      itemChest: number;
      itemSleeve: number;
    };
    itemBottomInfo: any;
    itemImgName: string;
  }>({
    itemKey: 0,
    itemName: '',
    itemBrand: '',
    itemType: '',
    itemStyle: '',
    itemPrice: 0,
    itemContent: '',
    itemTopInfo: {
      itemSize: '',
      itemHeight: 0,
      itemShoulder: 0,
      itemArm: 0,
      itemChest: 0,
      itemSleeve: 0,
    },
    itemBottomInfo: null,
    itemImgName: '',
  });

  const {userHeight, userEmail} = useUser();

  const handleIncrementLength = () => setLength(length + 1);
  const handleDecrementLength = () => length > 0 && setLength(length - 1);
  const handleIncrementShoulder = () => setShoulder(shoulder + 1);
  const handleDecrementShoulder = () =>
    shoulder > 0 && setShoulder(shoulder - 1);
  const handleIncrementChest = () => setChest(chest + 1);
  const handleDecrementChest = () => chest > 0 && setChest(chest - 1);
  const handleIncrementSleeve = () => setSleeve(sleeve + 1);
  const handleDecrementSleeve = () => sleeve > 0 && setSleeve(sleeve - 1);
  const handleSizeSelect = (size: string) => setSelectedSize(size);
  const [qty, setQty] = useState(1);

  // 수량
  const handleIncrementQty = () => setQty(qty + 1);
  const handleDecrementQty = () => qty > 1 && setQty(qty - 1);

  // 모달 열기
  const openModal = () => {
    setIsModalVisible(true);
  };

  // 모달 닫기
  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handleAddToCart = async () => {
    if (!selectedSize) {
      Alert.alert('사이즈를 선택해 주세요.');
      return;
    }
    const body = {
      itemKey: productInfo.itemKey,
      userEmail: userEmail,
      itemName: productInfo.itemName,
      itemSize: selectedSize || '',
      itemType: productInfo.itemType,
      itemPrice: productInfo.itemPrice,
      pit: 1,
      qty: qty,
    };

    try {
      const res = await reqPost(
        path.join(DATA_URL, 'api', 'cart', 'store'),
        body,
      );

      if (res.message === '장바구니에 상품이 성공적으로 추가되었습니다.') {
        Alert.alert('장바구니에 담았습니다');
      } else {
        Alert.alert('장바구니에 담는 데 실패했습니다. 다시 시도해 주세요.');
      }
    } catch (error) {
      console.error('장바구니에 추가하는 도중 오류가 발생했습니다:', error);
      Alert.alert('장바구니에 담는 도중 오류가 발생했습니다.');
    }
  };

  const handlePurchase = () => {
    if (!selectedSize) {
      Alert.alert('사이즈를 선택해 주세요.');
      return;
    }

    const purchaseData = {
      itemKey: productInfo.itemKey,
      userEmail: userEmail,
      itemName: productInfo.itemName,
      itemSize: selectedSize,
      itemType: productInfo.itemType,
      itemPrice: productInfo.itemPrice,
      pit: 1,
    };

    // 결제 페이지로 데이터를 전달합니다
    navigation.navigate('Order', {purchaseData});
  };
  // 상품 정보 가져오기
  const fetchProductData = async () => {
    // 제품 상세 정보 요청
    const productRes = await reqGet(
      path.join(DATA_URL, 'api', 'item-info', '1'),
    );

    // 오류 체크 콘솔 로그
    console.log('Product response:', productRes);

    // productInfo 업데이트
    setProductInfo({
      itemKey: productRes.itemKey,
      itemName: productRes.itemName,
      itemBrand: productRes.itemBrand,
      itemType: productRes.itemType,
      itemStyle: productRes.itemStyle,
      itemPrice: productRes.itemPrice,
      itemContent: productRes.itemContent,
      itemTopInfo: {
        itemSize: productRes.itemTopInfo.itemSize,
        itemHeight: productRes.itemTopInfo.itemHeight,
        itemShoulder: productRes.itemTopInfo.itemShoulder,
        itemArm: productRes.itemTopInfo.itemArm,
        itemChest: productRes.itemTopInfo.itemChest,
        itemSleeve: productRes.itemTopInfo.itemSleeve,
      },
      itemBottomInfo: productRes.itemBottomInfo,
      itemImgName: productRes.itemImgName[0],
    });

    setProdUri(
      path.join(
        DATA_URL,
        'api',
        'img',
        'imgserve',
        'itemimg',
        productRes.itemImgName[0],
      ),
    );
  };

  // 가상피팅 이미지 가져오기
  const handleSetimg = async (fileName: string) => {
    const formData = new FormData();

    if (!userEmail || !userHeight) {
      console.log('이메일, 유저키 없음');
      throw Error('이메일, 유저키 없음');
    }

    const reqfile = await reqGet(
      path.join(DATA_URL, 'api', 'userForm', userEmail),
    );

    formData.append('clothesImg', {
      uri: path.join(DATA_URL, 'api', 'img', 'imgserve', 'itemimg', fileName),
      name: fileName,
      type: 'image/jpeg',
    } as FormDataValue);

    formData.append('bodyFileName', reqfile.fileName);
    // TODO: 백엔드 서버 의류타입 확인 필요
    formData.append('category', '상의');

    const res = await ArRequest(path.join(AR_URL, 'try-on'), formData);
    if (!res.ok) {
      throw Error(JSON.stringify(await res.json()));
    }
    const blob = await res.blob();

    const fileReaderInstance = new FileReader();
    fileReaderInstance.readAsDataURL(blob);
    fileReaderInstance.onload = () => {
      const base64data = fileReaderInstance.result;
      settryimgUri(base64data as string);
    };
  };

  useEffect(() => {
    fetchProductData().catch(e => {
      console.error(`제품 이미지 로드 오류: ${e}`);
    });
  }, []);

  useEffect(() => {
    if (productInfo.itemImgName && PordimgUri) {
      handleSetimg(productInfo.itemImgName).catch(e => {
        console.log(`가상 피팅 오류: ${e}`);
        settryimgUri(PordimgUri);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productInfo.itemImgName, PordimgUri]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.platformName}>{productInfo.itemBrand}</Text>
        <View style={styles.cartButtonWrapper}>
          <TouchableOpacity
            style={styles.cartButton}
            onPress={() => navigation.navigate('Cart')}>
            <Image
              source={require('../../assets/img/main/product/basket.png')}
              style={styles.cartImage}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* 제품 이미지 */}
      <View style={styles.roundedRect}>
        {PordimgUri ? (
          <Image source={{uri: PordimgUri}} style={styles.productImage} />
        ) : (
          <></>
        )}
      </View>

      {/* 제품 설명 */}
      <Text style={styles.brandName}>{productInfo.itemBrand}</Text>
      <Text style={styles.productName}>{productInfo.itemName}</Text>
      <Text style={styles.price}>
        ₩{productInfo.itemPrice.toLocaleString()}
      </Text>
      <Text style={styles.description}>{productInfo.itemContent}</Text>

      {/* 사이즈 선택 */}
      <View style={styles.sizeContainer}>
        <Text style={styles.sizeTitle}>Select Size</Text>
        <View style={styles.sizeButtons}>
          {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
            <TouchableOpacity
              key={size}
              style={[
                styles.sizeButton,
                selectedSize === size && styles.selectedSizeButton,
              ]}
              onPress={() => handleSizeSelect(size)}>
              <Text
                style={[
                  styles.sizeButtonText,
                  selectedSize === size && styles.selectedSizeButtonText,
                ]}>
                {size}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      {/* 사이즈 표 */}
      <View style={styles.sizeChartContainer}>
        <View style={styles.sizeChartHeader}>
          {['Size', 'Height', 'Shoulder', 'Arm', 'Chest', 'Sleeve'].map(
            (header, index) => (
              <Text key={index} style={styles.sizeChartHeaderText}>
                {header}
              </Text>
            ),
          )}
        </View>
        <View style={styles.sizeChartRow}>
          <Text style={styles.sizeChartRowTitle}>
            {productInfo.itemTopInfo.itemSize}
          </Text>
          <Text style={styles.sizeChartRowText}>
            {productInfo.itemTopInfo.itemHeight}
          </Text>
          <Text style={styles.sizeChartRowText}>
            {productInfo.itemTopInfo.itemShoulder}
          </Text>
          <Text style={styles.sizeChartRowText}>
            {productInfo.itemTopInfo.itemArm}
          </Text>
          <Text style={styles.sizeChartRowText}>
            {productInfo.itemTopInfo.itemChest}
          </Text>
          <Text style={styles.sizeChartRowText}>
            {productInfo.itemTopInfo.itemSleeve}
          </Text>
        </View>
      </View>

      {/* 줄 */}
      <View style={styles.divider} />

      {/* 사이즈 추천 */}
      <View style={styles.customFitContainer}>
        <Text style={styles.customFitTitle}>체형에 맞는 사이즈 추천이에요</Text>
        <Text style={styles.originalSize}>원래 사이즈</Text>
        <View style={styles.sizeChartRow2}>
          <Text style={styles.sizeChartRowText}>
            {productInfo.itemTopInfo.itemSize}
          </Text>
          <Text style={styles.sizeChartRowText}>
            {productInfo.itemTopInfo.itemHeight}
          </Text>
          <Text style={styles.sizeChartRowText}>
            {productInfo.itemTopInfo.itemShoulder}
          </Text>
          <Text style={styles.sizeChartRowText}>
            {productInfo.itemTopInfo.itemArm}
          </Text>
          <Text style={styles.sizeChartRowText}>
            {productInfo.itemTopInfo.itemChest}
          </Text>
          <Text style={styles.sizeChartRowText}>
            {productInfo.itemTopInfo.itemSleeve}
          </Text>
        </View>
        <Text style={styles.originalSize}>추천 사이즈</Text>
        <View style={styles.sizeChartRow2}>
          {/* 예시 데이터 */}
          <Text style={styles.sizeChartCell}>90</Text>
          <Text style={styles.sizeChartCell}>71</Text>
          <Text style={styles.sizeChartCell}>90</Text>
          <Text style={styles.sizeChartCell}>43</Text>
          <Text style={styles.sizeChartCell}>50</Text>
          <Text style={styles.sizeChartCell}>64</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* 수선 */}
      <View style={styles.tailoringSection}>
        <View style={styles.checkboxContainer}>
          <Text style={styles.label}>수선하기</Text>
          <CheckBox
            value={isTailoringChecked}
            onValueChange={setIsTailoringChecked}
            tintColors={{true: '#1A16FF', false: '#1A16FF'}}
            style={styles.checkbox}
          />
        </View>
        <Text style={styles.tryOnText}>입어보기</Text>
        {/* 수선 이미지 클릭 시 모달 */}
        <TouchableOpacity onPress={openModal}>
          <View style={styles.roundedRect}>
            {tryimgUri ? (
              <Image source={{uri: tryimgUri}} style={styles.productImage} />
            ) : (
              <></>
            )}
          </View>
        </TouchableOpacity>

        {/* 모달 */}
        <Modal visible={isModalVisible} transparent={true}>
          <TouchableWithoutFeedback onPress={closeModal}>
            <View style={styles.modalBackground}>
              <View style={styles.modalContent}>
                {tryimgUri ? (
                  <Image
                    source={{uri: tryimgUri}}
                    style={styles.modalImage}
                    resizeMode="contain"
                  />
                ) : (
                  <></>
                )}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {isTailoringChecked && (
          <View>
            <View style={{flexDirection: 'row'}}>
              {/* 총장 부분 */}
              <View style={styles.buttoncontainer}>
                <View style={styles.buttontitleContainer}>
                  <Text style={styles.buttontitle}>총장 :</Text>
                  <View style={styles.buttoncontainer2}>
                    <TouchableOpacity
                      onPress={handleDecrementLength}
                      style={styles.button}>
                      <Text style={styles.buttonText}> - </Text>
                    </TouchableOpacity>
                    <Text style={styles.buttonText2}>{length}</Text>
                    <TouchableOpacity
                      onPress={handleIncrementLength}
                      style={styles.button}>
                      <Text style={styles.buttonText}> + </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* 어깨 부분 */}
              <View style={[styles.buttoncontainer, {marginLeft: '14%'}]}>
                <View style={styles.buttontitleContainer}>
                  <Text style={styles.buttontitle}>어깨 :</Text>
                  <View style={styles.buttoncontainer2}>
                    <TouchableOpacity
                      onPress={handleDecrementShoulder}
                      style={styles.button}>
                      <Text style={styles.buttonText}> - </Text>
                    </TouchableOpacity>
                    <Text style={styles.buttonText2}>{shoulder}</Text>
                    <TouchableOpacity
                      onPress={handleIncrementShoulder}
                      style={styles.button}>
                      <Text style={styles.buttonText}> + </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>

            <View style={{flexDirection: 'row'}}>
              {/* 가슴 부분 */}
              <View style={styles.buttoncontainer}>
                <View style={styles.buttontitleContainer}>
                  <Text style={styles.buttontitle}>가슴 :</Text>
                  <View style={styles.buttoncontainer2}>
                    <TouchableOpacity
                      onPress={handleDecrementChest}
                      style={styles.button}>
                      <Text style={styles.buttonText}> - </Text>
                    </TouchableOpacity>
                    <Text style={styles.buttonText2}>{chest}</Text>
                    <TouchableOpacity
                      onPress={handleIncrementChest}
                      style={styles.button}>
                      <Text style={styles.buttonText}> + </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* 소매 부분 */}
              <View
                style={[
                  styles.buttoncontainer,
                  {marginLeft: '14%', marginTop: '1%'},
                ]}>
                <View style={styles.buttontitleContainer}>
                  <Text style={styles.buttontitle}>소매 :</Text>
                  <View style={styles.buttoncontainer2}>
                    <TouchableOpacity
                      onPress={handleDecrementSleeve}
                      style={styles.button}>
                      <Text style={styles.buttonText}> - </Text>
                    </TouchableOpacity>
                    <Text style={styles.buttonText2}>{sleeve}</Text>
                    <TouchableOpacity
                      onPress={handleIncrementSleeve}
                      style={styles.button}>
                      <Text style={styles.buttonText}> + </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.customButton}>
              <Text style={styles.customButtonText}>수선하기</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.quantityContainer}>
        <Text style={styles.quantityLabel}>수량:</Text>
        <View style={styles.quantityControls}>
          <TouchableOpacity
            onPress={handleDecrementQty}
            style={styles.quantityButton}>
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{qty}</Text>
          <TouchableOpacity
            onPress={handleIncrementQty}
            style={styles.quantityButton}>
            <Text style={styles.quantityButtonText2}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 아래 버튼 */}
      <View style={styles.bottomSection}>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.cartButtonBottom}
            onPress={handleAddToCart}>
            <Text style={styles.cartButtonText}>장바구니 담기</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buyButton} onPress={handlePurchase}>
            <Text style={styles.buyButtonText}>바로 구매</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: '6%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  platformName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  cartButtonWrapper: {
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#F4F4F4',
    padding: '1.5%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartButton: {
    padding: 3,
  },
  cartImage: {
    width: 24,
    height: 24,
  },
  imageWrapper: {
    width: '100%',
  },
  productImage: {
    width: '70%',
    height: 250,
  },
  brandName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#A2A2A2',
    marginTop: '3%',
  },
  productName: {
    fontSize: 20,
    color: '#000',
    marginVertical: '2%',
    fontWeight: 'bold',
  },
  price: {
    fontSize: 16,
    marginVertical: '0.7%',
    color: '#1A16FF',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginVertical: '2%',
  },
  sizeContainer: {
    marginVertical: '2%',
  },
  sizeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: '3%',
    color: '#000',
  },
  sizeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sizeButton: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: '2%',
    flex: 1,
    marginHorizontal: '0.8%',
  },
  sizeButtonText: {
    fontSize: 14,
    textAlign: 'center',
  },
  sampleImage: {
    width: '105%',
    height: 200,
    marginVertical: '2%',
    right: '2%',
  },
  divider: {
    height: 1,
    backgroundColor: '#C5C5C5',
    marginVertical: '4%',
  },
  customFitTitle: {
    fontSize: 20,
    color: '#000',
    fontWeight: 'bold',
    marginVertical: '1%',
  },
  originalSize: {
    fontSize: 14,
    color: '#000',
    marginVertical: '2.5%',
    marginRight: '72%',
  },
  sizeChart: {
    width: '100%',
    height: 20,
    marginVertical: '2%',
  },
  tailoringSection: {
    marginVertical: '1%',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '1%',
  },
  checkbox: {
    marginRight: 8,
  },
  label: {
    fontSize: 20,
    color: '#000',
    fontWeight: 'bold',
  },
  tryOnText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    left: '2%',
    marginTop: '3%',
  },
  roundedRect: {
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#F4F4F4',
    padding: '2%',
    alignItems: 'center',
    marginTop: '5%',
    height: 260,
  },
  innerImage: {
    width: '50%',
    height: 250,
  },
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
  buttoncontainer: {
    top: '30%',
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: '2%',
    width: '40%',
  },
  buttontitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttontitle: {
    color: '#000',
    fontSize: 19,
    fontWeight: 'bold',
    marginRight: '15%',
  },
  buttoncontainer2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#000',
    paddingVertical: '1%',
    paddingHorizontal: '3%',
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: '1%',
    paddingHorizontal: '3%',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#fff',
  },
  buttonText: {
    color: '#000',
    fontSize: 20,
    textAlign: 'center',
  },
  buttonText2: {
    color: '#000',
    fontSize: 20,
    marginHorizontal: '3%',
  },
  bottomSection: {
    alignItems: 'center',
    marginVertical: '8%',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  customButton: {
    flex: 1,
    padding: '2.5%',
    borderRadius: 5,
    backgroundColor: '#fff',
    alignItems: 'center',
    width: '100%',
    top: '17%',
    borderWidth: 1.5,
    borderColor: '#000',
    marginBottom: '4%',
  },
  customButtonText: {
    color: '#000',
    fontSize: 19,
    fontWeight: 'bold',
  },
  cartButtonBottom: {
    flex: 1,
    marginRight: '2%',
    padding: '4%',
    borderRadius: 10,
    backgroundColor: '#000',
    alignItems: 'center',
  },
  buyButton: {
    flex: 1,
    marginLeft: '2%',
    padding: '4%',
    borderRadius: 10,
    backgroundColor: '#000',
    alignItems: 'center',
  },
  cartButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  selectedSizeButton: {
    backgroundColor: '#000',
  },
  selectedSizeButtonText: {
    color: '#fff',
  },
  sizeChartContainer: {
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sizeChartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000',
  },
  sizeChartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    paddingVertical: 10,
    backgroundColor: '#f2f2f2',
  },
  sizeChartHeaderText: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  sizeChartRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  sizeChartRowTitle: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  sizeChartRowText: {
    flex: 1,
    textAlign: 'center',
  },
  customFitContainer: {
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sizeChartRow2: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    paddingVertical: 10,
  },
  sizeChartCell: {
    flex: 1,
    textAlign: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  quantityLabel: {
    fontSize: 18,
    color: '#000',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    padding: 5,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  quantityText: {
    width: 30,
    textAlign: 'center',
    fontSize: 20,
    color: '#000',
  },
  quantityButtonText: {
    fontSize: 20,
    color: '#000',
  },
  quantityButtonText2: {
    fontSize: 20,
    color: '#000',
  },
});

export default ProductPage;
