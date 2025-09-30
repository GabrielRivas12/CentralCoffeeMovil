import React, { useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAuth } from 'firebase/auth';

import { usarTema } from '../../Containers/TemaApp';
import Boton from '../../Components/Boton';
import InputText from '../../Components/TextInput';
import { cargarDatosUsuario } from '../../Containers/ObtenerDatosUsuario';
import { seleccionarImagen } from '../../Containers/SeleccionarImagenPP';
import { actualizarPerfil } from '../../Containers/ActualizarPerfil';

export default function EditarInformacion({ navigation }) {
  const auth = getAuth();
  const user = auth.currentUser;
  const { modoOscuro } = usarTema();

  const [nombre, setNombre] = useState('');
  const [rol, setRol] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [fotoPerfil, setFotoPerfil] = useState('');
  const [fotoPortada, setFotoPortada] = useState('');

  // Cargar datos existentes
  const cargarDatos = async () => {
    if (!user) return;
    const data = await cargarDatosUsuario(user.uid);
    if (!data) return;

    setNombre(data.nombre || '');
    setRol(data.rol || '');
    setDescripcion(data.descripcion || '');
    setUbicacion(data.ubicacion || '');
    setFotoPerfil(data.fotoPerfil || '');
    setFotoPortada(data.fotoPortada || '');
  };

   // Se ejecuta cada vez que la pantalla está en foco
  useFocusEffect(
    useCallback(() => {
      cargarDatos();
    }, [])
  );

  // Seleccionar imagen de perfil
  const cambiarFotoPerfil = async () => {
    const url = await seleccionarImagen('fotosperfil');
    if (url) setFotoPerfil(url);
  };

  // Seleccionar imagen de portada
  const cambiarFotoPortada = async () => {
    const url = await seleccionarImagen('fotoportada');
    if (url) setFotoPortada(url);
  };

  // Guardar cambios
  const guardarCambios = async () => {
    if (!user) return;

    const exito = await actualizarPerfil(user.uid, {
      nombre,
      rol,
      descripcion,
      ubicacion,
      fotoPerfil,
      fotoPortada
    });

    if (exito) {
      Alert.alert('Éxito', 'Datos actualizados correctamente');
      navigation.goBack();
    } else {
      Alert.alert('Error', 'No se pudieron guardar los cambios');
    }
  };

  return (
    <SafeAreaView
      style={[{ flex: 1 }, modoOscuro ? styles.fondoOscuro : styles.fondoClaro]}
      edges={['bottom']}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Imagen de portada */}
        <TouchableOpacity onPress={cambiarFotoPortada} style={styles.imagenPortada}>
          {fotoPortada ? (
            <>
              <Image source={{ uri: fotoPortada }} style={styles.imagenPortada} />
              <Text style={styles.textoEncima}>Seleccionar portada</Text>
            </>
          ) : (
            <Text style={styles.textoImagen}>Seleccionar portada</Text>
          )}
        </TouchableOpacity>

        {/* Imagen de perfil */}
        <TouchableOpacity onPress={cambiarFotoPerfil} style={styles.contenedorImagenPerfil}>
          {fotoPerfil ? (
            <>
              <Image source={{ uri: fotoPerfil }} style={styles.imagenPerfil} />
              <Text style={styles.textoEncimaPerfil}>Perfil</Text>
            </>
          ) : (
            <Text style={styles.textoImagen}>Perfil</Text>
          )}
        </TouchableOpacity>

        {/* Inputs */}
        <View style={{ marginTop: 60 }}>
          <InputText
            NombreLabel="Nombre"
            Valor={nombre}
            onchangetext={setNombre}
            placeholder="Ingresa tu nombre"
            ancho='100%'
          />

          <InputText
            NombreLabel="Descripción"
            Valor={descripcion}
            onchangetext={setDescripcion}
            placeholder="Cuéntanos sobre ti"
            maxCaracteres={300}
            ancho='100%'
          />

          <InputText
            NombreLabel="Ubicación"
            Valor={ubicacion}
            onchangetext={setUbicacion}
            placeholder="Ciudad o municipio"
            ancho='100%'
          />
        </View>

        <Boton nombreB="Guardar Cambios" onPress={guardarCambios} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingTop: 15,
  },
  fondoClaro: { backgroundColor: '#fff' },
  fondoOscuro: { backgroundColor: '#000' },

  imagenPortada: {
    width: '100%',
    height: 110,
    borderRadius: 10,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contenedorImagenPerfil: {
    position: 'absolute',
    top: 90,
    left: 18,
    zIndex: 10,
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 3,
    borderColor: '#fff',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ccc'
  },
  imagenPerfil: {
    width: '100%',
    height: '100%',
    borderRadius: 43,
    backgroundColor: '#999',
  },

  textoImagen: {
    color: '#444',
    fontSize: 14,
  },
  textoEncima: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: '#fff',
    fontSize: 16,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 10,
    borderRadius: 10,
  },
  textoEncimaPerfil: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: '#fff',
    fontSize: 14,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 40,
    zIndex: 10,
  },
});
