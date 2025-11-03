import { Alert } from 'react-native';
import { signInWithEmailAndPassword, sendEmailVerification, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

export const IniciarLogin = async (auth, email, password, setUser, navigation) => {
  if (!email || !password) {
    Alert.alert('Campos incompletos', 'Por favor ingresa tu correo y contraseña');
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Verificación de email
    if (!user.emailVerified) {
      await signOut(auth); // Un solo cierre de sesión
      
      Alert.alert(
        'Verificación requerida',
        'Debes verificar tu correo electrónico antes de iniciar sesión.',
        [
          {
            text: 'Reenviar correo',
            onPress: async () => {
              try {
                // Reautenticar temporalmente SOLO para reenviar
                const tempUser = await signInWithEmailAndPassword(auth, email, password);
                await sendEmailVerification(tempUser.user);
                await signOut(auth);
                Alert.alert('Correo enviado', 'Se ha reenviado el correo de verificación.');
              } catch (error) {
                Alert.alert('Error', 'No se pudo reenviar el correo');
              }
            }
          },
          { 
            text: 'Entendido',
            onPress: () => setUser?.(null)
          }
        ]
      );
      return;
    }

    // Usuario verificado - proceder
    const db = getFirestore();
    const userDoc = await getDoc(doc(db, 'usuarios', user.uid));

    if (userDoc.exists()) {
      const userData = { uid: user.uid, ...userDoc.data() };
      setUser?.(userData);
      navigation?.replace('DrawerPrincipal');
    } else {
      throw new Error('Usuario no encontrado en la base de datos');
    }

  } catch (error) {
    console.log('Error en login:', error.code);
    
    let errorMessage = 'Correo o contraseña incorrectos';
    switch (error.code) {
      case 'auth/invalid-email':
        errorMessage = 'El correo electrónico no es válido';
        break;
      case 'auth/user-disabled':
        errorMessage = 'Esta cuenta ha sido deshabilitada';
        break;
      case 'auth/user-not-found':
        errorMessage = 'No existe una cuenta con este correo';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Contraseña incorrecta';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Demasiados intentos fallidos. Intenta más tarde';
        break;
      case 'auth/network-request-failed':
        errorMessage = 'Error de conexión. Verifica tu internet';
        break;
      default:
        errorMessage = error.message || 'Error al iniciar sesión';
    }
    
    Alert.alert('Error', errorMessage);
    if (setUser) setUser(null);
  }
};