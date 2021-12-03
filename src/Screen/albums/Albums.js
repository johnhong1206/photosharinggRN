import React, {useLayoutEffect, useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/core';
import tw from 'tailwind-rn';

import {
  View,
  TouchableOpacity,
  ScrollView,
  Text,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import albumPage from '../../assets/data/albumPage';
import theme from '../../assets/themes';

//components
import Header from '../../components/Header';
import Card from '../../components/Card';
import Separator from '../../components/Separator';
import firestore from '@react-native-firebase/firestore';

const Albums = () => {
  const navigation = useNavigation();
  const [albums, setAlbums] = useState([]);

  const db = firestore();

  useEffect(() => {
    let unsubscribe;
    const fetchAlbumData = async () => {
      unsubscribe = db.collection('album').onSnapshot(snapshot =>
        setAlbums(
          snapshot?.docs.map(doc => ({
            id: doc?.id,
            ...doc?.data(),
          })),
        ),
      );
    };
    fetchAlbumData();

    return unsubscribe;
  }, [db]);

  return (
    <SafeAreaView style={tw(`flex-1`)}>
      <Header title={'Album'} createAlbum />
      <ScrollView>
        <View style={styles.albumContainer}>
          {albums.map((album, index) => (
            <View key={index}>
              <Card item={album} id={album.id} key={album.id} />

              {index === 1 && <Separator />}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Albums;

const styles = StyleSheet.create({
  albumContainer: {
    marginBottom: theme.spacing.l,
  },
  openSheetButton: {
    width: 32,
    height: 32,
    backgroundColor: theme.colors.primary,
    marginRight: theme.spacing.m,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

{
  /**
 {albumPage.map((item, index) => (
            <View key={index}>
              <Card item={item} />

             
              {index === 1 && <Separator />}
            </View>
          ))}
        
         */
}
