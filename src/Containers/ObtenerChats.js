import { obtenerChatsDelUsuario } from "./ObtenerChat";

export const fetchChats = async (userId, setChats) => {
    if (!userId) return;
    try {
        const chats = await obtenerChatsDelUsuario(userId);
        setChats(chats);
    } catch (error) {
        console.error('Error al obtener chats:', error);
    }
};  

export const irAlChat = (navigation, otroUsuarioId, nombreOtroUsuario, fotoPerfil, inicial, colorFondo) => {
    navigation.navigate('Chat', {
        otroUsuarioId,
        nombreOtroUsuario,
        fotoPerfil,
        inicial,
        colorFondo
    });
};


export const formatDate = (date) => {
    if (!date) return '';
    const now = new Date();
    if (date.toDateString() === now.toDateString()) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString();
};
