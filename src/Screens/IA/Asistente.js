import React, { useRef, useEffect } from 'react';
import {View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, Animated} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useCoffeeAssistantLogic from '../../Containers/IALogic';
import { usarTema } from '../../Containers/TemaApp';

const CoffeeAssistant = () => {
  // Obtener el tema del contexto
  const { modoOscuro } = usarTema();

  // Usar la lógica del hook
  const {
    messages,
    userInput,
    setUserInput,
    isTyping,
    dot1,
    dot2,
    dot3,
    sendMessage,
    clearChat,
  } = useCoffeeAssistantLogic();

  // Referencia para el scroll
  const scrollViewRef = useRef();

  // Efecto para hacer scroll al final cuando hay nuevos mensajes o typing
  useEffect(() => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, isTyping]);

  // Colores basados en el tema
  const colors = {
    primary: '#ff5722',
    secondary: 'red',
    accent: '#bb897aff',
    light: '#ffffff',
    dark: '#121212',
    chatUserBg: modoOscuro ? '#f8dbd7' : '#f8dbd7',
    chatAiBg: modoOscuro ? '#2d2d2d' : '#e8e8e8',
    textDark: modoOscuro ? '#000' : '#000',
    textLight: modoOscuro ? '#fff' : '#000',
    inputBg: modoOscuro ? '#1e1e1e' : '#ffffff',
    inputBorder: modoOscuro ? '#444' : '#ccc',
    containerBg: modoOscuro ? '#121212' : '#f5f5f5',
  };

  // Renderizar mensaje
  const renderMessage = (message) => (
    <View
      key={message.id}
      style={[
        styles.message,
        message.sender === 'user' ? styles.userMessage : styles.aiMessage,
        {
          backgroundColor: message.sender === 'user' ? colors.chatUserBg : colors.chatAiBg,
        }
      ]}
    >
      <Text style={[
        message.sender === 'user' ? styles.userText : styles.aiText,
        {
          color: message.sender === 'user' ? colors.textDark : colors.textLight,
        }
      ]}>
        {message.text}
      </Text>
    </View>
  );

  // Indicador de typing
  const renderTypingIndicator = () => {
    return (
      <View style={[styles.message, styles.aiMessage, { backgroundColor: colors.chatAiBg }]}>
        <View style={styles.typingDots}>
          <Animated.View
            style={[
              styles.typingDot,
              {
                backgroundColor: colors.textLight,
                opacity: dot1
              }
            ]}
          />
          <Animated.View
            style={[
              styles.typingDot,
              {
                backgroundColor: colors.textLight,
                opacity: dot2
              }
            ]}
          />
          <Animated.View
            style={[
              styles.typingDot,
              {
                backgroundColor: colors.textLight,
                opacity: dot3
              }
            ]}
          />
        </View>
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.containerBg,
    },
    header: {
      backgroundColor: colors.primary,
      padding: 16,
      paddingTop: Platform.OS === 'ios' ? 50 : 16,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: 'white',
      textAlign: 'center',
    },
    headerSubtitle: {
      fontSize: 14,
      color: 'white',
      textAlign: 'center',
      marginTop: 4,
      opacity: 0.9,
    },
    chatContainer: {
      flex: 1,
      backgroundColor: colors.containerBg,
    },
    chatContent: {
      padding: 16,
      paddingBottom: 8,
    },
    welcomeMessage: {
      backgroundColor: modoOscuro ? 'rgba(255, 87, 34, 0.2)' : 'rgba(255, 87, 34, 0.1)',
      padding: 20,
      borderRadius: 12,
      marginBottom: 16,
      alignItems: 'center',
    },
    welcomeTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.textDark,
      marginBottom: 8,
      textAlign: 'center',
    },
    welcomeText: {
      fontSize: 14,
      color: colors.textDark,
      textAlign: 'center',
      lineHeight: 20,
    },
    message: {
      maxWidth: '80%',
      padding: 12,
      borderRadius: 16,
      marginBottom: 12,
    },
    userMessage: {
      alignSelf: 'flex-end',
      borderBottomRightRadius: 4,
    },
    aiMessage: {
      alignSelf: 'flex-start',
      borderBottomLeftRadius: 4,
    },
    userText: {
      fontSize: 14,
      lineHeight: 20,
    },
    aiText: {
      fontSize: 14,
      lineHeight: 20,
    },
    typingDots: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    typingDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginHorizontal: 2,
    },
    inputContainer: {
      flexDirection: 'row',
      padding: 12,
      backgroundColor: colors.inputBg,
      borderTopWidth: 1,
      borderTopColor: modoOscuro ? '#333' : '#e0e0e0',
      alignItems: 'flex-end',
    },
    inputField: {
      flex: 1,
      borderWidth: 1,
      borderColor: colors.inputBorder,
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 10,
      maxHeight: 100,
      fontSize: 14,
      backgroundColor: modoOscuro ? '#2d2d2d' : '#f9f9f9',
      color: colors.textDark,
    },
    clearButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 8,
      borderWidth: 1,
      borderColor: colors.secondary,
    },
    sendButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 8,
      backgroundColor: colors.primary,
    },
    sendButtonDisabled: {
      backgroundColor: modoOscuro ? '#444' : '#ccc',
    },
  });

  return (
    <View style={styles.container}>
      {/* Área de chat */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.chatContainer}
        contentContainerStyle={styles.chatContent}
      >
        {messages.length === 0 && (
          <View style={styles.welcomeMessage}>
            <Text style={styles.welcomeTitle}>¡Bienvenido a CentralCoffeeIA!</Text>
            <Text style={styles.welcomeText}>
              Soy tu asistente especializado en el café de Nicaragua.
              Puedo ayudarte con información sobre producción, trazabilidad,
              tueste y comercio del café nicaragüense.
            </Text>
          </View>
        )}

        {messages.map(renderMessage)}
        {isTyping && renderTypingIndicator()}
      </ScrollView>

      {/* Área de entrada */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <TextInput
          style={styles.inputField}
          value={userInput}
          onChangeText={setUserInput}
          placeholder="Pregúntame sobre café de Nicaragua..."
          placeholderTextColor={modoOscuro ? '#888' : '#999'}
          multiline
          maxLength={500}
          onSubmitEditing={sendMessage}
        />

        <TouchableOpacity
          style={styles.clearButton}
          onPress={clearChat}
        >
          <Ionicons
            name="trash-outline"
            size={20}
            color={colors.secondary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.sendButton,
            !userInput.trim() && styles.sendButtonDisabled
          ]}
          onPress={sendMessage}
          disabled={!userInput.trim()}
        >
          <Ionicons name="paper-plane" size={20} color="white" />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

export default CoffeeAssistant;