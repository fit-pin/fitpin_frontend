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
          <View style={styles.rectangleContainer}>
            <Text style={styles.styleText}>#오버핏</Text>
          </View>
          <View style={styles.rectangleContainer}>
            <Text style={styles.styleText}>#정핏</Text>
          </View>
          <View style={styles.rectangleContainer}>
            <Text style={styles.styleText}>#슬림핏</Text>
          </View>
        </View>
        <View style={styles.line} />
        <Text style={styles.fitText}>스타일</Text>
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
    padding: 8,
  },
  pageButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 60,
    marginHorizontal: 24,
  },
  pageButton: {
    marginHorizontal: 5,
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
    marginHorizontal: 30,
    fontSize: 18,
    color: '#878787',
    textAlign: 'left',
    marginTop: 30,
    marginBottom: -25,
  },
  styleSelectionText: {
    marginHorizontal: 30,
    fontSize: 25,
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'left',
    marginTop: 55,
  },
  fitText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'left',
    marginHorizontal: 30,
    marginTop: 30,
  },
  rectangleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginHorizontal: 80,
    marginLeft: 30,
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
  },
  styleText: {
    fontSize: 18,
    color: '#000',
    textAlign: 'center',
  },
  rectangleRow2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 20,
  },
  rectangleContainer2: {
    width: 160,
    height: 230,
    backgroundColor: '#DFDFDF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    overflow: 'hidden',
    marginHorizontal: 10,
    marginBottom: 20,
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
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginTop: 20,
    width: '100%',
  },
});
