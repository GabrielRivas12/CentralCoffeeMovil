import { Alert } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

export const IniciarLogin = async (auth, email, password, setUser) => {
  if (!email || !password) {
    Alert.alert('Campos incompletos', 'Por favor ingresa tu correo y contraseña');
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    // Obtener datos del usuario en Firestore
    const docRef = doc(getFirestore(), 'usuarios', uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const userData = { uid, ...docSnap.data() };
      setUser(userData); // Actualiza el estado global para navegar al Drawer
    } else {
      Alert.alert('Error', 'Usuario no encontrado en Firestore');
    }
  } catch (error) {
    Alert.alert('Error', 'Correo o contraseña incorrectos');
  }
};
