import { Alert } from 'react-native';
import {
  collection,
  doc,
  addDoc,
  setDoc,
  getFirestore,
} from 'firebase/firestore';
import appFirebase from '../Services/Firebase';
import { getAuth } from 'firebase/auth';

const db = getFirestore(appFirebase);

export const GuardarMarcador = async ({
  coord,
  nombre,
  descripcion,
  horario,
  editar = false,
  idLugar = null,
  navigation = null, 
}) => {
  try {
    // Validación de campos obligatorios
    if (!coord || !nombre || !descripcion || !horario) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      Alert.alert('Error', 'No hay usuario autenticado.');
      return;
    }

    const lugarData = {
      nombre,
      descripcion,
      horario,
      latitud: coord.latitude,
      longitud: coord.longitude,
      userId: user.uid,
    };

    if (editar && idLugar) {
      await setDoc(doc(db, 'lugares', idLugar), lugarData);
      Alert.alert('Éxito', 'Lugar actualizado correctamente.', [
        {
          text: 'Aceptar',
          onPress: () => {
            if (navigation && typeof navigation.navigate === 'function') {
              navigation.navigate('ScreenMapa');
            }
          },
        },
      ]);
    } else {
      await addDoc(collection(db, 'lugares'), lugarData);
      Alert.alert('Éxito', 'Lugar creado correctamente.', [
        {
          text: 'Aceptar',
          onPress: () => {
            if (navigation && typeof navigation.navigate === 'function') {
              navigation.navigate('ScreenMapa');
            }
          },
        },
      ]);
    }
  } catch (error) {
    console.error('Error al guardar el lugar:', error);
    Alert.alert('Error', 'No se pudo guardar el lugar.');
  }
};
