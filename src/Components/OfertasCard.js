import { View, Text, StyleSheet, StatusBar, Image } from 'react-native';
import Boton from '../Components/Boton'
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OfertasCard({ navigation, titulo, precio, oferta, ImagenOferta, modoOscuro }) {
  return (
    <View style={[styles.container, modoOscuro ? styles.containerOscuro : styles.containerClaro]}>
      <View style={[styles.containerLista, modoOscuro ? styles.containerListaOscuro : styles.containerListaClaro]}>
        <View style={styles.containerListaImagen}>
          <Image
            source={{ uri: ImagenOferta }}
            style={{ width: '100%', height: '100%', borderRadius: 10 }}
            resizeMode="cover"
          />
        </View>

        <View style={styles.tituloContainer}>
          <Text style={[styles.Titulo, modoOscuro && styles.textoOscuro]}>{titulo}</Text>
        </View>

        <View style={styles.precioContainer}>
          <Text style={[styles.precio, modoOscuro && styles.textoOscuro]}>{precio}</Text>
        </View>

        <View style={styles.containerListaB}>
          <Boton
            nombreB='Ver Info'
            ancho={80}
            alto={30}
            onPress={() => navigation.navigate('Informacion', { oferta })}
            // Opcional: puedes pasar colores para el botón según tema
          />
        </View>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  containerClaro: {
    backgroundColor: '#fff',
  },
  containerOscuro: {
    backgroundColor: '#000',
  },
  containerLista: {
    width: 370,
    height: 230,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 10,
  },
  containerListaClaro: {
    backgroundColor: '#EBEBEB',
    borderColor: '#ddd',
  },
  containerListaOscuro: {
    backgroundColor: '#222',
    borderColor: '#444',
  },
  containerListaB: {
    marginLeft: 275,
    marginTop: 180,
    position: 'absolute',
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
    bottom: 10,
  },
  Titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000', // color default claro
  },
  textoOscuro: {
    color: '#fff',
  },
  tituloContainer: {
    width: '90%',
    bottom: 5,
    right: 8,
  },
  precio: {
    fontSize: 12,
    color: '#333', // color default claro
  },
  precioContainer: {
    width: '50%',
    marginTop: 10,
    right: 80,
  },
});
