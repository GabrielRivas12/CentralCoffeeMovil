import React, { useState } from 'react';
import { View, StyleSheet, StatusBar, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Octicons from '@expo/vector-icons/Octicons';

import OfertasCard from '../../Components/OfertasCard';
import Boton from '../../Components/Boton'
import InputText from '../../Components/TextInput';
import { LeerDatos } from '../../Containers/ObtenerOfertas';
import { BuscarOferta } from '../../Containers/BuscadorOferta';

import { usarTema } from '../../Containers/TemaApp';

export default function Ofertas({ navigation }) {

  const [Ofertass, setOfertass] = useState([]);
  const [valorBusqueda, setValorBusqueda] = useState('');
  const { modoOscuro, alternarTema } = usarTema();

  useFocusEffect(
    React.useCallback(() => {
      const CargarOfertas = async () => {
        const datos = await LeerDatos();
        setOfertass(datos);
      };
      CargarOfertas();
    }, [])
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor='#ED6D4A' barStyle='light-content' />
      <SafeAreaView
        edges={['bottom']}
        style={[
          { flex: 1, alignItems: 'center' },
          modoOscuro ? styles.contenedorOscuro : styles.contenedorClaro
        ]}
      >

        <View style={styles.containerBusqueda}>
          <InputText
            modoOscuro={modoOscuro}
            Valor={valorBusqueda}
            onchangetext={async (texto) => {
              setValorBusqueda(texto);
              if (texto.trim() !== '') {
                const resultados = await BuscarOferta(texto);
                setOfertass(resultados);
              } else {
                const datos = await LeerDatos();
                setOfertass(datos);
              }
            }}
            placeholder='Buscar'
            ancho='370'
          />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}  >

          {Ofertass.map((item, index) => (
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
        <View style={styles.botoncrear} >
          <Boton
            onPress={() => navigation.navigate('Crear')}
            alto={60}
            ancho={60}
            borderRadius={40}
          />
          <View pointerEvents="none" style={{ position: 'absolute', top: 20, left: 20 }}>
            <Octicons name="pencil" size={24} color="white" />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contenedorClaro: {
    backgroundColor: '#fff',
  },
  contenedorOscuro: {
    backgroundColor: '#000',
  },
  botoncrear: {
    position: 'absolute',
    right: 10,
    bottom: '20'
  },
  containerBusqueda: {
    alignItems: 'center',
    top: 10,
    height: 70
  },
});