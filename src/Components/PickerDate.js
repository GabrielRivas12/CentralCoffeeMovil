import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { usarTema } from '../Containers/TemaApp';

export default function ComboboxPickerDate(props) {
  const { modoOscuro } = usarTema();

  return (
    <View style={styles.container}>
      {props.label && (
        <Text style={[styles.label, modoOscuro ? styles.labelOscuro : styles.labelClaro]}>
          {props.label}
        </Text>
      )}

      <TouchableOpacity
        style={[styles.date, modoOscuro ? styles.dateOscuro : styles.dateClaro]}
        onPress={() => props.verMode('date')}
      >
        <Text
          style={[
            styles.textodate,
            {
              color: props.text === 'Ingrese la fecha'
                ? (modoOscuro ? '#aaa' : '#666')
                : (modoOscuro ? '#fff' : '#000'),
            },
          ]}
        >
          {props.text === '' ? 'Seleccione una fecha' : props.text}
        </Text>
      </TouchableOpacity>

      {props.show && (
        <DateTimePicker
          testID='dateTimePicker'
          value={props.date}
          mode={props.mode}
          is24Hour={false}
          display='default'
          onChange={props.onChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  label: {
    marginLeft: 10,
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  labelClaro: {
    color: '#000',
  },
  labelOscuro: {
    color: '#fff',
  },
  date: {
    width: 160,
    height: 50,
    borderRadius: 5,
    borderWidth: 1,
    justifyContent: 'center',
    paddingLeft: 15,
  },
  dateClaro: {
    backgroundColor: '#fff',
    borderColor: '#999',
  },
  dateOscuro: {
    backgroundColor: '#333',
    borderColor: '#666',
  },
  textodate: {
    fontSize: 16,
  },
});
