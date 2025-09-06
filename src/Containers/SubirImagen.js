import { decode as atob } from 'base-64';
import * as FileSystem from 'expo-file-system';
import { supabase } from '../Services/SupaBase';

export const SubirImagenASupabase = async (uri) => {
  try {
    if (!uri) {
      console.log('URI inválida');
      return null;
    }

    // Leer archivo en base64
    const base64 = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' });
    if (!base64) {
      console.log('No se pudo leer la imagen en base64');
      return null;
    }

    // Decodificar base64 a Uint8Array
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Obtener extensión válida
    const fileExt = (uri.split('.').pop() || 'png').toLowerCase();
    const validExtensions = ['png', 'jpg', 'jpeg', 'gif', 'webp'];
    const ext = validExtensions.includes(fileExt) ? fileExt : 'png';

    const fileName = `${Date.now()}.${ext}`;

    // Subir a Supabase
    const { error } = await supabase.storage
      .from('file')
      .upload(fileName, bytes, {
        contentType: `image/${ext === 'jpg' ? 'jpeg' : ext}`,
        upsert: false,
      });

    if (error) {
      console.log('Error subiendo imagen:', error);
      return null;
    }

    // Obtener URL pública
    const { data: urlData } = supabase.storage.from('file').getPublicUrl(fileName);
    return urlData?.publicUrl || null;

  } catch (e) {
    console.log('Error en subirImagenASupabase:', e);
    return null;
  }
};