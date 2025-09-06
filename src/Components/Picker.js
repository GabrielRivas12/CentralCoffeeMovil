import { StyleSheet, Text, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { usarTema } from '../Containers/TemaApp';

export default function ComboBox(props) {
  const { modoOscuro } = usarTema();

  return (
      <View style={[styles.container, modoOscuro ? styles.containerOscuro : styles.containerClaro]}>
      <Text style={[styles.label, modoOscuro ? styles.labelOscuro : styles.labelClaro]}>
        {props.NombrePicker}
      </Text>
      <View style={[
        styles.pickerContainer,
        modoOscuro ? styles.pickerContainerOscuro : styles.pickerContainerClaro
      ]}>
        <Picker
          style={[styles.picker, { color: modoOscuro ? '#fff' : '#000' }]}
          selectedValue={props.value}
          onValueChange={props.onValuechange}
        >
          {props.items.map((item, index) => (
            <Picker.Item
              key={index}
              label={item.label}
              value={item.value}
              color={modoOscuro ? '#000' : '#000'}
            />
          ))}
        </Picker>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
container: {
    paddingBottom: 5,
  },
  containerClaro: {
    backgroundColor: '#fff',
  },
  containerOscuro: {
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: '2.5%',
    marginBottom: 5,
  },
  labelClaro: {
    color: '#000',
  },
  labelOscuro: {
    color: '#fff',
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 5,
    width: 350,
    height: 52,
    overflow: 'hidden', // esto mantiene las esquinas redondeadas
  },
  pickerContainerClaro: {
    backgroundColor: '#fff',
    borderColor: '#999',
  },
  pickerContainerOscuro: {
    backgroundColor: '#fff',
    borderColor: '#999',
  },
  picker: {
    height: 52,
    width: '100%',
  },
});