import { Alert } from 'react-native';
import { 
  createUserWithEmailAndPassword, 
  sendEmailVerification,
  signOut 
} from 'firebase/auth';
import { auth } from '../Services/Firebase';
import { doc, setDoc, getFirestore } from 'firebase/firestore';
import appFirebase from '../Services/Firebase';

const db = getFirestore(appFirebase);

export const RegistroUsuario = async ({ 
  correo, 
  contrasena, 
  confirmarContrasena, 
  nombre, 
  valorSeleccionado, 
  limpiarFormulario,
  setUser,
  navigation
}) => {

  // 🔥 VALIDACIÓN COMPLETA DE CAMPOS
  if (!correo?.trim() || !contrasena?.trim() || !confirmarContrasena?.trim() || !nombre?.trim() || !valorSeleccionado) {
    Alert.alert('Campos incompletos', 'Por favor llena todos los campos y selecciona tu rol');
    return;
  }

  // Validar formato de correo
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(correo.trim())) {
    Alert.alert('Error', 'Por favor ingresa un correo electrónico válido');
    return;
  }

  // Validar longitud de contraseña
  if (contrasena.length < 6) {
    Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
    return;
  }

  if (contrasena !== confirmarContrasena) {
    Alert.alert('Error', 'Las contraseñas no coinciden');
    return;
  }

  // Validar nombre
  if (nombre.trim().length < 5) {
    Alert.alert('Error', 'El nombre debe tener al menos 5 caracteres');
    return;
  }

  try {
    console.log('Iniciando registro para:', correo);
    
    // CREAR USUARIO EN FIREBASE AUTH
    const userCredential = await createUserWithEmailAndPassword(auth, correo.trim(), contrasena);
    const user = userCredential.user;
    
    console.log('Usuario creado en Auth:', user.uid);

    //  ENVIAR CORREO DE VERIFICACIÓN
    await sendEmailVerification(user);
    console.log('Correo de verificación enviado');

    // GUARDAR DATOS EN FIRESTORE
    const userData = {
      nombre: nombre.trim(),
      correo: correo.trim(),
      rol: valorSeleccionado === '1' ? 'Comerciante' : 'Comprador',
      uid: user.uid,
      descripcion: 'Este usuario no tiene una descripcion',
      emailVerified: false,
      createdAt: new Date()
    };

    await setDoc(doc(db, "usuarios", user.uid), userData);
    console.log('Usuario guardado en Firestore');

    // CERRAR SESIÓN INMEDIATAMENTE
    await signOut(auth);
    console.log('Sesión cerrada');

    // Limpiar estado global
    if (setUser) setUser(null);

    Alert.alert(
      'Registro exitoso', 
      'Te hemos enviado un correo de verificación. Debes verificar tu cuenta antes de poder iniciar sesión.',
      [
        {
          text: 'Entendido',
          onPress: () => {
            if (limpiarFormulario) limpiarFormulario();
            if (navigation) navigation.goBack();
          }
        }
      ]
    );

  } catch (error) {
    console.log('Error completo en registro:', error);
    console.log('Código de error:', error.code);
    
    let errorMessage = 'Error al registrar usuario';
    
    // MANEJO DETALLADO DE ERRORES
    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'Este correo electrónico ya está registrado';
        break;
      case 'auth/invalid-email':
        errorMessage = 'El correo electrónico no tiene un formato válido';
        break;
      case 'auth/weak-password':
        errorMessage = 'La contraseña es demasiado débil. Debe tener al menos 6 caracteres';
        break;
      case 'auth/operation-not-allowed':
        errorMessage = 'El registro con email/contraseña no está habilitado';
        break;
      case 'auth/network-request-failed':
        errorMessage = 'Error de conexión. Verifica tu internet';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Demasiados intentos. Intenta más tarde';
        break;
      case 'firestore/permission-denied':
        errorMessage = 'Error de permisos en la base de datos';
        break;
      default:
        errorMessage = `Error: ${error.message || 'Error desconocido'}`;
    }
    
    Alert.alert('Error en el registro', errorMessage);
    
    // LIMPIAR EN CASO DE ERROR
    try {
      if (auth.currentUser) {
        await signOut(auth);
      }
      if (setUser) setUser(null);
    } catch (signOutError) {
      console.log('Error al cerrar sesión:', signOutError);
    }
  }
};