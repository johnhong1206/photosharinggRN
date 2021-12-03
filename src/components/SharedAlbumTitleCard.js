import React from 'react';
import {View, Text, ImageBackground, StyleSheet} from 'react-native';
import theme from '../assets/themes/index';
import tw from 'tailwind-rn';

const SharedAlbumTitleCard = ({name, image, albumUser, photoNumber}) => {
  console.log(albumUser);
  return (
    <ImageBackground
      source={{uri: image}}
      style={[tw(''), styles.imageBackground]}>
      <View style={tw(`flex-row items-end justify-between`)}>
        <View>
          <Text style={tw(`text-2xl text-white font-semibold`)}>{name}</Text>
          <Text
            style={tw(
              `text-lg text-white font-medium`,
            )}>{`Created by ${albumUser}`}</Text>
        </View>

        <View>
          <Text style={tw(`text-sm text-gray-300`)}>
            {photoNumber} {photoNumber <= 1 ? 'Photo' : 'Photos'}
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
};

export default SharedAlbumTitleCard;
const styles = StyleSheet.create({
  imageBackground: {
    resizeMode: 'cover',
    overflow: 'hidden',
    height: theme.imageHeight.l,
    marginTop: theme.spacing.m,
    marginHorizontal: theme.spacing.m,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    justifyContent: 'flex-end',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 6,
  },
});
