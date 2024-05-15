import React from 'react';
import {
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';

export default function Style_G() {
  const styleTexts = [
    '빈티지',
    '스트릿',
    '레트로',
    '미니멀',
    '러블리',
    '캐주얼',
    '스쿨룩',
    '유니섹스',
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.pageButtonContainer}>
          {[1, 2, 3, 4].map(pageNumber => (
            <TouchableOpacity
              key={pageNumber}
              style={[styles.pageButton, styles.activeButton]}>
              <View style={[styles.circle, styles.activeCircle]} />
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.analysisText}>
          <Text style={styles.blackText}>당신의 취향</Text>을 분석하고
        </Text>
        <Text style={styles.analysisText}>
          좋아할 만한 <Text style={styles.blackText}>스타일</Text>을
          추천해드릴게요!
        </Text>
        <Text style={styles.styleSelectionText}>스타일 선택</Text>
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
          {styleTexts.map(item => (
            <View key={item} style={styles.rectangleContainer2}>
              <View style={styles.rectangleTextContainer} />
              <Text style={styles.rectangleText}>#{item}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
  },
  pageButtonContainer: {
    position: 'relative',
    top: '20%',
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
    backgroundColor: '#000',
  },
  activeCircle: {
    backgroundColor: '#D9D9D9',
  },
  activeButton: {
    backgroundColor: 'transparent',
  },
  blackText: {
    color: '#000',
  },
  analysisText: {
    position: 'relative',
    marginHorizontal: '10%',
    fontSize: 18,
    color: '#878787',
    textAlign: 'left',
    top: '10%',
    bottom: '-2%',
  },
  styleSelectionText: {
    position: 'relative',
    marginHorizontal: '10%',
    top: '13%',
    fontSize: 25,
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'left',
  },
  fitText: {
    position: 'relative',
    marginHorizontal: '10%',
    top: '16%',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'left',
  },
  fitText2: {
    position: 'relative',
    marginHorizontal: '10%',
    top: '21%',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'left',
  },
  rectangleRow: {
    position: 'relative',
    marginHorizontal: '10%',
    top: '45%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rectangleContainer: {
    width: 88,
    height: 38,
    backgroundColor: '#FFFFFF',
    borderColor: '#CECECE',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginRight: '8%',
  },
  styleText: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
  },
  rectangleRow2: {
    position: 'relative',
    marginHorizontal: '10%',
    top: '58%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  rectangleContainer2: {
    position: 'relative',
    width: '45%',
    height: 200,
    backgroundColor: '#DFDFDF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: '5%',
    padding: '2%',
    margin: '2%',
  },
  rectangleTextContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rectangleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  line: {
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    top: '19%',
    width: '100%',
  },
});
