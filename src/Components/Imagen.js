import { StyleSheet, Text, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function Imagen(props) {
  return (
    <View style={[styles.container, props.style || { width: '100%', height: '100%' }]}>
        <Image
          source={{ uri: props.imagen }}
          style={[styles.imagen, props.imagenStyle || { width: '100%', height: '100%', borderRadius: 5 }]}
        />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagen: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  }
});

