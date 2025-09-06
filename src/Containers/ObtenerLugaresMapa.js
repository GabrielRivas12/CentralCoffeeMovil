import { collection, getDocs } from 'firebase/firestore';

export const obtenerLugaresMapa = async (db, setMarkers) => {
  try {
    const lugaresRef = collection(db, 'lugares');
    const snapshot = await getDocs(lugaresRef);
    const lugaresData = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        nombre: data.nombre,
        horario: data.horario,
        descripcion: data.descripcion,
        userId: data.userId, 
        coordinate: {
          latitude: data.latitud,
          longitude: data.longitud
        }
      };
    });

    setMarkers(lugaresData);
  } catch (error) {
    console.error('Error al obtener lugares: ', error);
  }
};
