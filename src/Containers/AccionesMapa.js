// mapUtils.js
import { Alert } from 'react-native';

export const zoomIn = (region, setRegion) => {
  setRegion({
    ...region,
    latitudeDelta: region.latitudeDelta / 2,
    longitudeDelta: region.longitudeDelta / 2,
  });
};

export const zoomOut = (region, setRegion) => {
  setRegion({
    ...region,
    latitudeDelta: region.latitudeDelta * 2,
    longitudeDelta: region.longitudeDelta * 2,
  });
};

export const handleMapPress = (event, navigation) => {
  const { coordinate } = event.nativeEvent;

  Alert.alert(
    'Agregar lugar',
    '¿Deseas registrar un nuevo lugar aquí?',
    [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Sí',
        onPress: () => {
          navigation.navigate('Crear Marcador', { coordinate });
        },
      },
    ],
    { cancelable: true }
  );
};

export const handleMarkerPress = (marker, setSelectedMarker) => {
  setSelectedMarker(marker);
};
