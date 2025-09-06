import { doc, getDoc, getFirestore } from 'firebase/firestore';
import appFirebase from '../Services/Firebase';

const db = getFirestore(appFirebase);

export const obtenerDatosUsuario = async (uid) => {
    try {
        const docRef = doc(db, 'usuarios', uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            return {
                nombre: data.nombre || uid,
                fotoPerfil: data.fotoPerfil || null
            };
        }
    } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
    }
    return { nombre: uid, fotoPerfil: null };
};

