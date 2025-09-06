import * as ImagePicker from 'expo-image-picker';

  export const SeleccionarImagen = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 1,
  });

  if (!result.canceled && result.assets.length > 0) {
    return result.assets[0].uri;  // devolver la URI
  } else {
    return null;
  }
};
