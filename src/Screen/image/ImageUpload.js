import React, {useState, useEffect} from 'react';
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  TextInput,
  Image,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import tw from 'tailwind-rn';
import Header from '../../components/Header';
import firestore from '@react-native-firebase/firestore';
import {useNavigation, useRoute} from '@react-navigation/native';
import useAuth from '../../hooks/useAuth';

//import * as Progress from 'react-native-progress';

const ImageUpload = () => {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [phase, setPhase] = useState('Image');
  const [transferred, setTransferred] = useState(0);
  const db = firestore();
  const navigation = useNavigation();
  const {params} = useRoute();
  const {docId} = params;
  const {user} = useAuth();
  const [userData, setUserData] = useState([]);
  const [imgUrl, setImgUrl] = useState(null);

  useEffect(() => {
    db.collection('users')
      .doc(user?.uid)
      .get()
      .then(documentSnapshot => {
        if (!documentSnapshot.exists) {
          navigation.navigate('Modal');
        } else {
          //console.log('User data: ', documentSnapshot.data());
          setUserData(documentSnapshot.data());
        }
      });
  }, [db]);

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

  const uploadImage = async () => {
    if (image === null) {
      false;
      selectImage();
    }

    const {uri} = image;
    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
    setUploading(true);
    setTransferred(0);
    const task = storage().ref(`photos/${filename}`).putFile(uploadUri);
    // set progress state
    task.on('state_changed', snapshot => {
      setTransferred(
        Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 10000,
      );
    });
    try {
      await task.then(() => {
        storage()
          .ref(`photos/`)
          .child(filename)
          .getDownloadURL()
          .then(url => {
            console.log(url);
            db.collection('album')
              .doc(docId)
              .collection('photos')
              .add({
                image: url,
                uid: user?.uid,
                email: user?.email,
                timestamp: firestore.FieldValue.serverTimestamp(),
                user: userData?.username,
              })
              .then(() => {
                navigation.navigate('Albums');
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

  const cancelImg = () => {
    setImage(null);
  };

  const cancelURL = () => {
    setImgUrl(null);
  };

  const uploadImageURL = () => {
    db.collection('album')
      .doc(docId)
      .collection('photos')
      .add({
        image: imgUrl,
        uid: user?.uid,
        email: user?.email,
        timestamp: firestore.FieldValue.serverTimestamp(),
        user: userData?.username,
      })
      .then(() => {
        navigation.navigate('Albums');
      });
  };

  return (
    <View style={[tw('h-full bg-black'), {opacity: 0.89}]}>
      <Header goBack title="Image Upload" />
      <View style={tw('flex-row mb-4 flex justify-evenly mt-1')}>
        <Phase
          name={'Image'}
          isActive={phase == 'Image' ? true : false}
          setPhase={() => setPhase('Image')}
        />
        <Phase
          name={'URL'}
          isActive={phase == 'URL' ? true : false}
          setPhase={() => setPhase('URL')}
        />
      </View>
      {phase == 'Image' && (
        <View>
          <TouchableOpacity
            onPress={cancelImg}
            style={tw('flex-row mb-4 flex items-center justify-center mt-1')}>
            {image !== null ? (
              <Image source={{uri: image.uri}} style={styles.imageBox} />
            ) : null}
          </TouchableOpacity>
          {uploading && (
            <View
              style={tw('flex-row mb-4 flex items-center justify-center mt-1')}>
              <Text style={tw('text-white text-lg font-bold text-center')}>
                {transferred}%
              </Text>
            </View>
          )}
        </View>
      )}
      {phase == 'URL' && (
        <View>
          <TouchableOpacity
            onPress={cancelURL}
            style={tw('flex-row mb-4 flex items-center justify-center mt-1')}>
            {imgUrl !== null ? (
              <Image source={{uri: imgUrl}} style={styles.imageBox} />
            ) : null}
          </TouchableOpacity>
        </View>
      )}

      {phase == 'URL' && (
        <TextInput
          placeholderTextColor="#000000"
          onChangeText={setImgUrl}
          placeholder="Please Fill Your Image URL"
          className=" flex-grow"
          className="bg-opacity-70"
          style={tw('text-black bg-opacity-70 bg-white mx-4 rounded-3xl mt-4')}
        />
      )}
      {phase == 'Image' && (
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
      {phase == 'URL' && (
        <View style={tw('flex flex-row items-center justify-center p-4')}>
          <TouchableOpacity
            style={tw('bg-white p-4 rounded-3xl w-40 ml-2 mr-2')}
            onPress={uploadImageURL}>
            <Text style={tw('text-center font-bold text-xl text-red-500')}>
              Upload
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default ImageUpload;

const Phase = ({name, isActive, setPhase}) => {
  return (
    <TouchableOpacity onPress={setPhase}>
      <View style={tw('flex flex-col items-center')}>
        <Text
          style={tw(
            `font-bold mb-1 ${isActive ? 'text-gray-100' : 'text-gray-400'}`,
          )}>
          {name}
        </Text>
        <View
          style={tw(
            `w-4 h-4 rounded-full ${isActive ? 'bg-blue-600' : 'bg-gray-400'}`,
          )}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#bbded6',
  },
  selectButton: {
    borderRadius: 5,
    width: 150,
    height: 50,
    backgroundColor: '#8ac6d1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadButton: {
    borderRadius: 5,
    width: 150,
    height: 50,
    backgroundColor: '#ffb6b9',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  imageContainer: {
    marginTop: 30,
    marginBottom: 50,
    alignItems: 'center',
  },
  progressBarContainer: {
    marginTop: 20,
  },
  imageBox: {
    width: 300,
    height: 300,
  },
});

{
  /**
import React, {useState} from 'react';
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  Image,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';

const ImageUpload = () => {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);

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
        const source = {uri: response.uri};
        console.log(source);
        setImage(source);
      }
    });
  };

  const uploadImage = async () => {
    const {uri} = image;
    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
    setUploading(true);
    setTransferred(0);
    const task = storage().ref(filename).putFile(uploadUri);
    // set progress state
    task.on('state_changed', snapshot => {
      setTransferred(
        Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 10000,
      );
    });
    try {
      await task;
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
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.selectButton} onPress={selectImage}>
        <Text style={styles.buttonText}>Pick an image</Text>
      </TouchableOpacity>
      <View style={styles.imageContainer}>
        {image !== null ? (
          <Image source={{uri: image.uri}} style={styles.imageBox} />
        ) : null}
        {uploading ? (
          <View style={styles.progressBarContainer}>
            <Progress.Bar progress={transferred} width={300} />
          </View>
        ) : (
          <TouchableOpacity style={styles.uploadButton} onPress={uploadImage}>
            <Text style={styles.buttonText}>Upload image</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ImageUpload;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#bbded6',
  },
  selectButton: {
    borderRadius: 5,
    width: 150,
    height: 50,
    backgroundColor: '#8ac6d1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadButton: {
    borderRadius: 5,
    width: 150,
    height: 50,
    backgroundColor: '#ffb6b9',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  imageContainer: {
    marginTop: 30,
    marginBottom: 50,
    alignItems: 'center',
  },
  progressBarContainer: {
    marginTop: 20,
  },
  imageBox: {
    width: 300,
    height: 300,
  },
});

*/
}

{
  /**


import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import useAuth from '../../hooks/useAuth';

import tw from 'tailwind-rn';
import firestore from '@react-native-firebase/firestore';
import {Picker} from '@react-native-picker/picker';
import {useNavigation, useRoute} from '@react-navigation/native';
import Header from '../../components/Header';
import {launchImageLibrary} from 'react-native-image-picker';

const ImageUpload = () => {
  const db = firestore();
  const navigation = useNavigation();
  const {params} = useRoute();
  const {docId} = params;
  const {user} = useAuth();
  const [userData, setUserData] = useState([]);
  const [phase, setPhase] = useState('Image');
  const [imgUrl, setImgUrl] = useState('');
  const [filePath, setFilePath] = useState('');
  const [fileData, setFileData] = useState('');
  const [fileUri, setFileUri] = useState('');
  const [pic, setPic] = useState('');

  useEffect(() => {
    db.collection('users')
      .doc(user?.uid)
      .get()
      .then(documentSnapshot => {
        if (!documentSnapshot.exists) {
          navigation.navigate('Modal');
        } else {
          //console.log('User data: ', documentSnapshot.data());
          setUserData(documentSnapshot.data());
        }
      });
  }, [db]);

  const uploadImage = () => {
    db.collection('album')
      .doc(docId)
      .collection('photos')
      .add({
        image: phase == 'Image' ? fileUri : imgUrl,
        uid: user?.uid,
        email: user?.email,
        timestamp: firestore.FieldValue.serverTimestamp(),
        user: userData?.username,
      })
      .then(() => {
        navigation.navigate('Albums');
      });
  };

  const launchImageLibrarys = async () => {
    let options = {
      mediaType: 'photo',
      quality: 1,
      includeBase64: true,
    };
    launchImageLibrary(options, response => {
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const source = {uri: response.uri};
        console.log('response', JSON.stringify(response));

        setFilePath(response.assets);
        setFileData(response.assets[0].base64);
        setFileUri(response.assets[0].uri);
      }
    });
  };
  console.log('filePath', filePath);
  console.log('file uri', fileUri);
  console.log('file Data', fileData);

  const renderFileData = () => {
    if (fileData) {
      return (
        <Image
          source={{uri: 'data:image/jpeg;base64,' + fileData}}
          style={styles.images}
        />
      );
    } else {
      return (
        <Image
          source={{
            uri: 'https://thumbs.dreamstime.com/b/no-image-available-icon-flat-vector-no-image-available-icon-flat-vector-illustration-132482953.jpg',
          }}
          style={styles.images}
        />
      );
    }
  };

  const renderFileUri = () => {
    if (fileUri) {
      return <Image source={{uri: fileUri}} style={styles.images} />;
    } else {
      return (
        <Image
          source={{
            uri: 'https://thumbs.dreamstime.com/b/no-image-available-icon-flat-vector-no-image-available-icon-flat-vector-illustration-132482953.jpg',
          }}
          style={styles.images}
        />
      );
    }
  };
  return (
    <View style={[tw('h-full bg-black'), {opacity: 0.89}]}>
      <Header />
      <View style={tw('flex-row mb-4 flex justify-evenly mt-1')}>
        <Phase
          name={'Image'}
          isActive={phase == 'Image' ? true : false}
          setPhase={() => setPhase('Image')}
        />
        <Phase
          name={'URL'}
          isActive={phase == 'URL' ? true : false}
          setPhase={() => setPhase('URL')}
        />
      </View>
      {phase == 'URL' && (
        <TextInput
          placeholderTextColor="#000000"
          onChangeText={setImgUrl}
          placeholder="Please Fill Your Image URL"
          className=" flex-grow"
          className="bg-opacity-70"
          style={tw('text-black bg-opacity-70 bg-white mx-4 rounded-3xl mt-4')}
        />
      )}
      {renderFileData()}
      {renderFileUri()}

      <View style={tw('flex flex-row items-center justify-center p-4')}>
        <TouchableOpacity
          style={tw('bg-white p-4 rounded-3xl w-40 ml-2 mr-2')}
          onPress={launchImageLibrarys}>
          <Text style={tw('text-center font-bold text-xl text-red-500')}>
            Pick Image
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw('bg-white p-4 rounded-3xl w-40 ml-2 mr-2')}
          onPress={uploadImage}>
          <Text style={tw('text-center font-bold text-xl text-red-500')}>
            Upload
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ImageUpload;
const styles = StyleSheet.create({
  container: {maxHeight: '70%'},
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
  images: {
    width: 150,
    height: 150,
    borderColor: 'black',
    borderWidth: 1,
    marginHorizontal: 3,
  },
});
const Phase = ({name, isActive, setPhase}) => {
  return (
    <TouchableOpacity onPress={setPhase}>
      <View style={tw('flex flex-col items-center')}>
        <Text
          style={tw(
            `font-bold mb-1 ${isActive ? 'text-gray-100' : 'text-gray-400'}`,
          )}>
          {name}
        </Text>
        <View
          style={tw(
            `w-4 h-4 rounded-full ${isActive ? 'bg-blue-600' : 'bg-gray-400'}`,
          )}
        />
      </View>
    </TouchableOpacity>
  );
};
*/
}
