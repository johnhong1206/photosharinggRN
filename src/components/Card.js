import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import Avatars from './Avatars';
import theme from '../assets/themes';
import {useNavigation} from '@react-navigation/core';
import tw from 'tailwind-rn';
import firestore from '@react-native-firebase/firestore';
import {getUniqueValues} from '../utils/helper';
import AvatarsContainer from './AvatarsContainer';

const Card = ({item, key, id}) => {
  const navigation = useNavigation();
  const [lastPhoto, setLastPhoto] = useState('');
  const [userData, setUserData] = useState([]);
  const [photos, setPhotos] = useState([]);

  const docId = item?.id;
  const uid = lastPhoto?.uid;

  const db = firestore();

  useEffect(() => {
    const unsubscribe = db
      .collection('album')
      .doc(docId)
      .collection('photos')
      .orderBy('timestamp', 'desc')
      .onSnapshot(snapshot => setLastPhoto(snapshot.docs[0]?.data()));
    return unsubscribe;
  }, [db]);

  useEffect(() => {
    const unsubscribe = db
      .collection('users')
      .doc(uid)
      .onSnapshot(snapshot => setUserData(snapshot.data()));
    return unsubscribe;
  }, [db, uid]);

  console.log(userData);

  useEffect(() => {
    let unsubscribe;
    const fetchPhotos = async () => {
      unsubscribe = db
        .collection('album')
        .doc(item.id)
        .collection('photos')
        .onSnapshot(snapshot =>
          setPhotos(
            snapshot?.docs.map(doc => ({
              id: doc?.id,
              ...doc?.data(),
            })),
          ),
        );
    };
    fetchPhotos();
    return unsubscribe;
  }, [db]);

  console.log('id', id);
  console.log(item.id);
  console.log(photos);

  const avatar = photos ? getUniqueValues(photos, 'uid') : null;

  return (
    <TouchableOpacity
      key={key}
      onPress={() =>
        navigation.navigate('SharedAlbum', {
          album: item,
          lastPhoto: lastPhoto,
        })
      }>
      <ImageBackground
        source={{uri: lastPhoto?.image}}
        style={[
          tw('flex items-center h-20 my-4 mx-4 px-4 py-4'),
          styles.imageBackground,
        ]}>
        <View style={tw(`flex flex-row items-center justify-between`)}>
          <View style={tw(`mx-4`)}>
            <Text
              style={tw(
                `text-2xl text-white font-semibold ${
                  !lastPhoto && 'text-black'
                }`,
              )}>
              {item.name}
            </Text>
            <Text
              style={tw(
                `text-white font-medium ${!lastPhoto && 'text-black'}`,
              )}>
              {lastPhoto && `Created by ${lastPhoto?.user}`}
            </Text>
          </View>
          <View style={tw(`relative`)}>
            {avatar?.slice(0, 2).map((user, index) => (
              <AvatarsContainer uid={user} index={index} avatar={avatar} />
            ))}
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

export default Card;
const styles = StyleSheet.create({
  imageBackground: {
    resizeMode: 'cover',
    overflow: 'hidden',
    height: theme.imageHeight.s,
    borderRadius: theme.borderRadius.m,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 1,
    shadowRadius: 999,
    elevation: 10,
  },
  imageContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatarStyle: {
    resizeMode: 'cover',
  },
});

{
  /**<View>
            <Avatars avatars={item.avatars} />
          </View> */
}
