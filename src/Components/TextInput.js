import { StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usarTema } from '../Containers/TemaApp';

export default function InputText(props) {
  const { modoOscuro } = usarTema();

  return (
    <View style={[
      styles.container,
      modoOscuro ? styles.containerOscuro : styles.containerClaro
    ]}>
      <SafeAreaView edges={['left']}>
        {props.NombreLabel && (
          <Text style={[
            styles.label, { marginRight: props.margenRight || 0, marginLeft: props.margenLeft || 10 },
            modoOscuro ? styles.labelOscuro : styles.labelClaro
          ]}>
            {props.NombreLabel}
          </Text>
        )}
        <TextInput
          style={[
            styles.input,
            { width: props.ancho || 350, height: props.alto || 50, marginRight: props.margenRight || 0, marginLeft: props.margenLeft || 0 },
            modoOscuro ? styles.inputOscuro : styles.inputClaro
          ]}
          value={props.Valor}
          onChangeText={props.onchangetext}
          placeholder={props.placeholder || 'Texto'}
          placeholderTextColor={modoOscuro ? "#aaa" : "#666"}
          maxLength={props.maxCaracteres || 100}
          keyboardType={props.tipoDato || 'default'}
          secureTextEntry={props.esPassword || false} 
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  containerClaro: {
    backgroundColor: '#fff',
  },
  containerOscuro: {
    backgroundColor: '#000',
  },
  label: {
    marginLeft: 10,
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 6,
  },
  labelClaro: {
    color: '#000',
  },
  labelOscuro: {
    color: '#eee',
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    fontSize: 16,
  },
  inputClaro: {
    borderColor: '#999',
    backgroundColor: '#fff',
    color: '#000',
  },
  inputOscuro: {
    borderColor: '#666',
    backgroundColor: '#333',
    color: '#fff',
  },

});
