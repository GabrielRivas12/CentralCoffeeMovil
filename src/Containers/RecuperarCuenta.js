 import { Alert } from 'react-native';
 import { sendPasswordResetEmail } from 'firebase/auth';
 
export const enviarRecuperacion = async (auth, correoReset, onSuccess) => {
  if (!correoReset) {
    Alert.alert('Error', 'Por favor ingresa tu correo.');
    return;
  }

  try {
    await sendPasswordResetEmail(auth, correoReset);
    Alert.alert('Revisa tu correo', 'Te enviamos un enlace para restablecer tu contraseña.');

    if (onSuccess) onSuccess(); // Ejecuta solo si se proporcionó
  } catch (error) {
    console.error('Error enviando recuperación:', error);
    Alert.alert('Error', 'No se pudo enviar el correo. Verifica que esté registrado.');
  }
};

   export const IniciarTemporizador = (setTiempoRestante, setBloquearBoton) => {
    setTiempoRestante(15);
    const interval = setInterval(() => {
      setTiempoRestante((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setBloquearBoton(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };