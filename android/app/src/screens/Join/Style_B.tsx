import React, {useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useUser} from '../UserContext';
import {RootStackParamList} from '../../../../../App';

const congratsImages = [
  require('../../assets/img/join/style_b/1.jpg'),
  require('../../assets/img/join/style_b/2.png'),
  require('../../assets/img/join/style_b/3.jpg'),
  require('../../assets/img/join/style_b/4.jpg'),
  require('../../assets/img/join/style_b/5.png'),
  require('../../assets/img/join/style_b/6.jpg'),
];

const checkmarkImage = require('../../assets/img/join/checkmark.png');

type StyleGNavigationProp = StackNavigationProp<RootStackParamList, 'Style_B'>;

export default function Style_B() {
  const navigation = useNavigation<StyleGNavigationProp>();
  const {setUserFit, setSelectedStyles} = useUser(); // Use context

  const styleTexts = [
    '스트릿',
    '빈티지',
    '캐주얼',
    '테일러',
    '아메카지',
    '에슬레저',
  ];

  const [selectedStyles, setLocalSelectedStyles] = useState<string[]>([]);
  const [selectedFit, setLocalSelectedFit] = useState<string | null>(null);

  const handleImagePress = (style: string) => {
    setLocalSelectedStyles(prevSelectedStyles => {
      let updatedStyles;
      if (prevSelectedStyles.includes(style)) {
        updatedStyles = prevSelectedStyles.filter(item => item !== style);
      } else {
        updatedStyles = [...prevSelectedStyles, style];
      }
      console.log('Updated Selected Styles:', updatedStyles);
      return updatedStyles;
    });
  };

  const handleFitPress = (fit: string) => {
    setLocalSelectedFit(prevFit => {
      const updatedFit = prevFit === fit ? null : fit;
      console.log('Updated Selected Fit:', updatedFit);
      return updatedFit;
    });
  };

  const isSelected = (style: string) => selectedStyles.includes(style);

  const handleButtonPress = () => {
    if (selectedStyles.length === 4 && selectedFit) {
      const sortedSelectedStyles = styleTexts.filter(style =>
        selectedStyles.includes(style),
      );
      console.log('Final Selected Styles:', sortedSelectedStyles);
      console.log('Final Selected Fit:', selectedFit);
      setSelectedStyles(sortedSelectedStyles); // 저장된 스타일들
      setUserFit(selectedFit); // 저장된 핏
      navigation.navigate('Congrats', {selectedStyles: sortedSelectedStyles});
    } else {
      Alert.alert('선택 오류', '4개의 스타일과 1개의 핏을 선택해주세요.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.pageButtonContainer}>
          {[1, 2, 3, 4].map((pageNumber, index) => (
            <TouchableOpacity
              key={pageNumber}
              style={[styles.pageButton, styles.activeButton]}>
              <View
                style={[
                  styles.circle,
                  index === 2 ? styles.blackCircle : styles.activeCircle,
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.styleSelectionText}>스타일 선택🔍</Text>
        <Text style={styles.analysisText}>
          <Text style={styles.blackText}>당신의 취향</Text>을 분석하고
        </Text>
        <Text style={styles.analysisText}>
          좋아할 만한 <Text style={styles.blackText}>스타일</Text>을
          추천해드릴게요!
        </Text>
        <Text style={styles.fitText}>핏</Text>
        <View style={styles.rectangleRow}>
          {['오버핏', '정핏', '슬림핏'].map(fit => (
            <TouchableOpacity
              key={fit}
              style={[
                styles.rectangleContainer,
                selectedFit === fit && styles.selectedFitContainer,
              ]}
              onPress={() => handleFitPress(fit)}>
              <Text style={styles.styleText}>#{fit}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.line} />
        <Text style={styles.fitText2}>스타일</Text>
        <View style={styles.rectangleRow2}>
          {styleTexts.map((item, index) => (
            <TouchableOpacity
              key={item}
              style={styles.rectangleContainer2}
              onPress={() => handleImagePress(item)}>
              <Image source={congratsImages[index]} style={styles.imageStyle} />
              <View style={styles.textContainer}>
                <Text style={styles.rectangleText}>#{item}</Text>
                {isSelected(item) && (
                  <Image
                    source={checkmarkImage}
                    style={styles.checkmarkStyle}
                  />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.longButton} onPress={handleButtonPress}>
          <Text style={styles.longButtonText}>4개 선택하기</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  pageButtonContainer: {
    position: 'relative',
    top: '7%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginHorizontal: '8.5%',
  },
  pageButton: {
    marginHorizontal: '2%',
  },
  circle: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  activeCircle: {
    backgroundColor: '#D9D9D9',
  },
  blackCircle: {
    backgroundColor: '#000',
  },
  activeButton: {
    backgroundColor: 'transparent',
  },
  blackText: {
    color: '#000',
  },
  styleSelectionText: {
    position: 'relative',
    marginHorizontal: '10%',
    top: '5%',
    fontSize: 25,
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'left',
  },
  analysisText: {
    position: 'relative',
    marginHorizontal: '10%',
    fontSize: 18,
    color: '#878787',
    textAlign: 'left',
    top: '7%',
    bottom: '-2%',
  },
  fitText: {
    position: 'relative',
    marginHorizontal: '10%',
    top: '10%',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'left',
  },
  fitText2: {
    position: 'relative',
    marginHorizontal: '10%',
    top: '15%',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'left',
  },
  rectangleRow: {
    position: 'relative',
    marginHorizontal: '10%',
    top: '32%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rectangleContainer: {
    position: 'relative',
    top: '5%',
    width: '30%',
    height: 38,
    backgroundColor: '#FFFFFF',
    borderColor: '#CECECE',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  selectedFitContainer: {
    borderColor: '#494949',
    borderWidth: 2,
  },
  styleText: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    top: '-3%',
  },
  rectangleRow2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: '5%',
    marginTop: '50%',
  },
  rectangleContainer2: {
    position: 'relative',
    width: '45%',
    height: 250,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderRadius: 20,
    overflow: 'hidden',
    padding: '5%',
    margin: '2%',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedContainer: {
    borderColor: '#D9D9D9',
    borderWidth: 2,
  },
  rectangleText: {
    fontSize: 15,
    color: '#000',
    textAlign: 'left',
    top: '6%',
    left: '5%',
    fontWeight: 'bold',
    marginBottom: '5%',
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkmarkStyle: {
    width: 22,
    height: 22,
    marginLeft: 5,
    top: '4%',
  },
  line: {
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    top: '13%',
    width: '100%',
  },
  longButton: {
    marginHorizontal: '8%',
    backgroundColor: '#000',
    width: '85%',
    height: '5%',
    borderRadius: 31,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '18%',
    bottom: '4.5%',
  },
  longButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  imageStyle: {
    width: '120%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 10,
  },
});
