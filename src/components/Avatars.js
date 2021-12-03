import React from 'react';
import tw from 'tailwind-rn';
import theme from '../assets/themes';

import {View, StyleSheet, Image} from 'react-native';

const Avatars = ({avatars}) => {
  return (
    <View style={tw(`mx-4`)}>
      <Image
        source={{uri: avatars?.userPhoto}}
        style={[
          tw(`h-14 w-14 rounded-full`),
          styles.avatarStyle,
          {zIndex: index, marginLeft: index * 32},
          index !== avatars.length - 1 && {position: 'absolute'},
        ]}
      />
    </View>
  );
};

export default Avatars;
const styles = StyleSheet.create({
  avatarStyle: {
    resizeMode: 'cover',
  },
});
