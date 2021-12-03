import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  Keyboard,
  FlatList,
} from 'react-native';
import tw from 'tailwind-rn';
import {useNavigation, useRoute} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

const ModalScreen = () => {
  const db = firestore();
  const navigation = useNavigation();
  const [input, setInput] = useState('');

  const createAlbum = () => {
    Keyboard.dismiss();
    if (input.length > 0) {
      db.collection('album').add({
        name: input,
      });
      setInput('');
      navigation.goBack();
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={tw(` flex-1 absolute bottom-0 w-full`)}>
      <View
        style={[
          tw('bg-black flex items-center justify-center'),
          styles.container,
          {opacity: 0.89},
        ]}>
        <Text style={tw('my-4 font-semibold text-white text-center text-3xl')}>
          Create New Album
        </Text>
        <View style={tw('w-full')}>
          <TextInput
            placeholderTextColor="#000000"
            onChangeText={setInput}
            placeholder="Create New Album"
            className=" flex-grow"
            className="bg-opacity-70"
            style={tw(
              'text-black bg-opacity-70 bg-white mx-4 rounded-3xl mt-4',
            )}
          />
        </View>

        <View style={tw('flex flex-row items-center justify-center p-4')}>
          <TouchableOpacity
            style={tw('bg-white p-4 rounded-3xl w-40 ml-2 mr-2')}
            onPress={() => navigation.goBack()}>
            <Text style={tw('text-center font-bold text-xl text-red-500')}>
              Calcel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw('bg-white p-4 rounded-3xl w-40 ml-2 mr-2')}
            onPress={createAlbum}>
            <Text style={tw('text-center font-bold text-xl text-green-500')}>
              Create
            </Text>
          </TouchableOpacity>
        </View>
        <View style={tw('pb-4')} />
      </View>
    </SafeAreaView>
  );
};

export default ModalScreen;
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
  container: {
    borderTopRightRadius: 60,
    borderTopLeftRadius: 60,
    height: 300,
  },
});
