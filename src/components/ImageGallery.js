import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import theme from '../assets/themes';
import {useNavigation, useRoute} from '@react-navigation/native';

import tw from 'tailwind-rn';

const ImageGallery = ({images, photos}) => {
  const navigation = useNavigation();

  const navImage = item => {
    navigation.navigate('Image', {item});
  };
  return (
    <View style={styles.galleryContainer}>
      <Text style={styles.galleryText}>Photos</Text>
      <FlatList
        data={photos}
        keyExtractor={item => item.id}
        numColumns={3}
        scrollEnabled={false}
        renderItem={({item}) => (
          <TouchableOpacity onPress={() => navImage(item)}>
            <Image source={{uri: item?.image}} style={styles.galleryImage} />
          </TouchableOpacity>
        )}
      />
      <View style={tw(`pb-10`)} />
    </View>
  );
};

export default ImageGallery;
const styles = StyleSheet.create({
  galleryContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.l,
  },
  galleryText: {
    ...theme.textVariants.body3,
    color: theme.colors.gray,
  },
  galleryImage: {
    height: theme.imageHeight.l,
    width: theme.imageHeight.l,
    margin: 2,
  },
});
