import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Boton from '../../Components/Boton';
import MapView, { Marker } from 'react-native-maps';
import Feather from '@expo/vector-icons/Feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { DirigirGoogleMaps } from '../../Containers/DirigirGoogleMaps';
import { usarTema } from '../../Containers/TemaApp';
import { eliminarLugar } from '../../Containers/EliminarUbicacion';

import { getAuth } from 'firebase/auth';
import appFirebase from '../../Services/Firebase';

const auth = getAuth(appFirebase);

export default function DetallesMapa({ route, navigation }) {
  const { marker } = route.params;
  const { modoOscuro } = usarTema();

  const [usuarioId, setUsuarioId] = useState(null);

  useEffect(() => {
    const user = auth.currentUser;
    setUsuarioId(user ? user.uid : null);

    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUsuarioId(user ? user.uid : null);
    });

    return () => unsubscribe();
  }, []);

  const esCreador = marker.userId === usuarioId;

  return (
    <View style={[styles.container, modoOscuro ? styles.containerOscuro : styles.containerClaro]}>
      <SafeAreaView edges={['bottom']} style={{ flex: 1 }}>
        <View style={styles.mapaContainer}>
          {marker.coordinate && (
            <MapView
              style={styles.previewMap}
              initialRegion={{
                latitude: marker.coordinate.latitude,
                longitude: marker.coordinate.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }}
              scrollEnabled={false}
              zoomEnabled={false}
              rotateEnabled={false}
              pitchEnabled={false}
            >
              <Marker coordinate={marker.coordinate} />
            </MapView>
          )}
        </View>

        <View style={styles.PanelUbicacion}>
          <View style={styles.Icono}>
            <Feather name="map-pin" size={24} color={modoOscuro ? 'white' : 'black'} />
          </View>

          <Text
            style={[
              styles.infoNombre,
              modoOscuro ? styles.infoNombreOscuro : styles.infoNombreClaro,
            ]}
          >
            {marker.nombre}
          </Text>
          <Text style={[styles.infoHorario, modoOscuro ? styles.infoHorarioOscuro : styles.infoHorarioClaro]}>
            Horario: {marker.horario}
          </Text>
        </View>

        <View style={styles.containerDescripcion}>
          <Text style={[styles.DescripcionText, modoOscuro ? styles.textOscuro : styles.textClaro]}>
            Descripción:
          </Text>
          <Text style={[modoOscuro ? styles.textOscuro : styles.textClaro]}>
            {marker.descripcion}
          </Text>
        </View>

        <View style={styles.botonllegar}>
          <Boton
            nombreB=" "
            onPress={() => DirigirGoogleMaps(marker.coordinate)}
            backgroundColor="#ddd"
            ancho="50"
            alto="45"
            Textoright="15"
          />
          <View pointerEvents="none" style={{ position: 'absolute' }}>
            <MaterialCommunityIcons
              name="directions"
              size={30}
              color="white"
              position="absolute"
              top="10"
              left="10"
            />
          </View>
        </View>

        {esCreador && (
          <View style={styles.botonesAccionContainer}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Crear Marcador', {
                  editar: true,
                  marker,
                  coordinate: marker.coordinate,
                });
              }}
              style={styles.botonAccion}
            >
              <Feather name="edit" size={28} color="blue" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  '¿Eliminar ubicación?',
                  'Esta acción no se puede deshacer.',
                  [
                    { text: 'Cancelar', style: 'cancel' },
                    {
                      text: 'Eliminar',
                      style: 'destructive',
                      onPress: async () => {
                        const eliminado = await eliminarLugar(marker.id);
                        if (eliminado) {
                          alert('Lugar eliminado con éxito');
                          navigation.goBack();
                        } else {
                          alert('Error al eliminar el lugar');
                        }
                      },
                    },
                  ],
                  { cancelable: true }
                );
              }}
              style={styles.botonAccion}
            >
              <Feather name="trash" size={28} color="red" />
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerClaro: {
    backgroundColor: '#fff',
  },
  containerOscuro: {
    backgroundColor: '#000',
  },
  previewMap: {
    flex: 1,
  },
  mapaContainer: {
    width: 360,
    height: 200,
    marginBottom: 15,
    top: 10,
    left: 8,
    borderRadius: 10,
    borderColor: '#000',
    overflow: 'hidden',
  },
  containerDescripcion: {
    width: 375,
    height: 200,
    top: 50,
    left: 8,
  },
  PanelUbicacion: {
    borderRadius: 10,
    height: 70,
    top: 30,
  },
  Icono: {
    width: 50,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    left: 8,
  },
  infoNombre: {
    position: 'absolute',
    top: 5,
    left: 70,
  },
  infoNombreClaro: {
    color: '#000',
  },
  infoNombreOscuro: {
    color: '#fff',
  },
  infoHorario: {
    position: 'absolute',
    top: 25,
    left: 70,
  },
  infoHorarioClaro: {
    color: '#000',
  },
  infoHorarioOscuro: {
    color: '#fff',
  },
  DescripcionText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  textClaro: {
    color: '#000',
  },
  textOscuro: {
    color: '#fff',
  },
  botonllegar: {
    position: 'absolute',
    top: 245,
    right: 8,
  },
  botonesAccionContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 15,
  },
  botonAccion: {
    marginLeft: 20,
    padding: 5,
  },
});
