import React, {createContext, useContext, useState, ReactNode} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 타입 정의
type Style = {
  userEmail: string;
  preferStyle: string;
};

type UserContextType = {
  userName: string;
  setUserName: (name: string) => void;
  userEmail: string;
  setUserEmail: (email: string) => void;
  userPwd: string;
  setUserPwd: (password: string) => void;
  userGender: 'female' | 'male' | null;
  setUserGender: (gender: 'female' | 'male' | null) => void;
  userHeight: number;
  setUserHeight: (height: number) => void;
  userWeight: number;
  setUserWeight: (weight: number) => void;
  userFit: string | null;
  setUserFit: (fit: string | null) => void;
  selectedStyles: string[];
  setSelectedStyles: (styles: string[]) => void;
  style: Style[];
  addStyle: (style: Style) => void;
  removeStyle: (index: number) => void;
  clearStyles: () => void;
};

const initialUserState: UserContextType = {
  userName: '',
  setUserName: () => {},
  userEmail: '',
  setUserEmail: () => {},
  userPwd: '',
  setUserPwd: () => {},
  userGender: null,
  setUserGender: () => {},
  userHeight: 0,
  setUserHeight: () => {},
  userWeight: 0,
  setUserWeight: () => {},
  userFit: null,
  setUserFit: () => {},
  selectedStyles: [],
  setSelectedStyles: () => {},
  style: [],
  addStyle: () => {},
  removeStyle: () => {},
  clearStyles: () => {},
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({children}: {children: ReactNode}) => {
  const [userName, setUserName] = useState<string>(initialUserState.userName);
  const [userEmail, setUserEmail] = useState<string>(
    initialUserState.userEmail,
  );
  const [userPwd, setUserPwd] = useState<string>(initialUserState.userPwd);
  const [userGender, setUserGender] = useState<'female' | 'male' | null>(
    initialUserState.userGender,
  );
  const [userHeight, setUserHeight] = useState<number>(
    initialUserState.userHeight,
  );
  const [userWeight, setUserWeight] = useState<number>(
    initialUserState.userWeight,
  );
  const [userFit, setUserFit] = useState<string | null>(
    initialUserState.userFit,
  );
  const [selectedStyles, setSelectedStyles] = useState<string[]>(
    initialUserState.selectedStyles,
  );
  const [style, setStyle] = useState<Style[]>(initialUserState.style);

  const addStyle = (newStyle: Style) => {
    setStyle([...style, newStyle]);
  };

  const removeStyle = (index: number) => {
    const updatedStyles = [...style];
    updatedStyles.splice(index, 1);
    setStyle(updatedStyles);
  };

  const clearStyles = () => {
    setStyle([]);
  };

  return (
    <UserContext.Provider
      value={{
        userName,
        setUserName,
        userEmail,
        setUserEmail,
        userPwd,
        setUserPwd,
        userGender,
        setUserGender,
        userHeight,
        setUserHeight,
        userWeight,
        setUserWeight,
        userFit,
        setUserFit,
        selectedStyles,
        setSelectedStyles,
        style,
        addStyle,
        removeStyle,
        clearStyles,
      }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// 로컬에 저장
export const setItem = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
    // 저장값 확인을 위한 console.log
    console.log(`${key} : ${value}`);
  } catch (e) {
    throw e;
  }
};

export const getItem = async (key: string) => {
  try {
    const res = await AsyncStorage.getItem(key);
    return res || '';
  } catch (e) {
    throw e;
  }
};
