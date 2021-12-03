import React, {useState, useEffect} from 'react';
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

import {useNavigation} from '@react-navigation/core';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import tw from 'tailwind-rn';
import useAuth from '../../hooks/useAuth';

const MenuScreen = () => {
  const navigation = useNavigation();
  const {user} = useAuth();
  const [userData, setUserData] = useState([]);
  const db = firestore();

  const avatar = user
    ? userData?.photoURL
    : 'https://thumbs.dreamstime.com/b/no-image-available-icon-flat-vector-no-image-available-icon-flat-vector-illustration-132482953.jpg';

  useEffect(() => {
    if (user) {
      db.collection('users')
        .doc(user?.uid)
        .get()
        .then(documentSnapshot => {
          if (!documentSnapshot.exists) {
            console.log('No data');
          } else {
            //console.log('User data: ', documentSnapshot.data());
            setUserData(documentSnapshot.data());
          }
        });
    }
  }, [db, user]);

  const navBack = () => {
    navigation.goBack();
  };

  const navLogin = () => {
    if (user) {
      auth()
        .signOut()
        .then(() => console.log('User signed out!'));
    } else {
      navigation.navigate('Login');
    }
  };

  const navOrder = () => {
    navigation.navigate('Order');
  };
  const navHome = () => {
    navigation.navigate('Albums');
  };
  const navProfile = () => {
    navigation.navigate('Profile');
  };

  return (
    <View style={[tw('h-full bg-black'), {opacity: 0.89}]}>
      <View></View>

      <View style={tw(`flex flex-col justify-between mt-1 py-2 mx-4`)}>
        <TouchableOpacity
          style={[tw(`flex-row items-center my-4`)]}
          onPress={navBack}>
          <Ionicons name="chevron-back-outline" size={50} color="#FF5864" />
        </TouchableOpacity>
        <Image
          source={{uri: avatar}}
          style={[tw('rounded-full'), {width: 80, height: 80}]}
        />
        <TouchableOpacity
          style={[tw(`flex-row items-center my-4`)]}
          onPress={navHome}>
          <MaterialCommunityIcons
            name="home"
            size={60}
            style={tw(`text-red-400`)}
          />
          <Text style={tw('text-white text-xl font-semibold ml-2')}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw(`flex-row items-center my-4`)}
          onPress={navProfile}>
          <MaterialCommunityIcons
            name="account-circle-outline"
            size={60}
            style={tw(`text-red-400`)}
          />
          <Text style={tw('text-white text-xl font-semibold ml-2')}>
            Profile
          </Text>
        </TouchableOpacity>

        {user ? (
          <TouchableOpacity
            style={tw(`flex-row items-center my-4`)}
            onPress={navLogin}>
            <Ionicons
              name="log-out-outline"
              size={60}
              style={tw(`text-red-400`)}
            />
            <Text style={tw('text-white text-xl font-semibold ml-2')}>
              LogOut
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={tw(`flex-row items-center my-4`)}
            onPress={navLogin}>
            <Ionicons
              name="log-in-outline"
              size={60}
              style={tw(`text-red-400`)}
            />
            <Text style={tw('text-white text-xl font-semibold ml-2')}>
              Login
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default MenuScreen;
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
  image: {width: 300, height: 300},
});
