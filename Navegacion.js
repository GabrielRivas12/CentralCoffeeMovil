import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';

import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';


import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import 'react-native-gesture-handler';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { usarTema } from './src/Containers/TemaApp';

import Ofertas from './src/Screens/Ofertas/Ofertas';
import Mapa from './src/Screens/Map/Mapa';
import Asistente from './src/Screens/IA/Asistente';
import QRLista from './src/Screens/QR/QRLista';
import PerfilUsuario from './src/Screens/Perfil/PerfilUsuario';
import DetallesOferta from './src/Screens/Ofertas/DetallesOfertas';
import CrearOferta from './src/Screens/Ofertas/CrearOferta';
import DetallesMapa from './src/Screens/Map/DetallesMapa';
import EditarPerfil from './src/Screens/Perfil/EditarPerfil';
import Login from './src/Screens/Login/InicioSesion';
import Registro from './src/Screens/Login/Registro';
import CrearMarcador from './src/Screens/Map/CrearMarcador';
import EditarOfertas from './src/Screens/Ofertas/EditarOfertas';
import ScannerQR from './src/Screens/QR/ScannerQR';
import Chat from './src/Screens/Chat/Chat';
import ChatEntrantes from './src/Screens/Chat/ChatEntrantes';
import Logout from './src/Containers/CerrarSesión';
import IAScanner from './src/Screens/AnalizarCultivo/ScannearImagen';

function Navegacion({ user }) {
    return (
        <NavigationContainer>
            {user ? (
                // Usuario autenticado: muestra Drawer con app
                <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="DrawerNavigate">
                    <Stack.Screen name="DrawerNavigate" component={DrawerNavigate} />
                </Stack.Navigator>
            ) : (
                // Usuario no autenticado: muestra Login y Registro
                <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
                    <Stack.Screen name="Login" component={Login} />
                    <Stack.Screen name="Registro" component={Registro} />
                </Stack.Navigator>
            )}
        </NavigationContainer>


    );
}


const Stack = createStackNavigator();





const Drawer = createDrawerNavigator();

function DrawerNavigate() {
    const { modoOscuro } = usarTema();
    return (
        <Drawer.Navigator
            initialRouteName='Ofertas'
            drawerContent={props => <CustomDrawerContent {...props} />}
            screenOptions={({ route }) => {
                const routeName = getFocusedRouteNameFromRoute(route) ?? '';

                const showHeader =
                    (route.name === 'Ofertas' && (routeName === 'ScreenOfertas' || routeName === '')) ||
                    (route.name === 'Gestionar ofertas' && (routeName === 'ScreenEditar' || routeName === '')) ||
                    (route.name === 'Bandeja de entrada' && (routeName === 'ScreenChat' || routeName === '')) ||
                    (route.name === 'IA' && (routeName === 'Asistente' || routeName === '')) ||
                    (route.name === 'Analizar cultivo' && (routeName === 'IAScanner' || routeName === '')) ||
                    (route.name === 'Mapa' && (routeName === 'ScreenMapa' || routeName === '')) ||
                    (route.name === 'Perfil' && (routeName === 'ScreenUsuario' || routeName === '')) ||
                    (route.name === 'QR' && (routeName === 'ScreenQR' || routeName === ''));

                return {
                    headerShown: showHeader,
                    headerStyle: {
                        backgroundColor: '#ED6D4A',
                    },
                    drawerActiveTintColor: '#666',
                    drawerInactiveTintColor: '#666',
                    drawerActiveBackgroundColor: '#ffdfd7ff',

                    drawerLabelStyle: {
                        fontSize: 16,
                    },
                };
            }}
        >

            <Drawer.Screen name="Ofertas" component={StackOfertas}
                options={{
                    drawerIcon: ({ color, size }) =>
                        <Feather name="tag" size={15} color={color} />,
                }}
            />
            <Drawer.Screen name="Gestionar ofertas" component={StackEditar}
                options={{
                    drawerIcon: ({ color, size }) => (
                        <Feather name="edit" size={15} color={color} />
                    )
                }} />

            <Drawer.Screen name="Bandeja de entrada" component={StackChat}
                options={{
                    drawerIcon: ({ color, size }) => (
                        <MaterialIcons name="chat-bubble-outline" size={15} color={color} />
                    )
                }} />

            <Drawer.Screen
                name="QR"
                component={StackQR}
                options={({ navigation }) => ({  // aquí recibimos navigation
                    drawerIcon: ({ color, size }) => (
                        <Feather name="layers" size={15} color={color} />
                    ),
                    headerRight: () => (
                        <TouchableOpacity
                            onPress={() => navigation.navigate('QR', { screen: 'ScannerQR' })}
                            style={{ marginRight: 15 }}
                        >
                            <MaterialCommunityIcons name="qrcode-scan" size={24} color="black" />
                        </TouchableOpacity>
                    ),
                })}
            />
            <Drawer.Screen name="Mapa" component={StackMapa}
                options={{
                    drawerIcon: ({ color, size }) => (
                        <Feather name="map" size={15} color={color} />
                    )
                }} />
            <Drawer.Screen name="IA" component={Asistente}
                options={{
                    drawerIcon: ({ color, size }) => (
                        <Feather name="cpu" size={15} color={color} />
                    )
                }} />

            <Drawer.Screen name="Analizar cultivo" component={IAScanner}
                options={{
                    drawerIcon: ({ color, size }) => (
                        <Feather name="image" size={15} color={color} />
                    )
                }} />

            <Drawer.Screen
                name="Perfil"
                component={StackUsuario}
                options={({ navigation }) => ({
                    drawerIcon: ({ color, size }) => (
                        <Feather name="user" size={15} color={color} />
                    )

                })}
            />

        </Drawer.Navigator>
    )
}


function CustomDrawerContent(props) {
    const { modoOscuro, alternarTema } = usarTema();

    return (
        <DrawerContentScrollView
            {...props}
            contentContainerStyle={{
                flex: 1,
                borderTopRightRadius: 10,
                borderBottomRightRadius: 10,
                backgroundColor: modoOscuro ? '#000' : '#fff',

            }}
        >
            <View style={{ padding: 20 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: modoOscuro ? '#fff' : '#000' }}>
                    Central Coffee
                </Text>
            </View>

            <DrawerItemList {...props} />

            <View style={{ flex: 1 }} />

            {/* Botón para alternar modo */}
            <TouchableOpacity
                onPress={alternarTema}
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 15,
                    paddingHorizontal: 20,
                    borderTopWidth: 1,
                    borderColor: modoOscuro ? '#444' : '#ccc',
                }}
            >
                <Feather name={modoOscuro ? 'sun' : 'moon'} size={18} color={modoOscuro ? '#fff' : '#666'} />
                <Text style={{ fontSize: 16, color: modoOscuro ? '#fff' : '#666', marginLeft: 10 }}>
                    {modoOscuro ? 'Modo Claro' : 'Modo Oscuro'}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => {
                    Logout();
                }}
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 15,
                    paddingHorizontal: 20,
                    borderTopWidth: 1,
                    borderColor: modoOscuro ? '#444' : '#ccc',
                }}
            >
                <Feather name="log-out" size={18} color={modoOscuro ? '#fff' : '#666'} />
                <Text style={{ fontSize: 16, color: modoOscuro ? '#fff' : '#666', marginLeft: 10 }}>
                    Cerrar sesión
                </Text>
            </TouchableOpacity>
        </DrawerContentScrollView>
    );
}



function StackOfertas() {
    return (
        <Stack.Navigator initialRouteName='ScreenOfertas'

            screenOptions={({ route }) => ({
                headerShown: route.name !== 'ScreenOfertas',
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                gestureDirection: 'horizontal',
                headerStyle: {
                    backgroundColor: '#ED6D4A', // color header
                },
            })}

        >
            <Stack.Screen name='ScreenOfertas' component={Ofertas} />
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
                    headerTintColor: '#000', // color de los íconos en el header
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

function StackMapa() {
    return (
        <Stack.Navigator initialRouteName='ScreenMapa'

            screenOptions={({ route }) => ({
                headerShown: route.name !== 'ScreenMapa',
                headerStyle: {
                    backgroundColor: '#ED6D4A', // color header
                },
            })}

        >
            <Stack.Screen name='ScreenMapa' component={Mapa} />
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
                    backgroundColor: '#ED6D4A', // color header
                },
            })}

        >
            <Stack.Screen name='ScreenQR' component={QRLista} />
            <Stack.Screen name='Informacion' component={DetallesOferta} />
            <Stack.Screen name='ScannerQR' component={ScannerQR} />

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
            initialRouteName='ScreenChat'
            screenOptions={({ route }) => ({
                headerShown: route.name !== 'ScreenChat',
                headerStyle: {
                    backgroundColor: '#ED6D4A',
                },
            })}
        >
            <Stack.Screen name='ScreenChat' component={ChatEntrantes} />
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
        </Stack.Navigator>
    );
}

export default Navegacion;
