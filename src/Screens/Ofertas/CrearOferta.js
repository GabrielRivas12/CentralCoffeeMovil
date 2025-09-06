import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Platform, StatusBar } from 'react-native';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import appFirebase from '../../Services/Firebase';
import { useRoute } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import { collection, getFirestore, query, getDocs, where } from 'firebase/firestore';

import { Guardar } from '../../Containers/GuardarOferta';
import { SubirImagenASupabase } from '../../Containers/SubirImagen';
import { SeleccionarFecha, verMode } from '../../Containers/SeleccionarFecha';
import { SeleccionarImagen } from '../../Containers/SeleccionarImagen';
import { obtenerLugares } from '../../Containers/ObtenerLugares';
import { usarTema } from '../../Containers/TemaApp';

import Boton from '../../Components/Boton';
import InputText from '../../Components/TextInput';
import ComboboxPickerDate from '../../Components/PickerDate';
import ComboBox from '../../Components/Picker';
import Imagen from '../../Components/Imagen';

const auth = getAuth(appFirebase);

export default function CrearOferta({ navigation }) {
  const route = useRoute();
  const ofertaEditar = route.params?.oferta || null;
  const db = getFirestore(appFirebase);
  const { modoOscuro } = usarTema();


  const [imagen, SetImagen] = useState('');
  const [Titulo, setTitulo] = useState('');
  const [TipoCafe, setTipoCafe] = useState('');
  const [Variedad, setVariedad] = useState('');
  const [EstadoGrano, setEstadoGrano] = useState('');
  const [Clima, setClima] = useState('');
  const [Altura, setAltura] = useState('');
  const [ProcesoCorte, setProcesoCorte] = useState('');
  const [FechaCosecha, setFechaCosecha] = useState('');
  const [CantidadProduccion, setCantidadProduccion] = useState('');
  const [OfertaLibra, setOfertaLibra] = useState('');
  const [Estado, setEstado] = useState('Activo');

  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState('date');
  const [text, setText] = useState('Ingrese la fecha');

  const [lugares, setLugares] = useState([]);
  const [lugarSeleccionado, setLugarSeleccionado] = useState();

  const GuardarOferta = () => {
    Guardar({
      Titulo, TipoCafe, Variedad, EstadoGrano, Clima, Altura,
      ProcesoCorte, FechaCosecha, CantidadProduccion, OfertaLibra,
      imagen, ofertaEditar, auth, db, navigation,
      SubirImagenASupabase, Estado, setEstado, lugarSeleccionado
    });
  };

  const PickImage = async () => {
    const uri = await SeleccionarImagen();
    if (uri) {
      SetImagen(uri);
    }
  };

  useEffect(() => {
    if (ofertaEditar) {
      setTitulo(ofertaEditar.Titulo || '');
      setTipoCafe(ofertaEditar.TipoCafe || '');
      setVariedad(ofertaEditar.Variedad || '');
      setEstadoGrano(ofertaEditar.EstadoGrano || '');
      setClima(ofertaEditar.Clima || '');
      setAltura(ofertaEditar.Altura || '');
      setProcesoCorte(ofertaEditar.ProcesoCorte || '');
      setFechaCosecha(ofertaEditar.FechaCosecha || '');
      setText(ofertaEditar.FechaCosecha || 'Ingrese la fecha');
      setCantidadProduccion(ofertaEditar.CantidadProduccion || '');
      setOfertaLibra(ofertaEditar.OfertaLibra || '');
      SetImagen(ofertaEditar.Imagen || '');
    }
  }, [ofertaEditar]);

useEffect(() => {
  obtenerLugares(auth, db, setLugares);
}, []);


  return (
    <View style={[styles.container, modoOscuro ? styles.containerOscuro : styles.containerClaro]}>

      <SafeAreaView edges={['bottom']} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.containerImagen}>
            <TouchableOpacity onPress={PickImage} style={{ width: '100%', height: '100%' }}>
              {imagen ? (
                <Imagen
                  imagen={imagen}
                  style={{ width: '100%', height: '100%' }}
                  imagenStyle={{ width: '100%', height: '100%', borderRadius: 5 }}
                />
              ) : (
                <View style={{ justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <Text style={{ color: '#fff' }}>Seleccionar imagen</Text>
                </View>
              )}

            </TouchableOpacity>
          </View>

          <View style={styles.encabezado}>
            <InputText
              NombreLabel='Titulo'
              Valor={Titulo}
              onchangetext={setTitulo}
              placeholder='Ingrese el título de la oferta'
              maxCaracteres={50}
            />

            <Text style={[
              styles.label, modoOscuro ? styles.labelOscuro : styles.labelClaro]}>Características
            </Text>

          </View>

          <View style={styles.formContainer}>
            <View style={styles.formContainerInputTipo}>
              <InputText
                ancho='165'

                NombreLabel='Tipo de café'
                Valor={TipoCafe}
                onchangetext={setTipoCafe}
                placeholder='ej: Arábica'
              />
              <InputText
                ancho='160'
                marginRight='20'
                NombreLabel='Variedad'
                Valor={Variedad}
                onchangetext={setVariedad}
                placeholder='ej: Bourbon'
              />
            </View>

            <View style={styles.formContainerInputTipo}>
              <InputText
                ancho='165'
                NombreLabel='Estado del grano'
                Valor={EstadoGrano}
                onchangetext={setEstadoGrano}
                placeholder='ej: Café oro'
              />
              <InputText
                ancho='160'
                NombreLabel='Clima'
                Valor={Clima}
                onchangetext={setClima}
                placeholder='ej: 15°C - 20°C'
                tipoDato="numeric"
              />
            </View>

            <View style={styles.formContainerInputTipo}>
              <InputText
                ancho='165'
                NombreLabel='Altura'
                Valor={Altura}
                onchangetext={setAltura}
                placeholder='ej: 1200'
              />
              <InputText
                ancho='160'
                NombreLabel='Proceso de corte'
                Valor={ProcesoCorte}
                onchangetext={setProcesoCorte}
                placeholder='ej: A mano'
              />
            </View>

            <View style={styles.Fecha}>
              <ComboboxPickerDate
                label="Fecha de la cosecha"
                date={date}
                show={show}
                mode={mode}
                text={text}
                verMode={() => verMode('date', setShow, setMode)}
                onChange={SeleccionarFecha(setShow, setDate, setText, setFechaCosecha)}
              />
            </View >

            <View style={styles.formContainerInputTipo}>
              <InputText
                ancho='166'
                NombreLabel='Oferta por libra'
                Valor={OfertaLibra}
                onchangetext={setOfertaLibra}
                placeholder='ej: 130.00'
                tipoDato="decimal-pad"
              />
              <InputText
                ancho='161'
                NombreLabel='Cantidad producida'
                Valor={CantidadProduccion}
                onchangetext={setCantidadProduccion}
                placeholder='ej: 500'
                tipoDato="numeric"
              />

            </View>

            <View style={styles.panelopciones}>
              <ComboBox
                NombrePicker="Ubicación"
                value={lugarSeleccionado}
                onValuechange={(itemValue) => setLugarSeleccionado(itemValue)}
                items={lugares}
              />
              <Text style={styles.textopequeño}> Debe registrar una ubicación propia en el mapa</Text>
              <Boton nombreB='Publicar' onPress={GuardarOferta} />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  containerClaro: {
    backgroundColor: '#fff',
  },
  containerOscuro: {
    backgroundColor: '#000',
  },
  textoClaro: {
    color: '#000',
  },
  textoOscuro: {
    color: '#fff',
  },
  panelOscuro: {
    backgroundColor: '#1E1E1E',
  },
  labelClaro: {
    color: '#000',
    left: 10,
    fontWeight: 'bold',
    fontSize: 18
  },
  labelOscuro: {
    color: '#fff',
    left: 10,
    fontWeight: 'bold',
    fontSize: 18
  },
  containerImagen: {
    width: 350,
    height: 150,
    backgroundColor: '#999',
    justifyContent: 'center',
    marginLeft: '4.5%',
    marginTop: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#999'
  },
  formContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  formContainerInputTipo: {
    flexDirection: 'row',
  },
  formOfertalibra: {
    alignSelf: 'flex-start',
    top: '1%',
    left: '2%'
  },
  encabezado: {
    top: 8,
    left: '2%',
  },
  textopequeño: {
    color: '#999',
    marginBottom: 10
  },
  panelopciones: {
    marginTop: '22%'
  },
  Fecha: {
    position: 'absolute',
    marginTop: 370,
    marginRight: 180,
  },
});
