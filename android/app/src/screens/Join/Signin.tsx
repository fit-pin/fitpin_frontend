import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import {reqPost} from '../../utills/Request';
import {DATA_URL} from '../../Constant';
import path from 'path';
const {width, height} = Dimensions.get('window');

async function test() {
  // 요청 body 만드는거
  const body = {
    userEmail: 'test1234',
    userPwd: '1234',
    userName: 'zoo',
    userPwdConfirm: '1234',
  };

  const res = await reqPost(
    path.join(DATA_URL, 'api', 'members', 'register'),
    body,
  );
  console.log(res.name); // 이름
}

const Signin = () => {
  test();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Fitpin.</Text>

      <Text style={styles.signupStyle}>회원가입</Text>

      <Text style={styles.label}>이름</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        keyboardType="default"
        autoCapitalize="none"
      />

      <Text style={styles.label}>이메일</Text>
      <View style={styles.inputWithButton}>
        <TextInput
          style={styles.inputWithButtonText}
          placeholder="E-mail"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.verifyButton}>
          <Text style={styles.verifyButtonText}>인증하기</Text>
        </TouchableOpacity>
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

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>가입하기</Text>
      </TouchableOpacity>

      <View style={styles.transparentButtonContainer}>
        <TouchableOpacity>
          <Text style={styles.transparentButtonText}>로그인하러 가기</Text>
        </TouchableOpacity>
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
    marginTop: height * 0.05,
    marginBottom: height * 0.07,
    fontWeight: 'bold',
  },

  signupStyle: {
    fontSize: width * 0.06,
    color: '#000000',
    alignSelf: 'flex-start',
    marginLeft: width * 0.1,
    fontWeight: 'bold',
  },

  label: {
    fontSize: width * 0.04,
    color: '#878787',
    alignSelf: 'flex-start',
    marginLeft: width * 0.1,
    marginTop: height * 0.02,
    marginBottom: height * 0.01,
    fontWeight: 'bold',
  },

  input: {
    width: '73%',
    height: height * 0.06,
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
    fontWeight: 'bold',
  },

  transparentButtonContainer: {
    width: '73%',
    alignItems: 'flex-end',
    marginTop: height * 0.01,
  },

  transparentButtonText: {
    fontSize: width * 0.04,
    color: '#878787',
    fontWeight: 'bold',
  },

  inputWithButton: {
    flexDirection: 'row',
    width: '73%',
    height: height * 0.06,
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
    paddingVertical: height * 0.005,
    paddingHorizontal: width * 0.03,
    borderRadius: 10,
  },

  verifyButtonText: {
    color: '#494949',
    fontSize: width * 0.035,
  },
});

export default Signin;
