import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import { usarTema } from '../../Containers/TemaApp';
import { auth } from '../../Services/Firebase';
import { fetchChats, irAlChat, formatDate } from '../../Containers/ObtenerChats';

export default function ChatEntrantes({ navigation }) {
    const { modoOscuro } = usarTema();
    const [chatsUsuario, setChatsUsuario] = useState([]);
    const userId = auth.currentUser ? auth.currentUser.uid : null;

    useFocusEffect(
        useCallback(() => {
            fetchChats(userId, setChatsUsuario);
        }, [userId])
    );

    return (
        <View style={[styles.container, modoOscuro ? styles.containerOscuro : styles.containerClaro]}>
            <SafeAreaView edges={['bottom']} style={{ flex: 1, width: '100%' }}>
                <FlatList
                    data={chatsUsuario}
                    keyExtractor={(item) => item.chatId}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.chatItem}
                            onPress={() => {
                                const inicial = item.nombreOtroUsuario?.charAt(0).toUpperCase() || '?';
                                const colorFondo = '#b55034'; // mismo color que usas en avatarPlaceholder
                                irAlChat(
                                    navigation,
                                    item.otroUsuarioId,
                                    item.nombreOtroUsuario,
                                    item.fotoPerfil,
                                    inicial,
                                    colorFondo
                                );
                            }}

                        >
                            {item.fotoPerfil ? (
                                <Image source={{ uri: item.fotoPerfil }} style={styles.avatar} />
                            ) : (
                                <View style={styles.avatarPlaceholder}>
                                    <Text style={styles.avatarLetter}>
                                        {item.nombreOtroUsuario?.charAt(0).toUpperCase() || '?'}
                                    </Text>
                                </View>
                            )}


                            <View style={styles.chatContent}>
                                <View style={styles.headerRow}>
                                    <Text style={[styles.chatTitle, modoOscuro ? styles.textoOscuro : styles.textoClaro]}>
                                        {item.nombreOtroUsuario}
                                    </Text>
                                    <Text style={[styles.chatDate, modoOscuro ? styles.textoOscuroSecundario : styles.textoClaroSecundario]}>
                                        {formatDate(item.ultimoTimestamp)}
                                    </Text>
                                </View>
                                <Text
                                    style={[styles.chatMessage, modoOscuro ? styles.textoOscuroSecundario : styles.textoClaroSecundario]}
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                >
                                    {item.ultimoMensaje || 'No hay mensajes aún'}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={
                        <Text style={[{ textAlign: 'center', marginTop: 20 }, modoOscuro ? styles.textoOscuro : styles.textoClaro]}>
                            No tienes chats activos
                        </Text>
                    }
                    contentContainerStyle={{ padding: 10 }}
                />
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    containerClaro: {
        backgroundColor: '#fff',
    },
    containerOscuro: {
        backgroundColor: '#000',
    },
    chatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12
    },
    avatarPlaceholder: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#b55034',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatarLetter: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    chatContent: {
        flex: 1,
        justifyContent: 'center'
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 2
    },
    chatTitle: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    chatDate: {
        fontSize: 12,
    },
    chatMessage: {
        fontSize: 14,
    },
    textoClaro: {
        color: '#000',
    },
    textoOscuro: {
        color: '#fff',
    },
    textoClaroSecundario: {
        color: '#666',
    },
    textoOscuroSecundario: {
        color: '#ccc',
    },
});
