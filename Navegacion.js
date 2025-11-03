import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { usarTema } from './src/Containers/TemaApp';

// Screens
import Ofertas from './src/Screens/Ofertas/Ofertas';
import CrearOferta from './src/Screens/Ofertas/CrearOferta';
import DetallesOferta from './src/Screens/Ofertas/DetallesOfertas';
import EditarOfertas from './src/Screens/Ofertas/EditarOfertas';
import Mapa from './src/Screens/Map/Mapa';
import CrearMarcador from './src/Screens/Map/CrearMarcador';
import DetallesMapa from './src/Screens/Map/DetallesMapa';
import QRLista from './src/Screens/QR/QRLista';
import PerfilUsuario from './src/Screens/Perfil/PerfilUsuario';
import EditarPerfil from './src/Screens/Perfil/EditarPerfil';
import Chat from './src/Screens/Chat/Chat';
import ChatEntrantes from './src/Screens/Chat/ChatEntrantes';
import Asistente from './src/Screens/IA/Asistente';
import IAScanner from './src/Screens/AnalizarCultivo/ScannearImagen';
import Login from './src/Screens/Login/InicioSesion';
import Registro from './src/Screens/Login/Registro';

import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

export default function Navegacion() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const authUser = getAuth().currentUser;
            if (!authUser) {
                setLoading(false);
                return;
            }
            const docRef = doc(getFirestore(), 'usuarios', authUser.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setUser({ uid: authUser.uid, ...docSnap.data() });
            }
            setLoading(false);
        };
        fetchUser();
    }, []);

    if (loading) return <Text></Text>;

    return (
        <NavigationContainer>
            {user ? (
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="DrawerNavigate">
                        {() => <DrawerNavigate user={user} setUser={setUser} />}
                    </Stack.Screen>
                </Stack.Navigator>
            ) : (

                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="Login">
                        {props => <Login {...props} setUser={setUser} />}
                    </Stack.Screen>
                    <Stack.Screen name="Registro">
                        {props => <Registro {...props} setUser={setUser} />}
                    </Stack.Screen>

                </Stack.Navigator>
            )}

        </NavigationContainer>
    );
}

// Definir pantallas según rol
function getDrawerScreens(rol) {
    const allScreens = [
        { name: 'Ofertas', component: StackOfertas, icon: <Feather name="tag" size={15} /> },
        { name: 'Gestionar ofertas', component: StackEditar, icon: <Feather name="edit" size={15} /> },
        { name: 'Bandeja de entrada', component: StackChat, icon: <MaterialIcons name="chat-bubble-outline" size={15} /> },
        { name: 'QR', component: StackQR, icon: <Feather name="layers" size={15} /> },
        { name: 'Mapa', component: StackMapa, icon: <Feather name="map" size={15} /> },
        { name: 'IA', component: Asistente, icon: <Feather name="cpu" size={15} /> },
        { name: 'Analizar cultivo', component: IAScanner, icon: <Feather name="image" size={15} /> },
        { name: 'Perfil', component: StackUsuario, icon: <Feather name="user" size={15} /> },
    ];

    if (rol === 'Comerciante') return allScreens;
    if (rol === 'Comprador')
        return allScreens.filter(screen =>
            ['Ofertas', 'Mapa', 'IA', 'Analizar cultivo', 'Bandeja de entrada', 'Perfil'].includes(screen.name)
        );

    // Pantalla por defecto para roles desconocidos
    return [{ name: 'Ofertas', component: StackOfertas, icon: <Feather name="tag" size={15} /> }];
}

// Drawer dinámico
function DrawerNavigate({ user, setUser }) {
    const { modoOscuro } = usarTema();
    const screens = getDrawerScreens(user.rol);
    const navigation = useNavigation();

    const handleLogout = async () => {
        try {
            await getAuth().signOut();
            setUser(null); // Esto hace que Navegacion muestre la pantalla de Login
        } catch (error) {
            console.log('Error al cerrar sesión:', error);
        }
    };

    return (
        <Drawer.Navigator
            initialRouteName={screens[0].name}
            drawerContent={props => <CustomDrawerContent {...props} handleLogout={handleLogout} />}
            screenOptions={{
                headerStyle: { backgroundColor: '#ED6D4A' },
                drawerActiveTintColor: '#666',
                drawerInactiveTintColor: '#666',
                drawerActiveBackgroundColor: '#ffdfd7ff',
                drawerLabelStyle: { fontSize: 16 },
                drawerStyle: {
                    backgroundColor: modoOscuro ? '#000' : '#fff',
                    borderTopRightRadius: 20,
                    borderBottomRightRadius: 20,
                    overflow: 'hidden',
                },
            }}
        >
            {screens.map(screen => (
                <Drawer.Screen
                    key={screen.name}
                    name={screen.name}
                    options={({ route }) => {
                        const routeName = getFocusedRouteNameFromRoute(route) ?? getInitialRouteName(screen.name);
                        return {
                            headerShown: routeName === getInitialRouteName(screen.name),
                            drawerIcon: ({ color }) => React.cloneElement(screen.icon, { color }),
                        };
                    }}
                >
                    {props => {
                        if (screen.name === "Ofertas" || screen.name === "Mapa") {
                            return <screen.component {...props} user={user} />;
                        }
                        return <screen.component {...props} />;
                    }}
                </Drawer.Screen>
            ))}
        </Drawer.Navigator>
    );
}

function getInitialRouteName(screenName) {
    return {
        'Ofertas': 'ScreenOfertas',
        'Gestionar ofertas': 'ScreenEditar',
        'Mapa': 'ScreenMapa',
        'QR': 'ScreenQR',
        'Perfil': 'ScreenUsuario',
        'Bandeja de entrada': 'ScreenChat',
    }[screenName];
}

// Drawer personalizado
function CustomDrawerContent({ handleLogout, ...props }) {
    const { modoOscuro, alternarTema } = usarTema();

    return (
        <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1, backgroundColor: modoOscuro ? '#000' : '#fff' }}>
            <View style={{ padding: 20 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: modoOscuro ? '#fff' : '#000' }}>
                    CentralCoffee
                </Text>
            </View>
            <DrawerItemList {...props} />
            <View style={{ flex: 1 }} />
            <TouchableOpacity
                onPress={alternarTema}
                style={{ flexDirection: 'row', alignItems: 'center', padding: 15, borderTopWidth: 1, borderColor: modoOscuro ? '#444' : '#ccc' }}
            >
                <Feather name={modoOscuro ? 'sun' : 'moon'} size={18} color={modoOscuro ? '#fff' : '#666'} />
                <Text style={{ marginLeft: 10, color: modoOscuro ? '#fff' : '#666', fontSize: 16 }}>
                    {modoOscuro ? 'Modo Claro' : 'Modo Oscuro'}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={handleLogout} // <-- aquí
                style={{ flexDirection: 'row', alignItems: 'center', padding: 15, borderTopWidth: 1, borderColor: modoOscuro ? '#444' : '#ccc' }}
            >
                <Feather name="log-out" size={18} color={modoOscuro ? '#fff' : '#666'} />
                <Text style={{ marginLeft: 10, color: modoOscuro ? '#fff' : '#666', fontSize: 16 }}>Cerrar sesión</Text>
            </TouchableOpacity>
        </DrawerContentScrollView>
    );
}



function StackOfertas({ user }) {
    return (
        <Stack.Navigator
            initialRouteName='ScreenOfertas'
            screenOptions={({ route }) => ({
                headerShown: route.name !== 'ScreenOfertas',
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                gestureDirection: 'horizontal',
                headerStyle: {
                    backgroundColor: '#ED6D4A',
                },
            })}
        >
            <Stack.Screen name='ScreenOfertas'>
                {props => <Ofertas {...props} user={user} />}
            </Stack.Screen>
            <Stack.Screen name='Crear' component={CrearOferta} />
            <Stack.Screen name='Informacion' component={DetallesOferta} />
            <Stack.Screen name='Perfil' component={PerfilUsuario} />
            <Stack.Screen
                name='Chat'
                component={Chat}
                options={({ route }) => ({
                    headerTitle: () => (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {route.params?.fotoPerfil ? (
                                <Image
                                    source={{ uri: route.params.fotoPerfil }}
                                    style={{
                                        width: 35,
                                        height: 35,
                                        borderRadius: 17.5,
                                        marginRight: 10,
                                    }}
                                />
                            ) : null}
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#000' }}>
                                {route.params?.nombre || 'Chat'}
                            </Text>
                        </View>
                    ),
                    headerTintColor: '#000',
                })}
            />
            <Stack.Screen name='Más Información' component={DetallesMapa} />
        </Stack.Navigator>
    )
}

function StackEditar() {
    return (
        <Stack.Navigator initialRouteName='ScreenEditar'
            screenOptions={({ route }) => ({
                headerShown: route.name !== 'ScreenEditar',
                headerStyle: {
                    backgroundColor: '#ED6D4A', // color header
                },
            })}
        >
            <Stack.Screen name='ScreenEditar' component={EditarOfertas} />
            <Stack.Screen name='Crear' component={CrearOferta} />
            <Stack.Screen name='Informacion' component={DetallesOferta} />
        </Stack.Navigator>
    )
}

function StackMapa({ user }) {
    return (
        <Stack.Navigator initialRouteName='ScreenMapa'

            screenOptions={({ route }) => ({
                headerShown: route.name !== 'ScreenMapa',
                headerStyle: {
                    backgroundColor: '#ED6D4A', // color header
                },
            })}
        >
            <Stack.Screen name='ScreenMapa'>
                {props => <Mapa {...props} user={user} />}
            </Stack.Screen>
            <Stack.Screen name='Crear Marcador' component={CrearMarcador} />
            <Stack.Screen name='Más Información' component={DetallesMapa} />


        </Stack.Navigator>
    )
}

function StackQR() {
    return (
        <Stack.Navigator initialRouteName='ScreenQR'
            screenOptions={({ route }) => ({
                headerShown: route.name !== 'ScreenQR',
                headerStyle: {
                    backgroundColor: '#ED6D4A',
                },
            })}
        >
            <Stack.Screen name='ScreenQR' component={QRLista}>
            </Stack.Screen>
            <Stack.Screen name='Informacion' component={DetallesOferta} />
        </Stack.Navigator>
    )
}

function StackUsuario() {
    return (
        <Stack.Navigator initialRouteName='ScreenUsuario'
            screenOptions={({ route }) => ({
                headerShown: route.name !== 'ScreenUsuario',
                headerStyle: {
                    backgroundColor: '#ED6D4A', // color header
                },
            })}
        >
            <Stack.Screen name='ScreenUsuario' component={PerfilUsuario} />
            <Stack.Screen
                name='Chat'
                component={Chat}
                options={({ route }) => ({
                    headerTitle: () => (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {route.params?.fotoPerfil ? (
                                <Image
                                    source={{ uri: route.params.fotoPerfil }}
                                    style={{
                                        width: 35,
                                        height: 35,
                                        borderRadius: 17.5,
                                        marginRight: 10,
                                    }}
                                />
                            ) : null}
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#000' }}>
                                {route.params?.nombre || 'Chat'}
                            </Text>
                        </View>
                    ),
                    headerTintColor: '#000', // color de los íconos en el header
                })}
            />
            <Stack.Screen name='Editar Informacion' component={EditarPerfil} />
            <Stack.Screen name='Informacion' component={DetallesOferta} />
            <Stack.Screen name='Más Información' component={DetallesMapa} />
        </Stack.Navigator>
    )
}

function StackChat() {
    return (
        <Stack.Navigator
            initialRouteName="ScreenChat"
            screenOptions={({ route }) => ({
                headerShown: route.name !== "ScreenChat",
                headerStyle: {
                    backgroundColor: "#ED6D4A",
                },
            })}
        >
            <Stack.Screen name="ScreenChat" component={ChatEntrantes} />
            <Stack.Screen
                name="Chat"
                component={Chat}
                options={({ route }) => {
                    const fotoPerfil = route.params?.fotoPerfil;
                    const nombre = route.params?.nombreOtroUsuario || "Chat";
                    const inicial = route.params?.inicial || nombre.charAt(0).toUpperCase();
                    const colorFondo = route.params?.colorFondo || "#b55034";

                    return {
                        headerTitle: () => (
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                {fotoPerfil ? (
                                    <Image
                                        source={{ uri: fotoPerfil }}
                                        style={{
                                            width: 35,
                                            height: 35,
                                            borderRadius: 17.5,
                                            marginRight: 10,
                                        }}
                                    />
                                ) : (
                                    <View
                                        style={{
                                            width: 35,
                                            height: 35,
                                            borderRadius: 17.5,
                                            marginRight: 10,
                                            backgroundColor: colorFondo,
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: "#fff",
                                                fontWeight: "bold",
                                                fontSize: 16,
                                            }}
                                        >
                                            {inicial}
                                        </Text>
                                    </View>
                                )}
                                <Text
                                    style={{
                                        fontSize: 16,
                                        fontWeight: "bold",
                                        color: "#000",
                                    }}
                                >
                                    {nombre}
                                </Text>
                            </View>
                        ),
                        headerTintColor: "#000",
                    };
                }}
            />
        </Stack.Navigator>
    );
}



