import { Alert } from 'react-native';
import appFirebase from '../Services/Firebase';
import { supabase } from '../Services/SupaBase';

import {
    collection,
    getFirestore,
    query, doc,
    setDoc, getDocs, getDoc,
    deleteDoc, updateDoc, where
} from 'firebase/firestore';

const db = getFirestore(appFirebase);

export const EliminarOferta = async (id, LeerDatos) => {
    Alert.alert(
        'Confirmar eliminación',
        '¿Estás seguro de que deseas eliminar el registro?',
        [
            {
                text: 'Cancelar',
                style: 'cancel',
            },
            {
                text: 'Eliminar',
                style: 'destructive',
                onPress: async () => {
                    try {
                        //  Obtener datos del documento para acceder a la URL de la imagen
                        const docRef = doc(db, "oferta", id);
                        const ofertaSnap = await getDoc(docRef);
                        const ofertaData = ofertaSnap.data();

                        if (ofertaData?.Nimagen) {
                            const imageUrl = ofertaData.imagen;


                            // Extraer ruta relativa al bucket
                            const pathStart = imageUrl.indexOf('/file/') + 6; 
                            const filePath = imageUrl.substring(pathStart).split('?')[0]; 

                            // Eliminar del bucket "file"
                            const { error } = await supabase
                                .storage
                                .from('file')
                                .remove([filePath]);

                            if (error) {
                                console.error('Error al eliminar imagen de Supabase:', error.message);
                            }
                        }

                        // Eliminar el documento en Firestore
                        await deleteDoc(docRef);
                        await LeerDatos();
                    } catch (error) {
                        console.error('Error al eliminar la oferta:', error.message);
                        Alert.alert('Error', 'No se pudo eliminar la oferta correctamente.');
                    }
                }
            },
        ],
        { cancelable: true }
    );
};