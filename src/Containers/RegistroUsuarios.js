import { Alert } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../Services/Firebase';
import { doc, setDoc, getFirestore, getDoc } from 'firebase/firestore';
import appFirebase from '../Services/Firebase';

const db = getFirestore(appFirebase);

export const RegistroUsuario = async ({ 
  correo, 
  contrasena, 
  confirmarContrasena, 
  nombre, 
  valorSeleccionado, 
  limpiarFormulario,
  setUser,          // 👈 recibe el setter del contexto global
  navigation        // 👈 para ir atrás o navegar al Drawer
}) => {

  if (!correo || !contrasena || !confirmarContrasena || !nombre || !valorSeleccionado) {
    Alert.alert('Campos incompletos', 'Por favor llena todos los campos y selecciona tu rol');
    return;
  }

  if (contrasena !== confirmarContrasena) {
    Alert.alert('Error', 'Las contraseñas no coinciden');
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, correo, contrasena);
    const user = userCredential.user;

    await setDoc(doc(db, "usuarios", user.uid), {
      nombre: nombre,
      correo: correo,
      rol: valorSeleccionado === '1' ? 'Comerciante' : 'Comprador',
      uid: user.uid,
      descripcion: 'Este usuario no tiene una descripcion'
    });

    // ✅ Obtener los datos desde Firestore
    const docRef = doc(db, 'usuarios', user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const userData = { uid: user.uid, ...docSnap.data() };
      setUser(userData); // 👈 actualiza el contexto global
    }

    Alert.alert('Registro exitoso', 'Usuario creado correctamente');
    limpiarFormulario();

    // ✅ Navegar según rol o regresar
    // navigation.goBack();
    // O si usas Drawer automático:
    // navigation.replace('DrawerPrincipal');

  } catch (error) {
    Alert.alert('Error al registrar', error.message);
  }
};
