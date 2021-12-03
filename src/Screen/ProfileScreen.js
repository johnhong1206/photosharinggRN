import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import Header from '../components/Header';
import tw from 'tailwind-rn';
import {launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';

import useAuth from '../hooks/useAuth';
import firestore from '@react-native-firebase/firestore';

const ProfileScreen = () => {
  const {user} = useAuth();
  const [userData, setUserData] = useState([]);
  const db = firestore();
  const [edit, setEdit] = useState(false);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const avatar = user
    ? userData?.photoURL
    : 'https://thumbs.dreamstime.com/b/no-image-available-icon-flat-vector-no-image-available-icon-flat-vector-illustration-132482953.jpg';

  useEffect(() => {
    const unsubscribe = db
      .collection('users')
      .doc(user?.uid)
      .onSnapshot(snapshot => setUserData(snapshot.data()));
    return unsubscribe;
  }, [db, user]);

  const toggleEdit = () => {
    if (!edit) {
      setEdit(true);
    } else {
      setEdit(false);
      setImage(false);
    }
  };

  const selectImage = () => {
    const options = {
      maxWidth: 2000,
      maxHeight: 2000,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        console.log(response);
        const source = {uri: response.assets[0].uri};
        console.log(source);
        setImage(source);
      }
    });
  };

  const cancelImg = () => {
    setImage(null);
    setEdit(false);
  };

  const uploadImage = async () => {
    const {uri} = image;
    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
    setUploading(true);
    setTransferred(0);
    const task = storage().ref(`profile/${filename}`).putFile(uploadUri);
    // set progress state
    task.on('state_changed', snapshot => {
      setTransferred(
        Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 10000,
      );
    });
    try {
      await task.then(() => {
        storage()
          .ref(`profile/`)
          .child(filename)
          .getDownloadURL()
          .then(url => {
            console.log(url);
            db.collection('users')
              .doc(user?.uid)
              .set(
                {
                  photoURL: url,
                },
                {merge: true},
              )
              .then(() => {
                toggleEdit();
              });
          });
      });
    } catch (e) {
      console.error(e);
    }
    setUploading(false);
    Alert.alert(
      'Photo uploaded!',
      'Your photo has been uploaded to Firebase Cloud Storage!',
    );
    setImage(null);
  };

  return (
    <SafeAreaView style={tw('flex-1 bg-gray-900')}>
      <Header />
      <View style={tw(`flex items-center justify-center`)}>
        <View style={tw('flex-col items-center justify-center')}>
          {!edit ? (
            <Image
              source={{uri: avatar}}
              style={[tw(`rounded-full`), styles.imageBox]}
            />
          ) : (
            <View>
              <TouchableOpacity
                onPress={cancelImg}
                style={tw(
                  'flex-row mb-4 flex items-center justify-center mt-1',
                )}>
                {image !== null ? (
                  <Image
                    source={{uri: image.uri}}
                    style={[tw(`rounded-full`), styles.imageBox]}
                  />
                ) : null}
              </TouchableOpacity>
              {uploading && (
                <View
                  style={tw(
                    'flex-row mb-4 flex items-center justify-center mt-1',
                  )}>
                  <Text style={tw('text-white text-lg font-bold text-center')}>
                    {transferred}%
                  </Text>
                </View>
              )}
            </View>
          )}

          <View style={tw('flex-row items-center justify-center mt-2')}>
            <Text style={tw('font-bold uppercase text-lg text-white')}>
              {userData?.username}
            </Text>
            <Text style={tw('ml-1 text-lg text-white font-semibold')}>
              Profile
            </Text>
          </View>
          <Text style={tw('font-bold text-sm text-gray-200')}>
            {userData?.email}
          </Text>
        </View>
        <Text></Text>
        <TouchableOpacity
          style={[
            tw('bg-white p-4 rounded-3xl mt-10 w-40 ml-2 mr-2'),
            styles.cardShadow,
          ]}
          onPress={toggleEdit}>
          <Text
            style={tw(
              `text-center font-bold text-xl  ${
                edit ? 'text-red-500' : 'text-green-500'
              }`,
            )}>
            {edit ? 'Quit Edit' : 'Edit'}
          </Text>
        </TouchableOpacity>
        {edit && (
          <View style={tw('flex flex-row items-center justify-center p-4')}>
            <TouchableOpacity
              style={tw('bg-white p-4 rounded-3xl w-40 ml-2 mr-2')}
              onPress={selectImage}>
              <Text style={tw('text-center font-bold text-xl text-red-500')}>
                Pick Image
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={tw('bg-white p-4 rounded-3xl w-40 ml-2 mr-2')}
              onPress={uploadImage}>
              <Text
                style={tw(
                  `text-center font-bold text-xl ${
                    image != null ? 'text-green-500' : 'text-gray-500'
                  }`,
                )}>
                Upload
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;
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

  imageBox: {
    width: 300,
    height: 300,
  },
});
