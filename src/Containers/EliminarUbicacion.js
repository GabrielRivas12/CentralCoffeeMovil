import { doc, deleteDoc, getFirestore } from 'firebase/firestore';
import appFirebase from '../Services/Firebase';

const db = getFirestore(appFirebase);

export const eliminarLugar = async (idLugar) => {
  try {
    await deleteDoc(doc(db, 'lugares', idLugar));
    return true;
  } catch (error) {
    console.error('Error al eliminar el lugar:', error);
    return false;
  }
};
