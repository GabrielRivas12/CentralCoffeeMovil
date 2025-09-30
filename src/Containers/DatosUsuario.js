import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import {
  collection,
  getFirestore,
  query,
  doc,
  getDocs,
  getDoc,
  where
} from 'firebase/firestore';
import appFirebase from '../Services/Firebase';

const auth = getAuth(appFirebase);
const db = getFirestore(appFirebase);

export function PerfilDatos(route) {
  const [user, setUser] = useState(null);
  const [usuarioData, setUsuarioData] = useState(null);
  const [ofertas, setOfertas] = useState([]);
  const [cargando, setCargando] = useState(true);

  const LeerOfertas = async (uid) => {
    const q = query(collection(db, 'oferta'), where('userId', '==', uid));
    const snapshot = await getDocs(q);
    const datos = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
    setOfertas(datos);
  };

  useFocusEffect( 
    useCallback(() => {
      let activo = true;

      const cargarDatos = async () => {
        setCargando(true);
        try {
          const usuarioParam = route?.params?.usuario;
          let currentUser = null;

          if (usuarioParam) {
            if (!activo) return;
            setUsuarioData(usuarioParam);
            currentUser = { uid: usuarioParam.uid };
            setUser(currentUser);
          } else {
            currentUser = auth.currentUser;
            if (currentUser) {
              setUser(currentUser);
              const docRef = doc(db, 'usuarios', currentUser.uid);
              const docSnap = await getDoc(docRef);
              if (docSnap.exists() && activo) {
                setUsuarioData(docSnap.data());
              }
            } else {
              console.log('No hay usuario logueado');
            }
          }

          if (currentUser) {
            await LeerOfertas(currentUser.uid);
          } else {
            setOfertas([]);
          }
        } catch (error) {
          console.error('Error al cargar datos del usuario:', error);
        } finally {
          if (activo) setCargando(false);
        }
      };

      cargarDatos();

      return () => {
        activo = false;
      };
    }, [route?.params?.usuario])
  );

  return {
    auth,
    user,
    usuarioData,
    ofertas,
    cargando,
  };
}
