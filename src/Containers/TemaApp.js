import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ContextoTema = createContext();

export const ProveedorTema = ({ children }) => {
  const [modoOscuro, setModoOscuro] = useState(false);

  // Cargar el modo guardado cuando el componente monta
  useEffect(() => {
    const cargarModo = async () => {
      try {
        const valorGuardado = await AsyncStorage.getItem('@modoOscuro');
        if (valorGuardado !== null) {
          setModoOscuro(JSON.parse(valorGuardado));
        }
      } catch (e) {
        console.log('Error cargando modo oscuro:', e);
      }
    };
    cargarModo();
  }, []);

  // Alternar y guardar el modo oscuro
  const alternarTema = async () => {
    try {
      const nuevoModo = !modoOscuro;
      setModoOscuro(nuevoModo);
      await AsyncStorage.setItem('@modoOscuro', JSON.stringify(nuevoModo));
    } catch (e) {
      console.log('Error guardando modo oscuro:', e);
    }
  };

  return (
    <ContextoTema.Provider value={{ modoOscuro, alternarTema }}>
      {children}
    </ContextoTema.Provider>
  );
};

export const usarTema = () => useContext(ContextoTema);
