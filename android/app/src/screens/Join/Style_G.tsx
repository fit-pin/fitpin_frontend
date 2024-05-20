import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import {RootStackParamList} from '../../../../../App';
import {useNavigation} from '@react-navigation/native';

const congratsImages = [
  require('../../assets/img/join/style_g/1.png'),
  require('../../assets/img/join/style_g/2.png'),
  require('../../assets/img/join/style_g/3.png'),
  require('../../assets/img/join/style_g/4.png'),
];

type StyleGNavigationProp = StackNavigationProp<RootStackParamList, 'Style_G'>;

export default function Style_G() {
  const navigation = useNavigation<StyleGNavigationProp>();
  const styleTexts = ['스트릿', '레트로', '미니멀', '빈티지'];
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
          <TouchableOpacity style={styles.rectangleContainer}>
            <Text style={styles.styleText}>#오버핏</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rectangleContainer}>
            <Text style={styles.styleText}>#정핏</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rectangleContainer}>
            <Text style={styles.styleText}>#슬림핏</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.line} />
        <Text style={styles.fitText2}>스타일</Text>
        <View style={styles.rectangleRow2}>
          {styleTexts.map((item, index) => (
            <View key={item} style={styles.rectangleContainer2}>
              <Image source={congratsImages[index]} style={styles.imageStyle} />
              <Text style={styles.rectangleText}>#{item}</Text>
            </View>
          ))}
        </View>
        <TouchableOpacity
          style={styles.longButton}
          onPress={() => navigation.navigate('Congrats')}>
          <Text style={styles.longButtonText}>2개 이상 선택하기</Text>
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
    top: '17%',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'left',
  },
  rectangleRow: {
    position: 'relative',
    marginHorizontal: '10%',
    top: '28%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rectangleContainer: {
    position: 'relative',
    top: '2%',
    width: '30%',
    height: 38,
    backgroundColor: '#FFFFFF',
    borderColor: '#CECECE',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  styleText: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
  },
  rectangleRow2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: '5%',
    marginTop: '44%',
  },
  rectangleContainer2: {
    position: 'relative',
    width: '45%',
    height: 250,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    overflow: 'hidden',
    padding: '5%',
    margin: '2%',
  },
  rectangleText: {
    fontSize: 15,
    color: '#000',
    textAlign: 'right',
    top: '5%',
    right: '35%',
    fontWeight: 'bold',
  },
  line: {
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    top: '15%',
    width: '100%',
  },
  longButton: {
    marginHorizontal: '8%',
    backgroundColor: '#000',
    width: '85%',
    height: '5.5%',
    borderRadius: 31,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '15%',
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
