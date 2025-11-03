import { useState, useRef, useEffect } from 'react';
import { Alert, Animated } from 'react-native';

import { GREETINGS, THANKS_AND_GOODBYE, FORBIDDEN_TOPICS_PATTERNS,
  ALLOWED_COFFEE_TOPICS, COFFEE_ADVISOR_URL, COFFEE_STATS_URL, SUGGESTED_TOPICS
} from './RestriccionesIA';

// Función para limpiar texto
const cleanText = (text) => {
  if (!text || typeof text !== 'string') return '';
  
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/gi, ' ')
    .replace(/\s+/g, ' ')
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

// Función para analizar contexto de la conversación
const analyzeConversationContext = (currentMessage, previousMessages = []) => {
  const cleanCurrent = cleanText(currentMessage);
  
  // 1. Buscar palabras de café en el mensaje actual
  const hasCurrentCoffee = ALLOWED_COFFEE_TOPICS.some(topic => {
    const cleanTopic = cleanText(topic);
    const regex = new RegExp(`\\b${cleanTopic}\\b`, 'i');
    return regex.test(cleanCurrent);
  });
  
  // 2. Analizar mensajes anteriores para contexto
  let hasPreviousCoffeeContext = false;
  let conversationTopics = [];
  
  // Revisar últimos 3-5 mensajes para contexto
  const recentMessages = previousMessages.slice(-5);
  recentMessages.forEach(msg => {
    const cleanMsg = cleanText(msg.text);
    ALLOWED_COFFEE_TOPICS.forEach(topic => {
      const cleanTopic = cleanText(topic);
      const regex = new RegExp(`\\b${cleanTopic}\\b`, 'i');
      if (regex.test(cleanMsg)) {
        hasPreviousCoffeeContext = true;
        if (!conversationTopics.includes(topic)) {
          conversationTopics.push(topic);
        }
      }
    });
  });
  
  // 3. Detectar preguntas implícitas sobre el tema actual
  const isFollowUpQuestion = 
    // Palabras que indican continuación
    /\b(y|además|también|otro|otra|más|sobre|respecto|acerca)\b/i.test(cleanCurrent) ||
    // Preguntas sobre "eso", "eso", "lo mismo", etc.
    /\b(eso|esto|aquello|lo mismo|el mismo|la misma)\b/i.test(cleanCurrent) ||
    // Preguntas que empiezan con "qué", "cómo", "cuándo", etc. en contexto de café
    (/^(qué|cómo|cuándo|dónde|por qué|cuál|quién)\b/i.test(cleanCurrent) && hasPreviousCoffeeContext);
  
  return {
    hasCurrentCoffee,
    hasPreviousCoffeeContext,
    conversationTopics,
    isFollowUpQuestion,
    isInCoffeeContext: hasCurrentCoffee || (hasPreviousCoffeeContext && isFollowUpQuestion)
  };
};

// FUNCIÓN Detectar temas prohibidos con contexto más amplio
export const containsForbiddenTopic = (message, previousMessages = []) => {
  const cleanMessage = cleanText(message);
  console.log('🔍 Analizando mensaje:', cleanMessage);
  
  // Analizar contexto de conversación
  const context = analyzeConversationContext(message, previousMessages);
  console.log('📊 Contexto analizado:', context);
  
  // REGLA 1: Saludos y despedidas siempre permitidos
  if (isGreeting(message) || isThanksOrGoodbye(message)) {
    console.log('✅ Saludo/Despedida - PERMITIDO');
    return false;
  }
  
  // REGLA 2: Si está en contexto de café (nicaragua o internacional), es más permisivo
  if (context.isInCoffeeContext) {
    console.log('✅ En contexto de café - VERIFICADO');
    
    // En contexto de café, solo bloquear temas MUY prohibidos
    const hasStrongForbidden = FORBIDDEN_TOPICS_PATTERNS.some(pattern => {
      // Temas sensibles que NUNCA se permiten
      const sensitiveTopics = ['sexo', 'violencia', 'drogas', 'arma', 'pistola', 'matar', 'asesinato'];
      
      if (sensitiveTopics.includes(pattern.topic)) {
        const hasSensitive = pattern.keywords?.some(keyword => {
          const cleanKeyword = cleanText(keyword);
          const regex = new RegExp(`\\b${cleanKeyword}\\b`, 'i');
          return regex.test(cleanMessage);
        });
        
        if (hasSensitive) {
          console.log(`❌ Tema sensible detectado: ${pattern.topic}`);
          return true;
        }
      }
      return false;
    });
    
    if (hasStrongForbidden) {
      console.log('❌ Tema sensible en contexto de café - RECHAZADO');
      return true;
    }
    
    console.log('✅ Mensaje en contexto de café - PERMITIDO');
    return false;
  }
  
  // Fuera de contexto, verificar que tenga relación con café (nicaragua o internacional)
  const hasCoffeeRelation = ALLOWED_COFFEE_TOPICS.some(topic => {
    const cleanTopic = cleanText(topic);
    const regex = new RegExp(`\\b${cleanTopic}\\b`, 'i');
    return regex.test(cleanMessage);
  });
  
  if (!hasCoffeeRelation) {
    console.log('❌ Sin relación con café y sin contexto - RECHAZADO');
    return true;
  }
  
  // REGLA 4: Si tiene relación con café, verificar que no mezcle con temas prohibidos fuertes
  const hasForbiddenMix = FORBIDDEN_TOPICS_PATTERNS.some(pattern => {
    const { topic, keywords, phrases, exactMatches } = pattern;
    
    // Verificar coincidencias exactas (siempre prohibidas)
    if (exactMatches && exactMatches.some(exact => {
      const cleanExact = cleanText(exact);
      const regex = new RegExp(`\\b${cleanExact}\\b`, 'i');
      return regex.test(cleanMessage);
    })) {
      console.log(`❌ Coincidencia exacta prohibida: ${topic}`);
      return true;
    }
    
    // Verificar múltiples palabras clave del mismo tema prohibido
    if (keywords) {
      const foundKeywords = keywords.filter(keyword => {
        const cleanKeyword = cleanText(keyword);
        const regex = new RegExp(`\\b${cleanKeyword}\\b`, 'i');
        return regex.test(cleanMessage);
      });
      
      // Si encuentra 2+ palabras de un tema prohibido, rechazar
      if (foundKeywords.length >= 2) {
        console.log(`❌ Múltiples palabras prohibidas: ${topic} - ${foundKeywords}`);
        return true;
      }
    }
    
    return false;
  });
  
  if (hasForbiddenMix) {
    console.log('❌ Mezcla de café con tema prohibido - RECHAZADO');
    return true;
  }
  
  console.log('✅ Mensaje relacionado con café - PERMITIDO');
  return false;
};

// Hook principal con contexto
export const useCoffeeAssistantLogic = () => {
  // Estados principales
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationContext, setConversationContext] = useState({
    hasCoffeeTopic: false,
    lastTopics: [],
    isCoffeeConversation: false
  });

  // Referencias para animaciones
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  // actualizar contexto cuando cambian los mensajes
  useEffect(() => {
    if (messages.length > 0) {
      const lastUserMessages = messages
        .filter(msg => msg.sender === 'user')
        .slice(-3)
        .map(msg => msg.text);
      
      const context = analyzeConversationContext(
        lastUserMessages[lastUserMessages.length - 1] || '', 
        lastUserMessages
      );
      
      setConversationContext({
        hasCoffeeTopic: context.hasPreviousCoffeeContext,
        lastTopics: context.conversationTopics,
        isCoffeeConversation: context.hasPreviousCoffeeContext
      });
    }
  }, [messages]);

  // Animación de typing
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
      dot1.setValue(0);
      dot2.setValue(0);
      dot3.setValue(0);
    }
  }, [isTyping, dot1, dot2, dot3]);

  // respuestas automáticas con contexto
  const handleAutomaticResponse = (message) => {
    console.log('Mensaje:', message);
    console.log('Contexto actual:', conversationContext);
    
    const previousUserMessages = messages
      .filter(msg => msg.sender === 'user')
      .map(msg => msg.text);
    
    const forbidden = containsForbiddenTopic(message, previousUserMessages);
    console.log('¿Contiene tema prohibido?', forbidden);
    
    // Verificar si es un saludo
    if (isGreeting(message)) {
      const topicsText = SUGGESTED_TOPICS.map(topic => `• ${topic}`).join('\n');
      return `¡Hola! 👋 Soy CentralCoffeeIA, tu asistente especializado en el café nicaragüense. 

Puedo ayudarte con temas como:

${topicsText}

¿En qué aspecto del café te gustaría que te ayude hoy? ☕`;
    }

    // Verificar si es agradecimiento o despedida
    if (isThanksOrGoodbye(message)) {
      return "¡De nada! 😊 Ha sido un placer ayudarte. Si tienes más preguntas sobre café nicaragüense o internacional, aquí estaré. ¡Que tengas un excelente día! ☕";
    }

    // Verificar temas prohibidos CON CONTEXTO
    if (forbidden) {
      // Mensaje más contextual
      if (conversationContext.hasCoffeeTopic) {
        return "Noto que estamos hablando de café. Me centro específicamente en aspectos técnicos y comerciales del café, tanto de Nicaragua como a nivel mundial. ¿Podrías reformular tu pregunta manteniendo el enfoque en el café?";
      }
      
      const topicsText = SUGGESTED_TOPICS.slice(0, 5).map(topic => `• ${topic}`).join('\n');
      return `Lo siento, sólo puedo ofrecer información especializada sobre café`;
    }

    return null;
  };

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

  const sendMessage = async () => {
    const message = userInput.trim();
    if (!message) return;

    const userMessage = { 
      id: Date.now(), 
      text: message, 
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsTyping(true);

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

  const clearChat = () => {
    Alert.alert(
      'Limpiar chat',
      '¿Estás seguro de que quieres borrar toda la conversación?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Limpiar', 
          onPress: () => {
            setMessages([]);
            setConversationContext({
              hasCoffeeTopic: false,
              lastTopics: [],
              isCoffeeConversation: false
            });
          },
          style: 'destructive'
        },
      ]
    );
  };

  return {
    messages,
    userInput,
    setUserInput,
    isTyping,
    dot1,
    dot2,
    dot3,
    sendMessage,
    clearChat,
    setMessages,
    conversationContext 
  };
};

export default useCoffeeAssistantLogic;