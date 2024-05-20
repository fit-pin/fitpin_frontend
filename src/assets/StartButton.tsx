import React from 'react';
import { Pressable, Text } from 'react-native';

const StartButton = () => {
    return (
        <Pressable style = {{
            backgroundColor: '#000000',
            padding: 16,
            margin: 20,
            marginLeft: 30,
            marginRight: 30,
            borderRadius: 20,
        }}>
            <Text style={{ 
                color: '#ffffff',
                fontSize: 24,
                textAlign: 'center',
                 }}>시작하기</Text>
        </Pressable>
    );
};

export default StartButton;