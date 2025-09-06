import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import Octicons from '@expo/vector-icons/Octicons';

export default function Boton(props) {

    const {
    iconLibrary, 
    iconName,
    iconSize,
    iconColor,
    onPress,
    deshabilitado,
    ColorBoton,
    ancho ,
    alto,
    borderColor,
    borderRadius,
    ColorTexto,
    nombreB,
    marginRight,
  } = props;


  const Icons = {
    AntDesign,
    Feather,
    Octicons
  }

   const IconComponent = iconLibrary ? Icons[iconLibrary] : null;

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['left']} style={{}}>
        <TouchableOpacity
          onPress={props.onPress}
          disabled={props.deshabilitado}
          style={[styles.boton,
          { backgroundColor: props.ColorBoton || '#ED6D4A' },
          { width: props.ancho || 350 },
          { height: props.alto || 50 },
          { borderColor: props.borderColor || '#ED6D4A' },
          { borderRadius: props.borderRadius || 5 },
          { position: props.position || 'relative'},



          ]}>
           {iconName && IconComponent && (
            <IconComponent
              name={iconName}
              size={iconSize || 24}
              color={iconColor || 'white'}
              style={{
                marginRight: marginRight ?? 0,
                position: 'absolute',
              }}
            />
          )}

          <Text style={[
            styles.nombreb,
            { color: props.ColorTexto || 'white' },
            { right: props.Textoright || 0}
          ]}>

            {props.nombreB}

          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 3

  },
  boton: {
    width: 350,
    height: 50,
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',

  },
  nombreb: {
    alignContent: 'center',
    fontWeight: 'bold'
  }
});
