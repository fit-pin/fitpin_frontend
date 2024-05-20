import React from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const App = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Fitpin.</Text>

      <Text style={styles.signupStyle}>회원가입</Text>
      
      <Text style={styles.label}>이름</Text>
      <TextInput style={styles.input} 
        placeholder="Name"
        keyboardType="default"
        autoCapitalize="none"
      />

      <Text style={styles.label}>이메일</Text>
      <View style={styles.inputWithButton}>
        <TextInput style={styles.inputWithButtonText} 
          placeholder="E-mail"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Pressable style={styles.verifyButton}>
          <Text style={styles.verifyButtonText}>인증하기</Text>
        </Pressable>
      </View>

      <Text style={styles.label}>비밀번호</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Password"
        secureTextEntry={true}
      />

      <Text style={styles.label}>비밀번호 확인</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Password"
        secureTextEntry={true}
      />

      <Pressable style={styles.button}>
        <Text style={styles.buttonText}>가입하기</Text>
      </Pressable>

      <View style={styles.transparentButtonContainer}>
        <Pressable>
          <Text style={styles.transparentButtonText}>로그인하러 가기</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: height * 0.02,
  },

  title: {
    fontSize: width * 0.12,
    color: '#000000',
    marginTop: height * 0.1,
    marginBottom: height * 0.07,
  },

  signupStyle: {
    fontSize: width * 0.06,
    color: '#000000',
    alignSelf: 'flex-start',
    marginLeft: width * 0.1,
  },

  label: {
    fontSize: width * 0.04,
    color: '#878787',
    alignSelf: 'flex-start',
    marginLeft: width * 0.1,
    marginTop: height * 0.02,
    marginBottom: height * 0.01,
  },

  input: {
    width: '73%',
    height: height * 0.07,
    borderWidth: 1, 
    borderColor: '#c7c7c7', 
    borderRadius: 10,
    paddingHorizontal: width * 0.02,
  },

  button: {
    backgroundColor: '#000000',
    paddingVertical: height * 0.02, 
    paddingHorizontal: width * 0.1, 
    borderRadius: 31,
    marginTop: height * 0.04,                    
    width: '80%',
  },

  buttonText: {
    fontSize: width * 0.05,
    color: '#ffffff',
    textAlign: 'center',
  },

  transparentButtonContainer: {
    width: '73%',
    alignItems: 'flex-end',
    marginTop: height * 0.01,
  },

  transparentButtonText: {
    fontSize: width * 0.04,
    color: '#878787',
  },

  inputWithButton: {
    flexDirection: 'row',
    width: '73%',
    height: height * 0.07,
    borderWidth: 1,
    borderColor: '#c7c7c7',
    borderRadius: 10,
    alignItems: 'center',
    paddingHorizontal: width * 0.02,
  },

  inputWithButtonText: {
    flex: 1,
    height: '100%',
    paddingHorizontal: width * 0.02,
  },

  verifyButton: {
    backgroundColor: '#d9d9d9',
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.04,
    borderRadius: 10,
  },

  verifyButtonText: {
    color: '#494949',
    fontSize: width * 0.035,
  },
});

export default App;
