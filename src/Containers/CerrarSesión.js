// src/Utils/handleLogout.js
import { signOut } from 'firebase/auth';
import { auth } from '../Services/Firebase'; // Ajusta la ruta si tu archivo Firebase está en otra carpeta

const Logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
  }
};

export default Logout;
