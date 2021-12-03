import React, {useEffect, useState, useLayoutEffect} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';

import {View, Text, ScrollView, StyleSheet, SafeAreaView} from 'react-native';
import Header from '../../components/Header';
import Avatars from '../../components/Avatars';
import theme from '../../assets/themes';
import SharedAlbumTitleCard from '../../components/SharedAlbumTitleCard';
import ImageGallery from '../../components/ImageGallery';
import backgroundImages from '../../assets/data/backgroundImages';
import tw from 'tailwind-rn';
import firestore from '@react-native-firebase/firestore';
import AvatarsContainer from '../../components/AvatarsContainer';
import {getUniqueValues} from '../../utils/helper';

const SharedAlbum = () => {
  const navigation = useNavigation();
  const {params} = useRoute();
  const db = firestore();
  const [photos, setPhotos] = useState([]);

  const {album, lastPhoto} = params;
  const docId = album?.id;

  const avatar = photos ? getUniqueValues(photos, 'uid') : null;

  useEffect(() => {
    let unsubscribe;
    const fetchPhotos = async () => {
      unsubscribe = db
        .collection('album')
        .doc(docId)
        .collection('photos')
        .orderBy('timestamp', 'desc')
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
  }, [db, album]);

  return (
    <SafeAreaView style={tw(`flex-1`)}>
      <Header goBack sharedAlbum imgUpload docId={docId} title={album?.name} />
      <ScrollView>
        <SharedAlbumTitleCard
          name={album.name}
          image={lastPhoto?.image}
          albumUser={lastPhoto?.user}
          photoNumber={photos?.length}
        />
        <View
          style={[
            tw(
              `flex flex-row items-center justify-between my-4 mx-4 px-4 py-4`,
            ),
            styles.avatarContainer,
          ]}>
          <View style={tw(`relative`)}>
            {avatar.map((user, index) => (
              <AvatarsContainer uid={user} index={index} avatar={avatar} />
            ))}
          </View>

          <Text style={tw(`text-gray-400`)}>{`${avatar.length} people`}</Text>
        </View>
        <ImageGallery images={backgroundImages} photos={photos} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default SharedAlbum;
const styles = StyleSheet.create({
  avatarContainer: {
    backgroundColor: theme.colors.lightGray,
    borderRadius: theme.borderRadius.m,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 6,
  },
});
{
  /**   <ScrollView>
        <SharedAlbumTitleCard album={album} />

        <View
          style={[
            tw(
              `flex flex-row items-center justify-between my-4 mx-4 px-4 py-4`,
            ),
            styles.avatarContainer,
          ]}>
          <Avatars avatars={album.avatars} />
          <Text
            style={tw(
              `text-gray-400`,
            )}>{`${album.avatars.length} people`}</Text>
        </View>
        <ImageGallery images={backgroundImages} />
      </ScrollView> */
}
