import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';

export const descargarImagen = async (qrImageUrl) => {
  if (!qrImageUrl) return;

  try {
    const permission = await MediaLibrary.requestPermissionsAsync();
    if (permission.status !== 'granted') {
      alert('Se necesita permiso para guardar imágenes en el dispositivo');
      return;
    }

    const fileUri = FileSystem.cacheDirectory + 'qr_code.png';
    const downloadResult = await FileSystem.downloadAsync(qrImageUrl, fileUri);

    const asset = await MediaLibrary.createAssetAsync(downloadResult.uri);
    await MediaLibrary.createAlbumAsync('QR Codes', asset, false);

    alert('Imagen descargada y guardada en galería');
  } catch (error) {
    console.log('Error descargando imagen:', error);
    alert('Error descargando la imagen');
  }
};
