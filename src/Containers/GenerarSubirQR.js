// qrService.js
import React, { useEffect } from 'react';
import { View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { captureRef } from 'react-native-view-shot';
import * as FileSystem from 'expo-file-system';
import { decode as atob } from 'base-64';
import { supabase } from '../Services/SupaBase';

// URL base de tu página web - CAMBIA ESTO POR TU DOMINIO REAL
const WEB_APP_BASE_URL = 'https://tudominio.com/oferta';

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

  const fullQRData = {
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
    userId: oferta.userId
  };

  // Crear URL con parámetros
  const urlParams = new URLSearchParams();
  
  // Agregar cada campo como parámetro codificado
  Object.keys(fullQRData).forEach(key => {
    if (fullQRData[key] !== null && fullQRData[key] !== undefined && fullQRData[key] !== '') {
      urlParams.append(key, encodeURIComponent(fullQRData[key]));
    }
  });

  // Construir la URL final
  const qrUrl = `${WEB_APP_BASE_URL}?${urlParams.toString()}`;

  console.log('URL generada para QR:', qrUrl); // Para verificar

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
        <QRCode value={qrUrl} size={200} />
      </View>
    );
  };

  setQrRender(<TempQRRenderer />);
};