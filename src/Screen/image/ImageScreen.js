import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import tw from 'tailwind-rn';

const ImageScreen = () => {
  const navigation = useNavigation();
  const {params} = useRoute();
  const {item} = params;

  return (
    <View style={[tw('h-full bg-black flex-1'), {opacity: 0.89}]}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={[tw('w-full h-full flex items-center justify-center')]}>
        <Image source={{uri: item.image}} style={([tw(``)], styles.image)} />
      </TouchableOpacity>
    </View>
  );
};

export default ImageScreen;
const styles = StyleSheet.create({
  image: {width: '100%', height: '100%', resizeMode: 'contain'},
});
