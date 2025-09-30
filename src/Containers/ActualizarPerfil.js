import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import appFirebase from '../Services/Firebase';

const db = getFirestore(appFirebase);

export const actualizarPerfil = async (uid, datos) => {
  try {
    await updateDoc(doc(db, 'usuarios', uid), datos);
    return true;
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    return false;
  }
};
