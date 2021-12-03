import React from 'react';
import {View, Text} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Albums from './albums/Albums';
import SharedAlbum from './albums/SharedAlbum';
import ModalScreen from './modal/ModalScreen';
import ImageScreen from './image/ImageScreen';
import ImageUpload from './image/ImageUpload';
import LoginScreen from './auth/LoginScreen';
import RegisterScreen from './auth/RegisterScreen';
const Stack = createNativeStackNavigator();
import useAuth from '../hooks/useAuth';
import MenuScreen from './modal/MenuScreen';
import ProfileScreen from './ProfileScreen';

const StackNavigator = () => {
  const {user} = useAuth();

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Albums" component={Albums} />
      <Stack.Screen name="SharedAlbum" component={SharedAlbum} />
      <Stack.Screen name="ImageUpload" component={ImageUpload} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Group screenOptions={{presentation: 'transparentModal'}}>
        <Stack.Screen name="Image" component={ImageScreen} />
        <Stack.Screen name="Menu" component={MenuScreen} />
        {user && <Stack.Screen name="Modal" component={ModalScreen} />}
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default StackNavigator;
{
  /**        {user && <Stack.Screen name="Modal" component={ModalScreen} />}
   */
}
