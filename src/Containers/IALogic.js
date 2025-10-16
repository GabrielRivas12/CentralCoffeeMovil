import { useState, useRef, useEffect } from 'react';
import { Alert, Animated } from 'react-native';

// Importar todas las constantes desde un solo archivo
import { 
  GREETINGS, 
  THANKS_AND_GOODBYE, 
  FORBIDDEN_TOPICS, 
  COFFEE_ADVISOR_URL, 
  COFFEE_STATS_URL 
} from './RestriccionesIA';

// Función para limpiar texto (quitar acentos y caracteres especiales)
const cleanText = (text) => {
  if (!text || typeof text !== 'string') return '';
  
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/gi, ' ')
    .trim();
};

// Función para verificar si es un saludo
export const isGreeting = (message) => {
  const cleanMessage = cleanText(message);
  const words = cleanMessage.split(/\s+/);
  
  return GREETINGS.some(greeting => {
    const cleanGreeting = cleanText(greeting);
    return words.some(word => word === cleanGreeting);
  });
};

// Función para verificar si es agradecimiento o despedida
export const isThanksOrGoodbye = (message) => {
  const cleanMessage = cleanText(message);
  const words = cleanMessage.split(/\s+/);
  
  return THANKS_AND_GOODBYE.some(phrase => {
    const cleanPhrase = cleanText(phrase);
    
    if (cleanPhrase.includes(' ')) {
      return cleanMessage.includes(cleanPhrase);
    }
    
    return words.some(word => word === cleanPhrase);
  });
};

// Función para verificar si contiene temas prohibidos
export const containsForbiddenTopic = (message) => {
  const cleanMessage = cleanText(message);
  const words = cleanMessage.split(/\s+/);
  
  return FORBIDDEN_TOPICS.some(topic => {
    const cleanTopic = cleanText(topic);
    return words.some(word => word === cleanTopic);
  });
};

// Hook principal para la lógica del asistente
export const useCoffeeAssistantLogic = () => {
  // Estados principales
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Referencias para animaciones
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  // Efecto para la animación de los dots de typing
  useEffect(() => {
    if (isTyping) {
      const animateDots = () => {
        Animated.sequence([
          Animated.parallel([
            Animated.timing(dot1, { toValue: 1, duration: 300, useNativeDriver: true }),
            Animated.timing(dot2, { toValue: 0, duration: 300, useNativeDriver: true }),
            Animated.timing(dot3, { toValue: 0, duration: 300, useNativeDriver: true }),
          ]),
          Animated.parallel([
            Animated.timing(dot1, { toValue: 0, duration: 300, useNativeDriver: true }),
            Animated.timing(dot2, { toValue: 1, duration: 300, useNativeDriver: true }),
            Animated.timing(dot3, { toValue: 0, duration: 300, useNativeDriver: true }),
          ]),
          Animated.parallel([
            Animated.timing(dot1, { toValue: 0, duration: 300, useNativeDriver: true }),
            Animated.timing(dot2, { toValue: 0, duration: 300, useNativeDriver: true }),
            Animated.timing(dot3, { toValue: 1, duration: 300, useNativeDriver: true }),
          ]),
        ]).start(() => {
          if (isTyping) {
            animateDots();
          }
        });
      };
      
      animateDots();
    } else {
      // Resetear animaciones cuando no está typing
      dot1.setValue(0);
      dot2.setValue(0);
      dot3.setValue(0);
    }
  }, [isTyping, dot1, dot2, dot3]);

  // Función para manejar respuestas automáticas (saludos, agradecimientos, temas prohibidos)
  const handleAutomaticResponse = (message) => {
    console.log('Procesando mensaje:', message);
    console.log('¿Es saludo?', isGreeting(message));
    console.log('¿Es agradecimiento?', isThanksOrGoodbye(message));
    console.log('¿Contiene tema prohibido?', containsForbiddenTopic(message));

    // Verificar temas prohibidos
    if (containsForbiddenTopic(message)) {
      console.log('Tema prohibido detectado');
      return "Lo siento, sólo puedo ofrecer información sobre café de Nicaragua, su producción, trazabilidad, tueste y comercio.";
    }

    // Verificar si es un saludo
    if (isGreeting(message)) {
      console.log('Saludo detectado');
      return "¡Hola! 👋 Soy CentralCoffeeIA, tu asistente especializado en café de Nicaragua. ¿En qué puedo ayudarte hoy? Puedo brindarte información sobre:\n\n• Producción de café\n• Trazabilidad\n• Tipos de tueste\n• Comercio y exportación\n• Estadísticas del sector\n\n¿Qué te gustaría saber?";
    }

    // Verificar si es agradecimiento o despedida
    if (isThanksOrGoodbye(message)) {
      console.log('Agradecimiento o despedida detectada');
      return "¡De nada! 😊 Ha sido un placer ayudarte. Si necesitas más información sobre el café de Nicaragua, no dudes en preguntarme. ¡Que tengas un excelente día! ☕";
    }

    return null;
  };

  // Función para enviar mensaje a la API
  const sendMessageToAPI = async (message) => {
    let url, body;
    
    if (message.startsWith('/stats')) {
      const parts = message.replace('/stats', '').trim().split(/\s+/);
      url = COFFEE_STATS_URL;
      body = { dataType: parts[0] || '', region: parts[1] || '' };
    } else {
      url = COFFEE_ADVISOR_URL;
      body = { question: message, language: 'español' };
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      return data.response || JSON.stringify(data);
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      return 'Error al obtener datos. Por favor, inténtalo de nuevo.';
    }
  };

  // Función principal para enviar mensajes
  const sendMessage = async () => {
    const message = userInput.trim();
    if (!message) return;

    // Agregar mensaje del usuario
    const userMessage = { 
      id: Date.now(), 
      text: message, 
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsTyping(true);

    // Verificar respuestas automáticas
    const automaticResponse = handleAutomaticResponse(message);
    
    if (automaticResponse) {
      setTimeout(() => {
        setIsTyping(false);
        const aiMessage = {
          id: Date.now() + 1,
          text: automaticResponse,
          sender: 'ai',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
      }, 1000);
      return;
    }

    // Si no es respuesta automática, consultar la API
    try {
      const aiResponse = await sendMessageToAPI(message);
      
      setTimeout(() => {
        setIsTyping(false);
        const aiMessage = {
          id: Date.now() + 1,
          text: aiResponse,
          sender: 'ai',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
      }, 1000);

    } catch (error) {
      console.error('Error al procesar mensaje:', error);
      setTimeout(() => {
        setIsTyping(false);
        const aiMessage = {
          id: Date.now() + 1,
          text: 'Error al procesar tu mensaje. Por favor, inténtalo de nuevo.',
          sender: 'ai',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
      }, 1000);
    }
  };

  // Limpiar chat
  const clearChat = () => {
    Alert.alert(
      'Limpiar chat',
      '¿Estás seguro de que quieres borrar toda la conversación?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Limpiar', 
          onPress: () => setMessages([]),
          style: 'destructive'
        },
      ]
    );
  };

  return {
    // Estados
    messages,
    userInput,
    setUserInput,
    isTyping,
    
    // Referencias de animación
    dot1,
    dot2,
    dot3,
    
    // Funciones
    sendMessage,
    clearChat,
    setMessages
  };
};

export default useCoffeeAssistantLogic;