import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, StatusBar, Modal, TextInput } from 'react-native';
import InputText from '../../Components/TextInput';
import Boton from '../../Components/Boton';
import * as WebBrowser from 'expo-web-browser';
import { auth, appFirebase } from '../../Services/Firebase';
import { SafeAreaView } from 'react-native-safe-area-context';

import { IniciarLogin } from '../../Containers/IniciarSesion';
import { enviarRecuperacion, IniciarTemporizador } from '../../Containers/RecuperarCuenta';
import { usarTema } from '../../Containers/TemaApp';

import { getFirestore } from 'firebase/firestore';

const db = getFirestore(appFirebase);

WebBrowser.maybeCompleteAuthSession();

export default function Login({ navigation, setUser }) {

  const { modoOscuro } = usarTema();

  const [Correo, setCorreo] = useState('');
  const [Contraseña, setContraseña] = useState('');

  const [bloquearBoton, setBloquearBoton] = useState(false);
  const [tiempoRestante, setTiempoRestante] = useState(0);

  const [modalVisible, setModalVisible] = useState(false);
  const [correoReset, setCorreoReset] = useState('');

  return (
    <View style={[styles.container, modoOscuro ? styles.containerOscuro : styles.containerClaro]}>
      <StatusBar backgroundColor='#F1A89B' barStyle='light-content' />
      <SafeAreaView style={{ backgroundColor: '#F1A89B', flex: 1, alignItems: 'center' }}>
        <View style={styles.containerBanner}>
          <View style={styles.bannerContent}>
            <View style={styles.logoContainer}>
              <Image
                source={require('../../../assets/logo.png')}
                style={styles.bannerLogo}
              />
            </View>
            <Text style={styles.bannerTexto}>Donde el café une historias</Text>
          </View>
        </View>

      </SafeAreaView>
      <View style={styles.containerCuerpo}>

        <Text style={[styles.bienvenido, modoOscuro ? styles.labelOscuro : styles.labelClaro]}>
          ¡Bienvenido!
        </Text>
        <Text style={[styles.subtitulo, modoOscuro ? styles.labelOscuro : styles.labelClaro]}>
          Inicie sesión en su cuenta para continuar
        </Text>
        <View style={{ backgroundColor: '#ccc', width: 140, marginVertical: 20, alignSelf: 'flex-start', marginLeft: 25, }} />

        <View style={styles.containerInput}>
          <InputText
            NombreLabel='Correo'
            Valor={Correo}
            onchangetext={setCorreo}
            placeholder='Ingrese el correo'
          />

          <InputText
            NombreLabel='Contraseña'
            Valor={Contraseña}
            onchangetext={setContraseña}
            placeholder='Ingrese su contraseña'
            esPassword={true}
          />

          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={styles.label}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          <View style={styles.vboton}>
            <Boton
              nombreB='Iniciar'
              onPress={() => IniciarLogin(auth, Correo, Contraseña, setUser)}
            />
          </View>

          <Boton
            nombreB='Registrarse'
            onPress={() => navigation.navigate('Registro')} />
        </View>
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType='fade'
        onRequestClose={() => setModalVisible(false)}>

        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, modoOscuro ? styles.containerOscuro : styles.containerClaro]}>
            <Text style={[styles.modalTitle, modoOscuro ? styles.labelOscuro : styles.labelClaro]}>Recuperar contraseña</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Ingresa tu correo"
              keyboardType="email-address"
              autoCapitalize="none"
              value={correoReset}
              onChangeText={setCorreoReset}
              placeholderTextColor="#666"
            />
            <Boton
              nombreB={bloquearBoton ? `Espera ${tiempoRestante}s` : 'Enviar correo'}
              onPress={() =>
                enviarRecuperacion(auth, correoReset, () => {
                  setBloquearBoton(true);
                  IniciarTemporizador(setTiempoRestante, setBloquearBoton);
                  setModalVisible(false);
                  setCorreoReset('');
                })
              }
              ancho='270'
              deshabilitado={bloquearBoton} />

            <Boton nombreB='Cancelar' onPress={() => setModalVisible(false)} backgroundColor="#ccc" ancho='270' />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  containerBanner: {
    flex: 1,
    backgroundColor: '#F1A89B',
    justifyContent: 'center',
    alignItems: 'center'
  },
  containerClaro: {
    backgroundColor: '#fff',
  },
  containerOscuro: {
    backgroundColor: '#000',
  },
  containerCuerpo: {
    flex: 2.5,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  Titulo: {
    fontSize: 30,
    fontWeight: 'bold',
    paddingTop: 10,
    paddingBottom: 40,
  },
  label: {
    color: '#ED6D4A',
    marginLeft: 180,
    paddingBottom: 20,
    paddingTop: 20
  },
  labelClaro: {
    color: '#000',
  },
  labelOscuro: {
    color: '#eee',
  },
  vboton: {
    marginBottom: 5
  },
  logo: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    width: 200,
    height: 50,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.39,
    shadowRadius: 5.30,
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%'
  },
  bannerTexto: {
    color: 'white',
    fontSize: 23,
    fontWeight: '700',
    marginLeft: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    letterSpacing: 0.5,
    marginTop: 30
  },
  logoContainer: {
    width: 200,
    height: 200,
    overflow: 'hidden',
    marginLeft: 170
  },
  logoImagen: {
    width: '60%',
    height: '60%',
    resizeMode: 'contain',
  },
  bannerLogo: {
    width: 230,
    height: 230,
  },

  bienvenido: {
    fontSize: 28,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginTop: 40,
  },
  subtitulo: {
    fontSize: 16,
    color: '#888',
    alignSelf: 'center',
    marginBottom: 10,
  },

});