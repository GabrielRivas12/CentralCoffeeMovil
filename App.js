import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import Navegacion from './Navegacion';
import { enableScreens } from 'react-native-screens';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './src/Services/Firebase';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ProveedorTema } from './src/Containers/TemaApp';

enableScreens();

export default function App() {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setCheckingAuth(false);
    });
    return unsubscribe;
  }, []);

 return (
    <ProveedorTema> 
      <SafeAreaProvider>
        {checkingAuth ? (
          <View style={styles.container}>
            <ActivityIndicator size="large" color="#ED6D4A" />
          </View>
        ) : (
          <Navegacion user={user} />
        )}
      </SafeAreaProvider>
    </ProveedorTema>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
