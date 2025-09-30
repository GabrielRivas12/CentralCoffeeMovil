import { getFirestore, doc, getDoc } from 'firebase/firestore';
import appFirebase from '../Services/Firebase';

const db = getFirestore(appFirebase);

export const cargarDatosUsuario = async (uid) => {
  try {
    const docRef = doc(db, 'usuarios', uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error('Error al cargar datos del usuario:', error);
    return null;
  }
};
