import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Keyboard, InteractionManager, FlatList, KeyboardAvoidingView, Platform, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usarTema } from '../../Containers/TemaApp';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { getAuth } from 'firebase/auth';
import { Feather } from '@expo/vector-icons';

import {
    generarChatId,
    crearChatSiNoExiste,
    suscribirseAMensajes,
    enviarMensaje,
    enviarReferencia
} from '../../Containers/SalaChat';

export default function Chat({ navigation, route }) {
    const { modoOscuro } = usarTema();
    const { ofertaReferencia, otroUsuarioId } = route.params || {};

    const [referenciaPendiente, setReferenciaPendiente] = useState(ofertaReferencia || null);
    const [mensaje, setMensaje] = useState('');
    const [mensajes, setMensajes] = useState([]);
    const [chatId, setChatId] = useState(null);

    const flatListRef = useRef(null);
    const auth = getAuth();
    const userId = auth.currentUser ? auth.currentUser.uid : null;

    const formatHora = (timestamp) => {
        if (!timestamp) return '';
        const date = timestamp.toDate ? timestamp.toDate() : timestamp;
        const horas = date.getHours();
        const minutos = date.getMinutes();
        const formatoHoras = horas % 12 || 12;
        const ampm = horas >= 12 ? 'PM' : 'AM';
        const formatoMinutos = minutos < 10 ? `0${minutos}` : minutos;
        return `${formatoHoras}:${formatoMinutos} ${ampm}`;
    };

    useEffect(() => {
        if (!userId || !otroUsuarioId) return;

        const id = generarChatId(userId, otroUsuarioId);
        setChatId(id);

        crearChatSiNoExiste(id, userId, otroUsuarioId);
        const unsubscribe = suscribirseAMensajes(id, setMensajes);

        return () => unsubscribe && unsubscribe();
    }, [userId, otroUsuarioId]);

    return (
        <View style={[styles.container, { backgroundColor: modoOscuro ? '#000' : '#fff' }]}>
            <SafeAreaView edges={['bottom']} style={{ flex: 1 }}>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={95}
                >
                    <TouchableWithoutFeedback
                        onPress={() => {
                            Keyboard.dismiss();
                            if (flatListRef.current) {
                                InteractionManager.runAfterInteractions(() => {
                                    flatListRef.current.scrollToOffset({ offset: 0, animated: true });
                                });
                            }
                        }}
                        style={{ flex: 1 }}
                    >
                        <View style={{ flex: 1 }}>

                            <View style={[styles.bannerCifrado, modoOscuro && { backgroundColor: '#2a2a2a', borderColor: '#555' }]}>
                                <Feather name="lock" size={16} color={modoOscuro ? '#ccc' : '#555'} style={{ marginRight: 6 }} />
                                <Text style={[styles.bannerTexto, modoOscuro && { color: '#ccc' }]}>
                                    Mensajes cifrados de extremo a extremo
                                </Text>
                            </View>

                            <FlatList
                                data={mensajes.slice().reverse()}
                                inverted
                                renderItem={({ item }) => (
                                    <View
                                        style={[
                                            styles.mensajeContainer,
                                            item.de === userId
                                                ? styles.mensajePropio
                                                : modoOscuro
                                                    ? styles.mensajeOtroOscuro
                                                    : styles.mensajeOtroClaro
                                        ]}
                                    >
                                        <View style={{ maxWidth: '100%' }}>
                                            <Text
                                                style={[
                                                    styles.textoMensaje,
                                                    item.de === userId
                                                        ? { color: '#000' }
                                                        : modoOscuro
                                                            ? { color: '#fff' }
                                                            : { color: '#000' }
                                                ]}
                                            >
                                                {item.texto}
                                            </Text>
                                            <Text
                                                style={[
                                                    styles.horaMensaje,
                                                    item.de === userId
                                                        ? { alignSelf: 'flex-end', color: '#555' }
                                                        : { alignSelf: 'flex-start', color: modoOscuro ? '#aaa' : '#555' }
                                                ]}
                                            >
                                                {formatHora(item.timestamp)}
                                            </Text>
                                        </View>
                                    </View>
                                )}
                                keyExtractor={(item) => item.id}
                                contentContainerStyle={{ paddingVertical: 10, paddingHorizontal: 10, flexGrow: 1 }}
                                style={{ flex: 1 }}
                                ref={flatListRef}
                                keyboardShouldPersistTaps="handled"
                            />

                            {/* Referencia pendiente */}
                            {referenciaPendiente && (
                                <View style={[styles.referenciaPreview, modoOscuro && { backgroundColor: '#2a2a2a', borderLeftColor: '#ED6D4A' }]}>
                                    <Text style={[styles.referenciaTitulo, modoOscuro && { color: '#fff' }]}>{referenciaPendiente.titulo}</Text>
                                    <Text style={{ color: modoOscuro ? '#ccc' : '#000' }}>🫘 Tipo: {referenciaPendiente.tipoCafe}</Text>
                                    <Text style={{ color: modoOscuro ? '#ccc' : '#000' }}>📦 Cantidad: {referenciaPendiente.cantidadProduccion}</Text>
                                    <Text style={{ color: modoOscuro ? '#ccc' : '#000' }}>💲 Precio/libra: {referenciaPendiente.ofertaLibra}</Text>

                                    <View style={styles.botonesReferencia}>
                                        <TouchableOpacity
                                            style={[styles.botonEnviar, { backgroundColor: '#f16a34ff' }]}
                                            onPress={async () => {
                                                await enviarReferencia(chatId, userId, otroUsuarioId, referenciaPendiente);
                                                setReferenciaPendiente(null);
                                            }}
                                        >
                                            <Text style={styles.botonTexto}>Enviar</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={[styles.botonEnviar, { backgroundColor: '#545454' }]}
                                            onPress={() => setReferenciaPendiente(null)}
                                        >
                                            <Text style={styles.botonTexto}>Cancelar</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}

                            {/* Input de mensaje */}
                            <View style={[styles.inputContainer, modoOscuro && { backgroundColor: '#1a1a1a', borderTopColor: '#333', borderColor: '#333' }]}>
                                <TextInput
                                    style={[styles.input, modoOscuro && { backgroundColor: '#333', color: '#fff', borderColor: '#555' }]}
                                    value={mensaje}
                                    onChangeText={setMensaje}
                                    placeholder="Escribe un mensaje..."
                                    placeholderTextColor={modoOscuro ? '#aaa' : '#999'}
                                    multiline
                                />
                                <TouchableOpacity
                                    style={styles.botonEnviar}
                                    onPress={() => enviarMensaje(chatId, userId, otroUsuarioId, mensaje).then(() => setMensaje(''))}
                                >
                                    <FontAwesome name="send-o" size={24} color="black" />
                                </TouchableOpacity>
                            </View>

                        </View>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bannerCifrado: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#EBEBEB', 
        position: 'absolute',           
        top: 10,                       
        alignSelf: 'center',           
        zIndex: 10,                  
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 12,
        borderColor: '#ccc',
        borderWidth: 0.5,
    },
    bannerTexto: {
        fontSize: 12,
        color: '#555',
        fontWeight: '500',
    },
    mensajeContainer: {
        padding: 10,
        borderRadius: 10,
        marginVertical: 5,
        maxWidth: '80%',
    },
    mensajePropio: {
        backgroundColor: '#f8dbd7',
        alignSelf: 'flex-end',
    },
    mensajeOtroClaro: {
        backgroundColor: '#EBEBEB',
        alignSelf: 'flex-start',
        borderWidth: 0.5,
        borderColor: '#ddd',
    },
    mensajeOtroOscuro: {
        backgroundColor: '#2a2a2a',
        alignSelf: 'flex-start',
    },
    textoMensaje: {
        fontSize: 16,
        color: '#000',
    },
    horaMensaje: {
        fontSize: 11,
        marginTop: 2,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
        borderTopWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fff',
    },
    input: {
        flex: 1,
        maxHeight: 100,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 25,
        paddingHorizontal: 15,
        paddingVertical: 10,
        fontSize: 16,
        backgroundColor: '#f2f2f2',
        marginRight: 10,
        color: '#000',
    },
    botonEnviar: {
        backgroundColor: '#ED6D4A',
        borderRadius: 25,
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    botonTexto: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    referenciaPreview: {
        backgroundColor: '#f8dbd7',
        borderLeftWidth: 4,
        borderLeftColor: '#b55034',
        padding: 10,
        margin: 10,
        borderRadius: 8,
    },
    referenciaTitulo: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 5,
        color: '#000',
    },
    botonesReferencia: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10,
        gap: 10,
    },
});
