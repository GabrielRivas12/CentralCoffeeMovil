import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Feather from '@expo/vector-icons/Feather';

import OfertasCard from '../../Components/OfertasCard';
import { VerificarOferta } from '../../Containers/VerificarOferta';
import { EliminarOferta } from '../../Containers/EliminarOferta';
import { usarTema } from '../../Containers/TemaApp';

import appFirebase from '../../Services/Firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../Services/Firebase';
import {
    collection,
    getFirestore,
    query, doc,
    setDoc, getDocs, getDoc,
    deleteDoc, updateDoc, where
} from 'firebase/firestore';

const db = getFirestore(appFirebase);

export default function EditarOfertas({ navigation }) {

    const { modoOscuro } = usarTema();
    const [Ofertass, setOfertass] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (usuarioFirebase) => {
            if (usuarioFirebase) {
                setUser(usuarioFirebase);
            } else {
                setUser(null);
                setOfertass([]);
            }
        });
        return () => unsubscribe();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            if (user) {
                LeerDatos();
            } else {
                setOfertass([]);
            }
        }, [user])
    );

    const LeerDatos = async () => {
        const q = query(
            collection(db, "oferta"),
            where("userId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);
        const d = [];
        querySnapshot.forEach((doc) => {
            d.push({ id: doc.id, ...doc.data() });
        });
        setOfertass(d);
    };

    return (
        <View style={[styles.container, modoOscuro ? styles.containerOscuro : styles.containerClaro]}>
            <SafeAreaView edges={['bottom']} style={{ flex: 1, alignItems: 'center' }}>

                <Text style={[
                    styles.Titulo, modoOscuro ? styles.TituloOscuro : styles.TituloClaro
                ]}> Mis ofertas </Text>

                <ScrollView style={styles.containerCard} showsVerticalScrollIndicator={false} >
                    {Ofertass.map((item, index) => (
                        <View key={index} >
                            <OfertasCard
                                ImagenOferta={item.imagen}
                                oferta={item}
                                titulo={item.titulo}
                                precio={`Precio: C$${item.ofertaLibra} por libra`}
                                navigation={navigation}
                                modoOscuro={modoOscuro}
                            />
                            <TouchableOpacity
                                onPress={() => VerificarOferta(item, LeerDatos)}
                                style={styles.botonverificar}      >
                                {item.estado === 'Activo' ? (
                                    <Feather name="check-circle" size={24} color="green" />
                                ) : (
                                    <Feather name="x-circle" size={24} color="gray" />
                                )}
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('Crear', {
                                    oferta: {
                                        Titulo: item.titulo,
                                        Imagen: item.imagen,
                                        OfertaLibra: item.ofertaLibra,
                                        TipoCafe: item.tipoCafe,
                                        Variedad: item.variedad,
                                        EstadoGrano: item.estadoGrano,
                                        Clima: item.clima,
                                        Altura: item.altura,
                                        ProcesoCorte: item.procesoCorte,
                                        FechaCosecha: item.fechaCosecha,
                                        CantidadProduccion: item.cantidadProduccion,
                                        Estado: item.estado,
                                        id: item.id,
                                    }
                                })}
                                style={styles.botoneditar}      >
                                <Feather name="edit" size={24} color="blue" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => EliminarOferta(item.id, LeerDatos)}
                                style={styles.botonborrar}      >
                                <Feather name="trash-2" size={24} color="red" />
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    containerClaro: {
        backgroundColor: '#fff',
    },
    containerOscuro: {
        backgroundColor: '#000',
    },

    botoneditar: {
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        width: 35,
        height: 31,
        position: 'absolute',
        marginTop: 201,
        marginLeft: 203,
    },
    botonborrar: {
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        width: 35,
        height: 31,
        position: 'absolute',
        marginTop: 201,
        marginLeft: 240,
    },
    botonverificar: {
        width: 32,
        height: 31,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 201,
        left: 168,
        borderRadius: 5,
    },
    Titulo: {
        fontWeight: 'bold',
        fontSize: 18,
        right: 130,
        top: 10
    },
    TituloClaro: {
        color: '#000',
    },
    TituloOscuro: {
        color: '#eee',
    },

    containerCard: {
        top: 10,
    }
});