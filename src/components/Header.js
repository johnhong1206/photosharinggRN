import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  FlatList,
} from 'react-native';
import tw from 'tailwind-rn';
import {useNavigation} from '@react-navigation/core';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useAuth from '../hooks/useAuth';

const Header = ({
  goBack,
  createAlbum,
  imgUpload,
  docId,
  title,
  sharedAlbum,
}) => {
  const {user} = useAuth();
  const navigation = useNavigation();

  const OpenMenu = () => {
    navigation.navigate('Menu');
  };
  const navBack = () => {
    navigation.goBack();
  };

  const navCreateAlbum = () => {
    navigation.navigate('Modal');
  };

  const uploadImg = () => {
    navigation.navigate('ImageUpload', {docId});
  };

  console.log('header user', user);

  return (
    <View
      style={tw(`flex flex-row items-center justify-between mt-1 px-4 py-2`)}>
      {goBack ? (
        <View style={tw(`flex flex-row items-center justify-between`)}>
          <TouchableOpacity onPress={navBack}>
            <Ionicons name="chevron-back-outline" size={34} color="#FF5864" />
          </TouchableOpacity>
          {imgUpload ? (
            <Text
              style={[tw(`text-2xl font-bold pl-2 text-white`), styles.title]}>
              {title}
            </Text>
          ) : (
            <Text style={[tw(`text-2xl font-bold pl-2 text-white `)]}>
              {title}
            </Text>
          )}
        </View>
      ) : (
        <TouchableOpacity onPress={OpenMenu} style={tw(``)}>
          <MaterialCommunityIcons name="menu" size={40} color={'#4c68d7'} />
        </TouchableOpacity>
      )}

      <View style={tw(`flex flex-row items-center justify-between mt-1 py-2`)}>
        {user && createAlbum && (
          <TouchableOpacity onPress={navCreateAlbum} style={tw(`mx-2`)}>
            <MaterialCommunityIcons
              name="folder-plus-outline"
              size={40}
              color={'#4c68d7'}
            />
          </TouchableOpacity>
        )}
        {user && imgUpload && (
          <TouchableOpacity onPress={uploadImg} style={tw(`mx-2`)}>
            <MaterialCommunityIcons
              name="camera-outline"
              size={40}
              color={'#4c68d7'}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default Header;
const styles = StyleSheet.create({
  title: {
    color: '#4c68d7',
  },
});
