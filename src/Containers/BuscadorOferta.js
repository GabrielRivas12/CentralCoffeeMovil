import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import appFirebase from '../Services/Firebase';

const db = getFirestore(appFirebase);

export const BuscarOferta = async (valorbuscado) => {
    if (!valorbuscado || valorbuscado.trim() === '') return;

    const q = query(
        collection(db, "oferta"),
        where("estado", "==", "Activo") // Filtro en el servidor
    );
    
    const querySnapshot = await getDocs(q);
    const resultados = [];
    const textoBuscado = valorbuscado.toLowerCase();

    querySnapshot.forEach((doc) => {
        const ofertaEncontrado = doc.data();

        if (
            ofertaEncontrado.titulo &&
            ofertaEncontrado.titulo.toLowerCase().includes(textoBuscado)
        ) {
            resultados.push(ofertaEncontrado);
        }
    });

    return resultados;
};