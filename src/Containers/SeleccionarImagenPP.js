import * as FileSystem from 'expo-file-system';
import { decode as atob } from 'base-64';
import { supabase } from '../Services/SupaBase';
import { SeleccionarImagen as picker } from './SeleccionarImagen';

// Función que sube la imagen a Supabase
const subirImagenASupabase = async (uri, bucketPath) => {
  try {
    if (!uri) return null;

    const base64 = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' });
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);

    const ext = (uri.split('.').pop() || 'png').toLowerCase();
    const fileName = `${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from(bucketPath)
      .upload(fileName, bytes, { contentType: `image/${ext}` });

    if (error) throw error;

    const { data } = supabase.storage.from(bucketPath).getPublicUrl(fileName);
    return data?.publicUrl || null;
  } catch (e) {
    console.error('Error subirImagenASupabase:', e);
    return null;
  }
};

// Función para seleccionar imagen (perfil o portada) y subirla
export const seleccionarImagen = async (bucketPath) => {
  const uri = await picker();
  if (!uri) return null;
  return await subirImagenASupabase(uri, bucketPath);
};
