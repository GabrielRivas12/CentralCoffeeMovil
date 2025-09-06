import { Platform } from 'react-native';

export const SeleccionarFecha = (setShow, setDate, setText, setFechaCosecha) => (event, selectedDate) => {
  const currentDate = selectedDate || new Date();
  setShow(Platform.OS === 'android');
  setDate(currentDate);
  let temDate = new Date(currentDate);
  let fDate = temDate.getDate() + '/' + (temDate.getMonth() + 1) + '/' + temDate.getFullYear();
  setText(fDate);
  setFechaCosecha(fDate);
  setShow(false);
};



export const verMode = (currentMode, setShow, setMode) => {
    setShow(true);
    setMode(currentMode);
}