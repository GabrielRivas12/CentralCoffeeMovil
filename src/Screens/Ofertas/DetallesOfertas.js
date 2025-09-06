import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, Image, TouchableOpacity } from 'react-native';
import Boton from '../../Components/Boton'
import appFirebase from '../../Services/Firebase';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';

import { usarTema } from '../../Containers/TemaApp';
import { obtenerUsuarioPorUID } from '../../Containers/ObtenerUsuarioOferta';
import { obtenerLugarDetalles } from '../../Containers/ObtenerLugarDetalles';
import { iniciarChatConUsuario } from '../../Containers/IniciarChat';

import { getFirestore } from 'firebase/firestore';

const db = getFirestore(appFirebase);
export default function DetallesOferta({ route, navigation }) {
  const { modoOscuro } = usarTema();
  const { oferta } = route.params;
  const [Ofertass, setOfertass] = useState([]);
  const [usuarioOferta, setUsuarioOferta] = useState(null);
  const [cargandoUsuario, setCargandoUsuario] = useState(true);
  const [selectedMarker, setSelectedMarker] = useState(null);

  useEffect(() => {
    if (oferta.userId) {
      obtenerUsuarioPorUID(db, oferta.userId).then((usuario) => {
        if (usuario) {
          setUsuarioOferta(usuario);
        }
      });
    }

    obtenerLugarDetalles(db, oferta.lugarSeleccionado, setSelectedMarker);
    if (oferta.uidUsuario) {
      obtenerUsuarioPorUID(db, oferta.uidUsuario).then((usuario) => {
        if (usuario) {
          console.log("✅ Usuario obtenido:", usuario); // <-- AÑADE ESTO
          setUsuarioOferta(usuario);
        } else {
          console.warn("⚠️ No se encontró usuario con ese UID");
        }
      }).catch((err) => {
        console.error("❌ Error al obtener usuario:", err);
      });
    }
  }, []);

  return (
    <View style={[styles.container, modoOscuro ? styles.containerOscuro : styles.containerClaro]}>
      <StatusBar backgroundColor='#ED6D4A' barStyle='light-content' />
      <SafeAreaView edges={['bottom']} style={{ flex: 1 }}>

        <View style={styles.containerListaImagen}>
          <Image
            source={{ uri: oferta.imagen }}
            style={{ width: '100%', height: '100%', borderRadius: 10 }}
            resizeMode="cover"
          />
        </View>

        <Text style={[styles.Titulo, modoOscuro ? styles.textoOscuro : styles.textoClaro]}>{oferta.titulo}</Text>

        {usuarioOferta && (
          <TouchableOpacity
            style={styles.perfilContainer}
            onPress={() => navigation.navigate('Perfil', { usuario: usuarioOferta })}
          >
            {usuarioOferta.fotoPerfil ? (
              <Image
                source={{ uri: usuarioOferta.fotoPerfil }}
                style={styles.imagenPerfil}
              />
            ) : (
              <View style={[styles.imagenPerfil, { backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center' }]}>
                <Feather name="user" size={24} color="#fff" />
              </View>
            )}

            <Text style={[styles.nombreUsuario, modoOscuro ? styles.textoOscuro : styles.textoClaro]}>
              {usuarioOferta.nombre || "Usuario desconocido"}
            </Text>

            <Feather name="arrow-right" size={20} color={modoOscuro ? "#fff" : "#000"} style={styles.iconoPerfil} />
          </TouchableOpacity>
        )}


        <View style={[styles.containerInformacion, modoOscuro && { backgroundColor: '#333' }]}>
          <Text style={[styles.TextoTitulo, modoOscuro ? styles.TextoTituloOscuro : styles.TextoTituloClaro]}>Características</Text>

          <View style={styles.row}>
            <View style={styles.col}>
              <View style={styles.TextoDato}>
                <Text style={[styles.TextoInfo, modoOscuro ? styles.textoOscuro : styles.textoClaro]}>
                  Tipo de café:
                </Text>
                <Text style={modoOscuro ? styles.textoOscuro : styles.textoClaro}>
                  {oferta.tipoCafe}
                </Text>
              </View>
            </View>
            <View style={styles.col}>
              <View style={styles.TextoDato}>
                <Text style={[styles.TextoInfo, modoOscuro ? styles.textoOscuro : styles.textoClaro]}>
                  Variedad:
                </Text>
                <Text style={modoOscuro ? styles.textoOscuro : styles.textoClaro}>
                  {oferta.variedad}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.col}>
              <View style={styles.TextoDato}>
                <Text style={[styles.TextoInfo, modoOscuro ? styles.textoOscuro : styles.textoClaro]}>
                  Estado del grano:
                </Text>
                <Text style={modoOscuro ? styles.textoOscuro : styles.textoClaro}>
                  {oferta.estadoGrano}
                </Text>
              </View>
            </View>
            <View style={styles.col}>
              <View style={styles.TextoDato}>
                <Text style={[styles.TextoInfo, modoOscuro ? styles.textoOscuro : styles.textoClaro]}>
                  Clima:
                </Text>
                <Text style={modoOscuro ? styles.textoOscuro : styles.textoClaro}>
                  {oferta.clima}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.col}>
              <View style={styles.TextoDato}>
                <Text style={[styles.TextoInfo, modoOscuro ? styles.textoOscuro : styles.textoClaro]}>
                  Altura:
                </Text>
                <Text style={modoOscuro ? styles.textoOscuro : styles.textoClaro}>
                  {oferta.altura}
                </Text>
              </View>
            </View>
            <View style={styles.col}>
              <View style={styles.TextoDato}>
                <Text style={[styles.TextoInfo, modoOscuro ? styles.textoOscuro : styles.textoClaro]}>
                  Proceso de corte:
                </Text>
                <Text style={modoOscuro ? styles.textoOscuro : styles.textoClaro}>
                  {oferta.procesoCorte}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.col}>
              <View style={styles.TextoDato}>
                <Text style={[styles.TextoInfo, modoOscuro ? styles.textoOscuro : styles.textoClaro]}>
                  Oferta por libra:
                </Text>
                <Text style={modoOscuro ? styles.textoOscuro : styles.textoClaro}>
                  {oferta.ofertaLibra}
                </Text>
              </View>
            </View>
            <View style={styles.col}>
              <View style={styles.TextoDato}>
                <Text style={[styles.TextoInfo, modoOscuro ? styles.textoOscuro : styles.textoClaro]}>
                  Fecha de cosecha:
                </Text>
                <Text style={modoOscuro ? styles.textoOscuro : styles.textoClaro}>
                  {oferta.fechaCosecha}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.col}>
              <View style={styles.TextoDato}>
                <Text style={[styles.TextoInfo, modoOscuro ? styles.textoOscuro : styles.textoClaro]}>
                  Cantidad de producción:
                </Text>
                <Text style={modoOscuro ? styles.textoOscuro : styles.textoClaro}>
                  {oferta.cantidadProduccion}
                </Text>
              </View>
            </View>
          </View>
        </View>





        {selectedMarker && (
          <View style={styles.bottomPanel}>
            <View style={styles.Icono}>
              <Feather name="map-pin" size={24} color="black" />
            </View>

            <Text style={[styles.infoTitle, modoOscuro ? styles.textoOscuro : styles.textoClaro]}>{selectedMarker.nombre}</Text>
            <Text style={[styles.infoText, modoOscuro ? styles.textoOscuro : styles.textoClaro]}>Horario: {selectedMarker.horario}</Text>

            <View style={styles.BotonInfo}>
              <Boton
                nombreB="Ir a Info"
                onPress={() => navigation.navigate('Más Información', {
                  marker: {
                    id: selectedMarker.id,
                    nombre: selectedMarker.nombre,
                    horario: selectedMarker.horario,
                    descripcion: selectedMarker.descripcion,
                    coordinate: {
                      latitude: selectedMarker.latitud,
                      longitude: selectedMarker.longitud
                    }
                  }
                })}
                backgroundColor="#fff"
                ancho="90"
                alto="40"

              />
            </View>
          </View>
        )}


        <View style={styles.BotonesContacto}>

          <Boton
            nombreB='Iniciar Chat'
            ancho='150'
            Textoright='10'
            ColorBoton="#ED6D4A"
            onPress={() => iniciarChatConUsuario(navigation, oferta)}

          />
          <Feather name="send" size={24} color="white" position='absolute' left='60%' bottom='12' />
        </View>
      </SafeAreaView>
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  containerClaro: {
    backgroundColor: '#fff',
  },
  containerOscuro: {
    backgroundColor: '#000',
  },

  containerInformacion: {
    backgroundColor: '#EBEBEB',
    width: 355,
    height: 300,
    borderRadius: 10,
  },

  containerListaImagen: {
    width: 355,
    height: 140,
    backgroundColor: '#999',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#999',
    marginBottom: 10,
    marginTop: 10
  },
  BotonesContacto: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    marginTop: 20,
    left: '26%'
  },
  Titulo: {
    marginLeft: 5,
    marginBottom: 10,
    fontSize: 20,
    fontWeight: 'bold',
  },

  TextoTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    top: 5,
    left: 20
  },
  perfilContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginLeft: 5,
  },

  imagenPerfil: {
    width: 50,
    height: 50,
    borderRadius: 25, // Esto lo hace circular
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 10,
  },

  nombreUsuario: {
    fontSize: 16,
    fontWeight: '600',
  },
  TextoTituloClaro: {
    color: '#000',
  },
  TextoTituloOscuro: {
    color: '#eee',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10
  },
  col: {
    flex: 1,
    paddingRight: 10,
  },
  bottomPanel: {
    position: 'relative',
    left: 0,
    padding: 10,
    borderRadius: 10,
    height: 70,
    top: 1


  },
  BotonInfo: {
    alignItems: 'center',
    position: 'absolute',
    bottom: 18,
    right: 0,

  },
  Icono: {
    width: 50,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    right: 10

  },
  infoTitle: {
    marginLeft: 60,
    position: 'absolute',
    top: 15,
  },
  infoText: {
    marginLeft: 60,
    position: 'absolute',
    top: 35,
  },
  textoClaro: {
    color: '#000',
  },
  textoOscuro: {
    color: '#fff',
  },

  TextoDato: {
    marginLeft: 30,
    marginTop: 15,
  },
  TextoInfo: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  iconoPerfil: {
    marginLeft: 'auto',
    marginRight: 10,
  }

});