import React, {useLayoutEffect, useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/core';
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
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const RegisterScreen = () => {
  const navigation = useNavigation();

  const [username, setusername] = useState('');
  const [location, setLocation] = useState('');
  const [age, setAge] = useState(Number(0));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const bgURI = 'https://tinder.com/static//tinder.png';
  const db = firestore();
  const [allowLogin, setAllowLogin] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  const register = () => {
    if (allowLogin) {
      auth()
        .createUserWithEmailAndPassword(email, password)
        .then(response => {
          const uid = response.user.uid;
          const usersRef = db.collection('users');
          usersRef.doc(uid).set({
            userId: response.user.uid,
            username: username.toLowerCase(),
            email: email.toLowerCase(),
            password: password,
            photoURL:
              'https://thumbs.dreamstime.com/b/no-image-available-icon-flat-vector-no-image-available-icon-flat-vector-illustration-132482953.jpg',
          });
        })
        .catch(error => alert(error.message))
        .then(() => {
          navigation.navigate('Albums');
        });
    }
  };

  useEffect(() => {
    if (!username || !email || !password) {
      setAllowLogin(false);
    } else if (!username || !email) {
      setAllowLogin(false);
    } else if (!username || !password) {
      setAllowLogin(false);
    } else if (!email || !password) {
      setAllowLogin(false);
    } else if (!password) {
      setAllowLogin(false);
    } else {
      setAllowLogin(true);
    }
  }, [username, email, password]);

  return (
    <View style={tw('flex-1 bg-red-400')}>
      <View
        className=" bg-opacity-50 flex items-center justify-center place-items-center"
        style={tw('absolute bottom-10 w-full')}
        behavior="padding">
        <View style={tw(' px-10 max-w-md')}>
          <TextInput
            placeholder="Username"
            placeholderTextColor="#000000"
            style={[
              tw(
                'bg-white text-black bg-opacity-90 px-10 max-w-md mt-4 rounded-2xl',
              ),
              styles.cardShadow,
            ]}
            autoFocus
            type="name"
            value={username}
            onChangeText={text => setusername(text)}
          />
          <TextInput
            placeholder="Email"
            placeholderTextColor="#000000"
            style={[
              tw(
                'bg-white text-black bg-opacity-90 px-10 max-w-md mt-4 rounded-2xl',
              ),
              styles.cardShadow,
            ]}
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
            onSubmitEditing={register}
          />
        </View>
        <View style={tw('flex flex-row items-center justify-center p-4')}>
          <TouchableOpacity
            style={tw('bg-white p-4 rounded-3xl w-40 ml-2 mr-2')}
            onPress={register}>
            <Text
              style={tw(
                `text-center font-bold text-xl ${
                  allowLogin ? 'text-green-500' : 'text-gray-500'
                }`,
              )}>
              Register
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw('bg-white p-4 rounded-3xl w-40 ml-2 mr-2')}
            onPress={() => navigation.navigate('Login')}>
            <Text style={tw('text-center font-bold text-xl text-red-500')}>
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default RegisterScreen;

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
