import React, {useLayoutEffect, useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/core';
import auth from '@react-native-firebase/auth';
import tw from 'tailwind-rn';

import {
  KeyboardAvoidingView,
  StyleSheet,
  View,
  Text,
  Button,
  TextInput,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';

const LoginScreen = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [allowLogin, setAllowLogin] = useState(false);
  const bgURI = 'https://tinder.com/static//tinder.png';

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  const signIn = () => {
    if (allowLogin) {
      auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {
          navigation.replace('Albums');
        })
        .catch(error => alert(error));
    }
  };

  useEffect(() => {
    if (!email || !password) {
      setAllowLogin(false);
    } else if (!email || !password) {
      setAllowLogin(false);
    } else if (!password) {
      setAllowLogin(false);
    } else {
      setAllowLogin(true);
    }
  }, [email, password]);

  return (
    <View style={tw('flex-1 bg-red-400')}>
      <View
        className=" bg-opacity-50 flex items-center justify-center place-items-center"
        style={tw('absolute bottom-10 w-full')}
        behavior="padding">
        <View style={tw(' px-10 max-w-md')}>
          <TextInput
            placeholder="Email"
            placeholderTextColor="#000000"
            style={[
              tw(
                'bg-white text-black bg-opacity-90 px-10 max-w-md mt-4 rounded-2xl',
              ),
              styles.cardShadow,
            ]}
            autoFocus
            type="email"
            value={email}
            onChangeText={text => setEmail(text)}
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#000000"
            style={[
              tw(
                'bg-white text-black bg-opacity-90 px-10 max-w-md mt-4 rounded-2xl',
              ),
              styles.cardShadow,
            ]}
            secureTextEntry
            type="password"
            value={password}
            onChangeText={text => setPassword(text)}
            onSubmitEditing={signIn}
          />
        </View>
        <View style={tw('flex flex-row items-center justify-center p-4')}>
          <TouchableOpacity
            style={tw('bg-white p-4 rounded-3xl w-40 ml-2 mr-2')}
            onPress={signIn}>
            <Text
              style={tw(
                `text-center font-bold text-xl ${
                  allowLogin ? 'text-green-500' : 'text-gray-500'
                }`,
              )}>
              Login
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw('bg-white p-4 rounded-3xl w-40 ml-2 mr-2')}
            onPress={() => navigation.navigate('Register')}>
            <Text style={tw('text-center font-bold text-xl text-red-500')}>
              Register
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
});
