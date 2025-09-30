import { View, Text, StyleSheet, Image, ActivityIndicator, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { usarTema } from '../../Containers/TemaApp';
import Boton from '../../Components/Boton';
import OfertasCard from '../../Components/OfertasCard';

import { PerfilDatos } from '../../Containers/DatosUsuario';

export default function PerfilUsuario({ navigation, route }) {
  const { modoOscuro } = usarTema();

  const {
    auth,
    usuarioData,
    ofertas,
    cargando,
  } = PerfilDatos(route);

  if (!usuarioData) {
    return (
      <SafeAreaView style={[styles.contenedor, modoOscuro ? styles.contenedorOscuro : styles.contenedorClaro, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={[styles.textoNombre, modoOscuro && styles.textoOscuro]}>
          No se encontraron datos del usuario
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['bottom']} style={{ flex: 1 }}>
      <ScrollView style={[modoOscuro ? styles.contenedorOscuro : styles.contenedorClaro]}>
        
        {/* Imagen de portada */}
        <View>
          <Image source={{ uri: usuarioData.fotoPortada }} style={styles.imagenPortada} />
        </View>

        {/* Imagen de perfil */}
        <View style={styles.contenedorImagenPerfil}>
          <Image source={{ uri: usuarioData.fotoPerfil }} style={styles.imagenPerfil} />
        </View>

        <Text style={[styles.textoNombre, modoOscuro && styles.textoOscuro]}>{usuarioData.nombre}</Text>
        <Text style={[styles.textoRol, modoOscuro && styles.textoOscuro]}>{usuarioData.rol}</Text>

        <View style={styles.botonEM}>
          {auth.currentUser?.uid !== usuarioData?.uid ? (
            <Boton
              nombreB="Mensaje"
              alto={30}
              ancho={90}
              onPress={() =>
                navigation.navigate('Chat', { otroUsuarioId: usuarioData.uid })
              }
            />
          ) : (
            <Boton
              nombreB="Editar perfil"
              alto={30}
              ancho={90}
              onPress={() => {
                navigation.navigate('Editar Informacion');
              }}
            />
          )}
        </View>

        <View style={[styles.separador, modoOscuro && { backgroundColor: '#555' }]} />

        {/* Sobre mí */}
        <Text style={[styles.tituloSobreMi, modoOscuro && styles.textoOscuro]}>Sobre mí</Text>
        <View style={[styles.cajaDescripcion, modoOscuro && { backgroundColor: '#333' }]}>
          <Text style={[styles.textoDescripcion, modoOscuro && styles.textoOscuro]}>
            {usuarioData.descripcion || ''}
          </Text>
        </View>

        {/* Ubicación */}
        <View style={styles.cajaUbicacion}>
          <Text style={[styles.textoUbicacion, modoOscuro && styles.textoOscuro]}>
            📍 {usuarioData.ubicacion || 'No especificado'}
          </Text>
        </View>

        {/* Ofertas */}
        <Text style={[styles.textoOferta, modoOscuro && styles.textoOscuro]}>Mis Ofertas</Text>
        {ofertas.map((item, index) => (
          <OfertasCard
            key={index}
            ImagenOferta={item.imagen}
            oferta={item}
            titulo={item.titulo}
            precio={`Precio: C$${item.ofertaLibra} por libra`}
            navigation={navigation}
            modoOscuro={modoOscuro}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    paddingHorizontal: 5,
    paddingTop: 20,
    paddingBottom: 20,
  },
  contenedorClaro: {
    backgroundColor: '#fff',
  },
  contenedorOscuro: {
    backgroundColor: '#000',
  },
  textoOscuro: {
    color: '#fff',
  },
  imagenPortada: {
    width: '96%',
    height: 110,
    borderRadius: 10,
    backgroundColor: '#999',
    marginTop: 5,
    marginLeft: 7.5
  },
  contenedorImagenPerfil: {
    marginTop: -35, 
    marginLeft: 15,
  },
  imagenPerfil: {
    width: 80,
    height: 80,
    borderRadius: 100,
    borderColor: '#fff',
    borderWidth: 3,
    backgroundColor: '#999',
  },
  encabezadoPerfil: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textoNombre: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 60,
    marginLeft: 10,
    marginTop: 5
  },
  textoRol: {
    fontSize: 12,
    marginBottom: 50,
    marginVertical: -60,
    marginLeft: 10
  },
  separador: {
    height: 2,
    width: '95%',
    backgroundColor: '#ccc',
    marginLeft: 10,
    marginTop: 35
  },
  tituloSobreMi: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 6,
    marginLeft: 10
  },
  cajaDescripcion: {
    backgroundColor: '#ccc',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    width: '95%',
    marginLeft: 10
  },
  textoDescripcion: {
    fontSize: 14,
    color: '#333',
  },
  cajaUbicacion: {
    marginTop: 6,
    marginBottom: 10,
  },
  textoUbicacion: {
    fontSize: 16,
    color: '#555',
    marginLeft: 5
  },
  seccionBotones: {
    marginTop: 20,
    alignItems: 'center',
  },
  textoOferta: {
    marginLeft: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  botonEM: {
    marginTop: -95,
    marginLeft: 270
  },
});
