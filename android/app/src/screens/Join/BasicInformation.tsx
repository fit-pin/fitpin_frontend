// BasicInformation.js
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  TextInput,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {RootStackParamList} from '../../../../../App.tsx';

type BasicInformationNavigationProp = StackNavigationProp<
  RootStackParamList,
  'BasicInformation'
>;

const {width, height} = Dimensions.get('window');

interface CircleProps {
  isActive: boolean;
}

const Circle: React.FC<CircleProps> = ({isActive}) => (
  <View
    style={[styles.circle, isActive ? styles.blackCircle : styles.activeCircle]}
  />
);

export default function BasicInformation() {
  const navigation = useNavigation<BasicInformationNavigationProp>();
  const [isFemaleSelected, setIsFemaleSelected] = useState(false);
  const [isMaleSelected, setIsMaleSelected] = useState(false);

  const handleFemalePress = () => {
    setIsFemaleSelected(true);
    setIsMaleSelected(false);
  };

  const handleMalePress = () => {
    setIsFemaleSelected(false);
    setIsMaleSelected(true);
  };

  const handleContinuePress = () => {
    // 성별 선택 상태를 Body_photo 페이지로 전달
    navigation.navigate('Body_photo', {
      gender: isFemaleSelected ? 'female' : isMaleSelected ? 'male' : null,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.pageButtonContainer}>
        {[1, 2, 3, 4].map((pageNumber, index) => (
          <View key={pageNumber} style={styles.pageButton}>
            <Circle isActive={index === 0} />
          </View>
        ))}
      </View>

      <Text style={styles.Basicstyle}>기본 정보를 알려주세요</Text>

      <Text style={styles.label}>성별</Text>

      <View style={styles.buttonRow}>
        <View style={styles.buttonContainer}>
          <Pressable
            style={[
              styles.circleButton,
              isFemaleSelected && styles.circleButtonSelected,
            ]}
            onPress={handleFemalePress}>
            <Image
              source={require('../../assets/img/join/woman.png')}
              style={styles.icon}
            />
          </Pressable>
          <Text style={styles.genderLabel}>여성</Text>
        </View>
        <View style={styles.buttonContainer}>
          <Pressable
            style={[
              styles.circleButton,
              isMaleSelected && styles.circleButtonSelected,
            ]}
            onPress={handleMalePress}>
            <Image
              source={require('../../assets/img/join/man.png')}
              style={styles.icon}
            />
          </Pressable>
          <Text style={styles.genderLabel}>남성</Text>
        </View>
      </View>

      <TextInput
        style={styles.input}
        placeholder="키 (cm)"
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="몸무게 (kg)"
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.button} onPress={handleContinuePress}>
        <Text style={styles.buttonText}>계속하기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  label: {
    fontSize: width * 0.04,
    color: '#878787',
    alignSelf: 'flex-start',
    marginLeft: width * 0.15,
    marginTop: height * 0.02,
    top: '1%',
    left: '-4%',
  },
  pageButtonContainer: {
    position: 'relative',
    top: '-14%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    right: '14.5%',
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
  Basicstyle: {
    position: 'relative',
    top: '-2%',
    right: '19.5%',
    fontSize: 18,
    color: '#000',
    textAlign: 'left',
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    top: '4%',
  },
  buttonContainer: {
    alignItems: 'center',
    marginHorizontal: width * 0.05,
  },
  circleButton: {
    width: width * 0.2,
    height: width * 0.2,
    borderRadius: width * 0.1,
    backgroundColor: '#f6f6f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleButtonSelected: {
    borderColor: '#000000',
    borderWidth: 2,
  },
  icon: {
    width: width * 0.1,
    height: width * 0.1,
  },
  genderLabel: {
    marginTop: height * 0.01,
    fontSize: width * 0.04,
    color: '#000000',
  },
  input: {
    width: '80%',
    height: height * 0.07,
    backgroundColor: '#f4f4f4',
    borderRadius: 8,
    paddingHorizontal: width * 0.02,
    marginBottom: height * 0.03,
    alignSelf: 'center',
    top: '6%',
  },
  button: {
    backgroundColor: '#000000',
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.1,
    borderRadius: 31,
    width: '80%',
    height: '8%',
    top: '6%',
  },
  buttonText: {
    fontSize: width * 0.05,
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
