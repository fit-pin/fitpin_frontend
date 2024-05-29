/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import {RootStackParamList} from '../../../../../App.tsx';
import {StackNavigationProp} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';

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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.platformName}>Musinsa</Text>
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
        <Image
          source={require('../../assets/img/main/top/top1.png')}
          style={styles.productImage}
        />
      </View>

      {/* 제품 설명 */}
      <Text style={styles.brandName}>폴로 랄프 로렌</Text>
      <Text style={styles.productName}>데님 셔츠 - 블루</Text>
      <Text style={styles.price}>₩219,000</Text>
      <Text style={styles.description}>
        부드러운 촉감을 위해 미디엄 워싱 처리된 데님 셔츠로, 코튼 트윌 소재로
        제작되었으며 핸드샌드 처리되어 처음 입을 때부터 편안한 착용감과 빈티지
        스타일을 선사합니다. 멀티 컬러 포니를 섬세하게 자수 처리하여 아이코닉한
        룩을 완성했습니다.
      </Text>

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

      {/* 사이즈 표 큰거 */}
      <View style={styles.imageWrapper}>
        <Image
          source={require('../../assets/img/main/product/size_big.png')}
          style={styles.sampleImage}
        />
      </View>

      {/* 줄 */}
      <View style={styles.divider} />

      {/* 사이즈 */}
      <Text style={styles.customFitTitle}>
        000님의 체형에 맞게 수선해드릴게요
      </Text>
      <Text style={styles.originalSize}>원래 사이즈</Text>
      <Image
        source={require('../../assets/img/main/product/size.png')}
        style={styles.sizeChart}
      />
      <Text style={styles.originalSize}>추천 사이즈</Text>
      <Image
        source={require('../../assets/img/main/product/size.png')}
        style={styles.sizeChart}
      />

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
        {/* 수선 이미지*/}
        <View style={styles.roundedRect}>
          <Image
            source={require('../../assets/img/main/top/top1.png')}
            style={styles.innerImage}
          />
        </View>
        {isTailoringChecked && (
          <View>
            {/* 수선 후 */}
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
                    <View>
                      <Text style={styles.buttonText2}>{length}</Text>
                    </View>
                    <TouchableOpacity
                      onPress={handleIncrementLength}
                      style={styles.button}>
                      <Text style={styles.buttonText}> + </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* 어깨 너비 부분 */}
              <View style={[styles.buttoncontainer, {marginLeft: '14%'}]}>
                <View style={styles.buttontitleContainer}>
                  <Text style={styles.buttontitle}>어깨 :</Text>
                  <View style={styles.buttoncontainer2}>
                    <TouchableOpacity
                      onPress={handleDecrementShoulder}
                      style={styles.button}>
                      <Text style={styles.buttonText}> - </Text>
                    </TouchableOpacity>
                    <View>
                      <Text style={styles.buttonText2}>{shoulder}</Text>
                    </View>
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
                    <View>
                      <Text style={styles.buttonText2}>{chest}</Text>
                    </View>
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
                    <View>
                      <Text style={styles.buttonText2}>{sleeve}</Text>
                    </View>
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

      {/* 아래 버튼 */}
      <View style={styles.bottomSection}>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.cartButtonBottom}
            onPress={() => navigation.navigate('Cart')}>
            <Text style={styles.cartButtonText}>장바구니 담기</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buyButton}
            onPress={() => navigation.navigate('Order')}>
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
    color: '#555',
    marginVertical: '2.5%',
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
});

export default ProductPage;
