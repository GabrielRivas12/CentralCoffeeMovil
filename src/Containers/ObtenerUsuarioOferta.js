import { doc, getDoc } from "firebase/firestore";

export const obtenerUsuarioPorUID = async (db, uid) => {
  try {
    const docRef = doc(db, "usuarios", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.warn("No se encontró el usuario con UID:", uid);
      return null;
    }
  } catch (error) {
    console.error("Error obteniendo datos del usuario:", error);
    return null;
  }
};
