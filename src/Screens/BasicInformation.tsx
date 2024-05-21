import React, { useState } from 'react';
import { View, StyleSheet, Text, Pressable, TextInput, Image, Dimensions, TouchableOpacity } from 'react-native';

const { width, height } = Dimensions.get('window');

const Circle = () => (
  <View style={styles.circle} />
);

const App = () => {
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

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Circle />
        <Circle />
        <Circle />
        <Circle />
      </View>

      <Text style={styles.Basicstyle}>기본 정보를 알려주세요</Text>

      <Text style={styles.label}>성별</Text>

      <View style={styles.buttonRow}>
        <View style={styles.buttonContainer}>
          <Pressable
            style={[
              styles.circleButton,
              isFemaleSelected && styles.circleButtonSelected
            ]}
            onPress={handleFemalePress}
          >
            <Image source={require('../image/woman.png')} style={styles.icon} />
          </Pressable>
          <Text style={styles.genderLabel}>여성</Text>
        </View>
        <View style={styles.buttonContainer}>
          <Pressable
            style={[
              styles.circleButton,
              isMaleSelected && styles.circleButtonSelected
            ]}
            onPress={handleMalePress}
          >
            <Image source={require('../image/man.png')} style={styles.icon} />
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

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>계속하기</Text>
      </TouchableOpacity>
    </View>
  );
};

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
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
    marginLeft: width * 0.1,
  },

  circle: {
    width: width * 0.03,
    height: width * 0.03,
    borderRadius: width * 0.015,
    backgroundColor: '#d9d9d9',
    margin: width * 0.02,
    marginBottom: height * 0.05,
  },

  Basicstyle: {
    fontSize: width * 0.07,
    color: '#000000',
    alignSelf: 'flex-start',
    marginLeft: width * 0.1,
    marginBottom: height * 0.02,
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.03,
    marginBottom: height * 0.05,
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
  },

  button: {
    backgroundColor: '#000000',
    paddingVertical: height * 0.02, 
    paddingHorizontal: width * 0.1, 
    borderRadius: 31,
    marginTop: height * 0.02,                    
    width: '80%',
  },

  buttonText: {
    fontSize: width * 0.05,
    color: '#ffffff',
    textAlign: 'center',
  },
});

export default App;
