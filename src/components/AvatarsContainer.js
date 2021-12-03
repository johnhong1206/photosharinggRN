import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Image, Text} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import tw from 'tailwind-rn';

const AvatarsContainer = ({uid, index, avatar}) => {
  const [userData, setUserData] = useState([]);
  const db = firestore();

  useEffect(() => {
    db.collection('users')
      .doc(uid)
      .get()
      .then(documentSnapshot => {
        if (!documentSnapshot.exists) {
          navigation.navigate('Modal');
        } else {
          //console.log('User data: ', documentSnapshot.data());
          setUserData(documentSnapshot.data());
        }
      });
  }, [db, uid]);

  console.log(index);

  return (
    <View style={[tw(``)]}>
      <Image
        source={{uri: userData?.photoURL}}
        style={[
          tw(`h-14 w-14 rounded-full`),
          styles.avatarStyle,
          {zIndex: index, marginLeft: index * 32},
          index !== avatar.length - 1 && {position: 'absolute'},
        ]}
      />
    </View>
  );
};

export default AvatarsContainer;
const styles = StyleSheet.create({
  avatarStyle: {
    resizeMode: 'cover',
  },
});
