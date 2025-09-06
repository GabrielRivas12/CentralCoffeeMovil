import { doc, getDoc } from "firebase/firestore";

export const leerDatosOferta = async (db, ofertaId) => {
  try {
    const ref = doc(db, "ofertas", ofertaId);
    const docSnap = await getDoc(ref);

    if (docSnap.exists()) { 
      return docSnap.data();
    } else {
      console.warn("No se encontró la oferta con ID:", ofertaId);
      return null;
    }
  } catch (error) {
    console.error("Error al obtener oferta:", error);
    return null;
  }
};
