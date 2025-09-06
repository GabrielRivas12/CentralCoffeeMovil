import { doc, getDoc } from 'firebase/firestore';

export const obtenerLugarDetalles = async (db, lugarId, setSelectedMarker) => {
  try {
    const docRef = doc(db, "lugares", lugarId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setSelectedMarker({ id: docSnap.id, ...docSnap.data() });
    } else {
      console.log("No se encontró el lugar");
    }
  } catch (error) {
    console.error("Error al obtener el lugar:", error);
  }
};
