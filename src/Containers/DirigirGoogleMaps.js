import { Linking, Alert } from 'react-native';

export const DirigirGoogleMaps = (coordinate) => {
  if (!coordinate) {
    Alert.alert('Error', 'Coordenadas no disponibles');
    return;
  }

  const { latitude, longitude } = coordinate;
  const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
  Linking.openURL(url).catch(() =>
    Alert.alert('Error', 'No se pudo abrir Google Maps')
  );
};
