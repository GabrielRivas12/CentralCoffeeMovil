// qrService.js
import React, { useEffect } from 'react';
import { View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { captureRef } from 'react-native-view-shot';
import * as FileSystem from 'expo-file-system';
import { decode as atob } from 'base-64';
import { supabase } from '../Services/SupaBase';

export const generarYSubirQR = async (oferta, setQrRender, setQrImageUrl, setModalVisible) => {
  const nombreQR = `${oferta.id}.png`;

  // Verifica si ya existe
  const { data: existingFile } = await supabase
    .storage
    .from('qr')
    .list('', { search: nombreQR });

  if (existingFile?.length > 0) {
    const { data: urlData } = supabase.storage.from('qr').getPublicUrl(nombreQR);
    setQrImageUrl(urlData.publicUrl);
    setModalVisible(true);
    return;
  }

  // Crear objeto JSON con todos los datos de la oferta
  const qrData = {
    id: oferta.id,
    titulo: oferta.titulo,
    tipoCafe: oferta.tipoCafe,
    variedad: oferta.variedad,
    estadoGrano: oferta.estadoGrano,
    clima: oferta.clima,
    altura: oferta.altura,
    procesoCorte: oferta.procesoCorte,
    fechaCosecha: oferta.fechaCosecha,
    cantidadProduccion: oferta.cantidadProduccion,
    ofertaLibra: oferta.ofertaLibra,
    imagen: oferta.imagen,
    lugarSeleccionado: oferta.lugarSeleccionado,
    userId: oferta.userId,
    timestamp: new Date().toISOString(),
    tipo: 'oferta_cafe' // Identificador del tipo de datos
  };

  // Convertir el JSON a string para el QR
  const jsonString = JSON.stringify(qrData);

  console.log('Datos JSON para QR:', jsonString);

  const tempRef = React.createRef();

  const onRendered = async () => {
    try {
      const uri = await captureRef(tempRef.current, {
        format: 'png',
        quality: 1,
      });

      const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
      const binaryString = atob(base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const { error: uploadError } = await supabase.storage
        .from('qr')
        .upload(nombreQR, bytes, {
          contentType: 'image/png',
          upsert: false,
        });

      if (uploadError) {
        console.log('Error subiendo imagen:', uploadError);
        return;
      }

      const { data: urlData } = supabase.storage.from('qr').getPublicUrl(nombreQR);
      setQrImageUrl(urlData.publicUrl);
      setModalVisible(true);
      setQrRender(null);
    } catch (err) {
      console.log('Error al capturar y subir QR:', err);
    }
  };

  const TempQRRenderer = () => {
    useEffect(() => {
      onRendered();
    }, []);

    return (
      <View ref={tempRef} collapsable={false} style={{ position: 'absolute', top: -1000, left: -1000 }}>
        <QRCode value={jsonString} size={200} />
      </View>
    );
  };

  setQrRender(<TempQRRenderer />);
};

// Función para decodificar los datos del QR
export const decodificarDatosQR = (data) => {
  try {
    // Si los datos vienen como string JSON
    if (typeof data === 'string') {
      // Intentar parsear como JSON directamente
      const parsedData = JSON.parse(data);
      
      // Verificar si tiene la estructura esperada
      if (parsedData && parsedData.tipo === 'oferta_cafe') {
        return parsedData;
      }
      
      // Si no tiene el tipo, pero tiene campos básicos de oferta
      if (parsedData && parsedData.id && parsedData.titulo) {
        return parsedData;
      }
    }
    
    return null;
  } catch (error) {
    console.log('Error decodificando datos QR:', error);
    
    // Intentar limpiar y parsear si hay caracteres extraños
    try {
      const cleanedData = data.replace(/[^\x20-\x7E]/g, '');
      const parsedData = JSON.parse(cleanedData);
      return parsedData;
    } catch (secondError) {
      console.log('Error en segundo intento de parseo:', secondError);
      return null;
    }
  }
};

// Función para validar la estructura de los datos del QR
export const validarDatosOferta = (datos) => {
  if (!datos) return false;
  
  const camposRequeridos = ['id', 'titulo', 'tipoCafe', 'ofertaLibra'];
  return camposRequeridos.every(campo => datos[campo] !== undefined && datos[campo] !== null);
};