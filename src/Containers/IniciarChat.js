import { obtenerDatosUsuario } from '../Containers/ObtenerUsuario';


export const iniciarChatConUsuario = async (navigation, oferta) => {
  try {
    const datos = await obtenerDatosUsuario(oferta.userId);

    navigation.navigate('Chat', {
      otroUsuarioId: oferta.userId,
      nombre: datos.nombre,
      fotoPerfil: datos.fotoPerfil,
      ofertaReferencia: oferta
    });
  } catch (error) {
    console.error('Error al iniciar chat:', error);
  }
};
