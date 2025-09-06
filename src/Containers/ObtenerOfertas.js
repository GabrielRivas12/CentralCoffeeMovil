import { collection, getDocs, getFirestore, query } from 'firebase/firestore';
import appFirebase from '../Services/Firebase';

const db = getFirestore(appFirebase);

export const LeerDatos = async () => {
    const q = query(collection(db, "oferta"));
    const querySnapshot = await getDocs(q);
    const d = [];
    querySnapshot.forEach((doc) => {
        const datosBD = doc.data();
        if (datosBD.estado === 'Activo') {
            d.push(datosBD);
        }
    });
    return d;
}