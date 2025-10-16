import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Image, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import OfertasCard from '../../Components/OfertasCard';
import { useFocusEffect } from '@react-navigation/native';

import Ionicons from '@expo/vector-icons/Ionicons';

import { generarYSubirQR } from '../../Containers/GenerarSubirQR';
import { descargarImagen } from '../../Containers/DescargarQR';
import { usarTema } from '../../Containers/TemaApp';

import appFirebase from '../../Services/Firebase';
import { getAuth } from 'firebase/auth';
const auth = getAuth(appFirebase);
import {
  collection,
  getFirestore,
  query, doc,
  setDoc, getDocs, getDoc,
  deleteDoc, where
} from 'firebase/firestore';

const db = getFirestore(appFirebase);

export default function QRLista({ navigation }) {
  const { modoOscuro } = usarTema();

  const [Ofertass, setOfertass] = useState([]);
  const [qrImageUrl, setQrImageUrl] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [qrRender, setQrRender] = useState(null);


  useFocusEffect(
    React.useCallback(() => {
      LeerDatos();
    }, [])
  );


  const LeerDatos = async () => {
    const user = auth.currentUser;
    if (!user) {
      setOfertass([]);
      return;
    }

    const q = query(
      collection(db, "oferta"),
      where("userId", "==", user.uid)
    );

    const querySnapshot = await getDocs(q);
    const d = [];
    querySnapshot.forEach((doc) => {
      const datosBD = doc.data();
      d.push({ id: doc.id, ...datosBD });
    });
    setOfertass(d);
  };




  return (
    <View style={[styles.container, modoOscuro ? styles.containerOscuro : styles.containerClaro]}>
      <SafeAreaView edges={['bottom']} style={{ flex: 1, alignItems: 'center' }}>

        <Text style={[
          styles.Titulo, modoOscuro ? styles.TituloOscuro : styles.TituloClaro
        ]}> Lista de QR </Text>

        <ScrollView style={styles.containerCard} showsVerticalScrollIndicator={false} >
          {Ofertass.map((item, index) => (
            <View key={index} >
              <OfertasCard
                ImagenOferta={item.imagen}
                oferta={item}
                titulo={item.titulo}
                precio={`Precio: C$${item.ofertaLibra} por libra`}
                navigation={navigation}
                modoOscuro={modoOscuro}
              />
              <TouchableOpacity
                onPress={() => generarYSubirQR(item, setQrRender, setQrImageUrl, setModalVisible)}
                style={styles.botonCrearQR}>
                <Ionicons name="qr-code-outline" size={20} color={'#fff'} />
                <Text style={{ color: '#fff', marginLeft: 5, fontWeight:'bold' }}>Generar QR</Text>
              </TouchableOpacity>
            </View>
          ))}

        </ScrollView>
        {qrRender}

        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Código QR generado</Text>
              {qrImageUrl && (
                <Image
                  source={{ uri: qrImageUrl }}
                  style={{ width: 200, height: 200 }}
                  resizeMode="contain"
                />
              )}
              <View style={{ flexDirection: 'row', marginTop: 15 }}>
                <TouchableOpacity
                  onPress={() => descargarImagen(qrImageUrl)}
                  style={[styles.modalButton, { marginRight: 10, backgroundColor: '#28a745' }]}
                >
                  <Text style={styles.modalButtonText}>Descargar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={styles.modalButton}
                >
                  <Text style={styles.modalButtonText}>Cerrar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

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
  Titulo: {
    fontWeight: 'bold',
    fontSize: 18,
    right: 130,
    marginTop: 5
  },
  TituloClaro: {
    color: '#000',
  },
  TituloOscuro: {
    color: '#eee',
  },

  botonCrearQR: {
    position: 'absolute',
    top: 201,
    right: 90,
    backgroundColor: '#ED6D4A',
    borderRadius: 5, 
    height: 30,
    width: 115,
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingHorizontal: 8, 
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 5,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },

});