// RestriccionesIA.js

export const GREETINGS = [
  'hola', 'holi', 'holis', 'holaa', 'holaaa', 'hey', 'heyy', 'hello', 'hi', 
  'buenas', 'buenos días', 'buenas tardes', 'buenas noches', 'qué tal', 
  'qué onda', 'qué hay', 'saludos', 'qué más', 'cómo estás', 'como estas',
  'qué hubo', 'quihubo', 'buen día', 'buendia', 'good morning', 'good afternoon'
];

export const THANKS_AND_GOODBYE = [
  'gracias', 'muchas gracias', 'mil gracias', 'gracias por todo', 'te agradezco',
  'agradecido', 'agradecida', 'thanks', 'thank you', 'ty', 'merci', 'danke',
  'adiós', 'adios', 'chao', 'bye', 'bye bye', 'goodbye', 'hasta luego', 
  'hasta pronto', 'nos vemos', 'que tengas buen día', 'que te vaya bien',
  'cuídate', 'cuidase', 'hasta la próxima', 'fue un gusto', 'fue un placer',
  'perfecto', 'está bien', 'de acuerdo', 'ok', 'okey', 'listo', 'genial',
  'excelente', 'estupendo', 'maravilloso', 'fantástico', 'increíble'
];

export const SUGGESTED_TOPICS = [
  "☕ Tipos de café y variedades",
  "🌱 Cultivo y producción cafetalera", 
  "🔥 Procesos de tueste y molido",
  "📊 Estadísticas del mercado del café",
  "🇳🇮 Café de Nicaragua específicamente",
  "🌍 Café de otras regiones del mundo",
  "💧 Métodos de preparación y brewing",
  "📈 Comercio y exportación de café",
  "🔬 Calidad y trazabilidad del café"
];

export const TOPIC_KEYWORDS = {
  'tipos': ['variedad', 'tipo', 'arábica', 'robusta', 'caturra', 'bourbon'],
  'cultivo': ['cultivar', 'cosecha', 'siembra', 'plantación', 'finca'],
  'procesos': ['tueste', 'tostar', 'molido', 'fermentación', 'secado'],
  'estadisticas': ['estadística', 'dato', 'cifra', 'volumen', 'producción'],
  'nicaragua': ['nicaragua', 'jinotega', 'matagalpa', 'nueva segovia'],
  'internacional': ['colombia', 'brasil', 'etiopía', 'kenia', 'costa rica'],
  'preparacion': ['cafetera', 'prensa', 'chemex', 'espresso', 'filtro'],
  'catacion': ['cata', 'sabor', 'aroma', 'acidez', 'cuerpo'],
  'comercio': ['exportar', 'mercado', 'precio', 'comercio', 'venta'],
  'calidad': ['calidad', 'trazabilidad', 'certificación', 'orgánico']
};

// TEMAS ESTRICTAMENTE PERMITIDOS
export const ALLOWED_COFFEE_TOPICS = [
  // Café básico
  'café', 'cafe', 'cafetal', 'cafetalero', 'caficultor', 'caficultura', 'cafeto',
  
  // Producción y cultivo
  'producción', 'produccion', 'cultivo', 'cultivar', 'cosecha', 'recolección', 'recoleccion',
  'siembra', 'plantación', 'plantacion', 'finca', 'cafetalera',
  
  // Procesos
  'tueste', 'tostar', 'tostado', 'molido', 'moler', 'beneficio', 'secado', 'fermentación', 'fermentacion',
  'lavado', 'natural', 'proceso', 'trillado', 'clasificación', 'clasificacion',
  
  // Comercio y mercado
  'exportación', 'exportacion', 'comercio', 'mercado', 'precio', 'calidad', 'venta', 'compra',
  'exportador', 'importador', 'comercialización', 'comercializacion',
  
  // Variedades y tipos
  'arábica', 'robusta', 'variedad', 'caturra', 'catuaí', 'catuai', 'maragogipe', 'bourbon',
  'pacámara', 'pacamara', 'typica', 'java', 'geisha', 'mundo novo',
  
  // Características de calidad
  'sabor', 'aroma', 'acidez', 'cuerpo', 'dulzura', 'notas', 'catación', 'cata', 'barismo', 'barista',
  'fragancia', 'textura', 'aftertaste', 'cupping', 'puntaje', 'scaa',
  
  // Regiones de Nicaragua
  'nicaragua', 'nicaragüense', 'jinotega', 'matagalpa', 'nueva segovia', 'estelí', 'carazo',
  'madriz', 'boaco', 'río blanco', 'san fernando', 'yali', 'dipilto', 'jalapa',
  'somoto', 'ocotal', 'la dalia', 'esquipulas',
  
  // Regiones internacionales
  'colombia', 'colombiano', 'brasil', 'brasileño', 'brasileño', 'etiopía', 'etíope',
  'kenia', 'keniata', 'costa rica', 'costarricense', 'guatemala', 'guatemalteco',
  'honduras', 'hondureño', 'el salvador', 'salvadoreño', 'mexico', 'mexicano',
  'perú', 'peruano', 'venezuela', 'venezolano', 'asia', 'vietnam', 'indonesia',
  'india', 'sumatra', 'java', 'áfrica', 'centroamérica', 'suramérica',
  
  // Técnicas y procesos específicos
  'sombra', 'sol', 'altura', 'orgánico', 'organico', 'convencional', 'sostenible',
  'certificación', 'certificacion', 'fair trade', 'comercio justo', 'rainforest',
  'utz', 'orgánico', 'shade grown', 'bird friendly',
  
  // Estadísticas y datos
  'estadísticas', 'estadisticas', 'datos', 'cifras', 'volumen', 'toneladas', 'quintales',
  'hectáreas', 'hectareas', 'rendimiento', 'productividad', 'producción anual',
  'mercado mundial', 'exportaciones globales',
  
  // Equipos y herramientas (solo relacionados con café)
  'molino', 'cafetera', 'prensa francesa', 'chemex', 'v60', 'aeropress', 'moka', 'expresso', 'espresso',
  'filtro', 'tamper', 'molinillo', 'tostador', 'granja', 'beneficiador',
  
  // Términos específicos de la industria
  'trazabilidad', 'origen', 'región', 'region', 'microclima', 'altitud', 'suelo', 'clima',
  'perfil de tueste', 'punto de tueste', 'grado de tueste', 'especialidad', 'especialty',
  'terroir', 'micro-lote', 'single origin'
];

// TEMAS ESTRICTAMENTE PROHIBIDOS - TODO LO DEMÁS
export const FORBIDDEN_TOPICS_PATTERNS = [
  {
    topic: 'política y gobierno',
    keywords: [
      'fsln', 'partido', 'liberal', 'sandino', 'ortega', 'chamorro', 'bolaños', 'aleman', 
      'elección', 'elecciones', 'voto', 'votar', 'gobierno', 'presidente', 'ministro', 
      'diputado', 'congreso', 'asamblea', 'alcalde', 'municipio', 'estado', 'nación',
      'política', 'politica', 'político', 'politico', 'ideología', 'oposición',
      'revolución', 'revolucion', 'sandinista', 'liberalista', 'conservador'
    ],
    phrases: [
      'partido político',
      'sistema político',
      'gobierno de nicaragua',
      'elecciones presidenciales',
      'votar por',
      'candidato a',
      'oposición política',
      'ideología política',
      'presidente de nicaragua',
      'ministro de'
    ],
    exactMatches: []
  },
  {
    topic: 'deportes',
    keywords: [
      'fútbol', 'futbol', 'balón', 'pelota', 'gol', 'equipo', 'jugador', 'partido', 
      'liga', 'campeonato', 'deportivo', 'deporte', 'beisbol', 'béisbol', 'boxeo',
      'natación', 'natacion', 'ciclismo', 'atletismo', 'competencia', 'competir',
      'estadio', 'arbitro', 'entrenador', 'deportista', 'olímpico', 'olimpico'
    ],
    phrases: [
      'jugar al fútbol',
      'partido de fútbol',
      'equipo de deportes',
      'liga nacional',
      'campeonato mundial',
      'juego de beisbol',
      'partido de baseball'
    ],
    exactMatches: []
  },
  {
    topic: 'tecnología y programación',
    keywords: [
      'programar', 'código', 'codigo', 'javascript', 'python', 'java', 'html', 'css', 
      'react', 'node', 'aplicación', 'aplicacion', 'app', 'software', 'desarrollador',
      'computadora', 'ordenador', 'celular', 'iphone', 'android', 'windows', 'mac',
      'internet', 'web', 'página', 'pagina', 'redes sociales', 'facebook', 'instagram',
      'whatsapp', 'tiktok', 'twitter'
    ],
    phrases: [
      'programación de software',
      'desarrollo web',
      'aplicación móvil',
      'lenguaje de programación',
      'escribir código',
      'red social',
      'teléfono celular'
    ],
    exactMatches: []
  },
  {
    topic: 'videojuegos',
    keywords: [
      'videojuego', 'video juego', 'jugar', 'consola', 'playstation', 'xbox', 'nintendo', 
      'gamer', 'nivel', 'personaje', 'minecraft', 'fortnite', 'call of duty', 'fifa',
      'juego online', 'multijugador', 'streaming', 'twitch', 'youtube gaming'
    ],
    phrases: [
      'jugar videojuegos',
      'juego de consola',
      'video juego de',
      'jugar en línea',
      'transmisión en vivo'
    ],
    exactMatches: []
  },
  {
    topic: 'música y entretenimiento',
    keywords: [
      'música', 'musica', 'canción', 'cancion', 'cantar', 'artista', 'banda', 'concierto', 
      'disco', 'álbum', 'album', 'ritmo', 'melodía', 'melodia', 'radio', 'spotify',
      'película', 'pelicula', 'cine', 'actor', 'actriz', 'netflix', 'disney',
      'series', 'televisión', 'television', 'youtube', 'tiktok'
    ],
    phrases: [
      'escuchar música',
      'canción de',
      'grupo musical',
      'concierto de',
      'ver película',
      'serie de televisión'
    ],
    exactMatches: []
  },
  {
    topic: 'comida y bebidas (excepto café)',
    keywords: [
      'comida', 'alimento', 'cocina', 'receta', 'cocinar', 'restaurante', 'comer',
      'bebida', 'refresco', 'jugo', 'agua', 'cerveza', 'vino', 'licor', 'ron', 'whisky',
      'té', 'te', 'infusión', 'leche', 'azúcar', 'azucar', 'pan', 'carne', 'pollo',
      'pescado', 'vegetales', 'frutas', 'arroz', 'frijoles', 'queso'
    ],
    phrases: [
      'preparar comida',
      'receta de cocina',
      'ir a restaurante',
      'bebida alcohólica',
      'té de hierbas'
    ],
    exactMatches: []
  },
  {
    topic: 'sexo y relaciones',
    keywords: [
      'sexo', 'sexual', 'cama', 'relación', 'relacion', 'cuerpo', 'beso', 'amor', 
      'novio', 'novia', 'pareja', 'matrimonio', 'casarse', 'divorcio', 'familia',
      'hijos', 'hijas', 'embarazo', 'bebé', 'bebe'
    ],
    phrases: [
      'relación sexual',
      'relación íntima',
      'relaciones sexuales',
      'acto sexual',
      'vida sexual',
      'vida amorosa'
    ],
    exactMatches: ['sexo', 'copular', 'coito']
  },
  {
    topic: 'religión y espiritualidad',
    keywords: [
      'dios', 'iglesia', 'religión', 'religion', 'fe', 'oración', 'oracion', 'rezar', 
      'santo', 'virgen', 'biblia', 'católico', 'catolico', 'cristiano', 'evangélico',
      'protestante', 'musulmán', 'musulman', 'judío', 'judio', 'ateo', 'agnóstico'
    ],
    phrases: [
      'creer en dios',
      'ir a la iglesia',
      'fe religiosa',
      'práctica religiosa',
      'rezar el rosario'
    ],
    exactMatches: []
  },
  {
    topic: 'violencia y armas',
    keywords: [
      'violencia', 'arma', 'pistola', 'rifle', 'disparar', 'matar', 'pelea', 'golpe', 
      'sangre', 'muerto', 'muerte', 'asesinato', 'crimen', 'delito', 'policía', 'policia',
      'ejército', 'ejercito', 'soldado', 'guerra', 'conflicto', 'paz'
    ],
    phrases: [
      'arma de fuego',
      'acto violento',
      'violencia física',
      'cometer un crimen'
    ],
    exactMatches: []
  },
  {
    topic: 'salud y medicina',
    keywords: [
      'salud', 'enfermedad', 'doctor', 'médico', 'medico', 'hospital', 'clínica', 
      'medicina', 'remedio', 'pastilla', 'vitamina', 'cuerpo', 'cerebro', 'corazón',
      'cáncer', 'cancer', 'covid', 'virus', 'bacteria', 'dieta', 'ejercicio', 'gimnasio'
    ],
    phrases: [
      'ir al doctor',
      'enfermedad grave',
      'tomar medicina',
      'hacer ejercicio'
    ],
    exactMatches: []
  },
  {
    topic: 'educación y estudio',
    keywords: [
      'escuela', 'colegio', 'universidad', 'estudio', 'estudiar', 'profesor', 'maestro',
      'alumno', 'estudiante', 'clase', 'curso', 'tarea', 'examen', 'graduación',
      'carrera', 'titulo', 'diploma', 'aprender', 'enseñar'
    ],
    phrases: [
      'ir a la escuela',
      'estudiar para examen',
      'clase universitaria'
    ],
    exactMatches: []
  },
  {
    topic: 'trabajo y negocios',
    keywords: [
      'trabajo', 'empleo', 'jefe', 'compañero', 'oficina', 'negocio', 'empresa',
      'empresario', 'dinero', 'salario', 'sueldo', 'contrato', 'entrevista',
      'economía', 'economia', 'finanzas', 'banco', 'cuenta', 'tarjeta', 'crédito'
    ],
    phrases: [
      'buscar trabajo',
      'trabajo en oficina',
      'ganar dinero',
      'negocio propio'
    ],
    exactMatches: []
  },
  {
    topic: 'viajes y turismo',
    keywords: [
      'viaje', 'viajar', 'turismo', 'turista', 'vacaciones', 'hotel', 'playa',
      'montaña', 'ciudad', 'pueblo', 'avión', 'avion', 'aeropuerto', 'bus',
      'carro', 'coche', 'moto', 'bicicleta'
    ],
    phrases: [
      'viajar a',
      'ir de vacaciones',
      'reservar hotel',
      'playa bonita'
    ],
    exactMatches: []
  },
  {
    topic: 'animales y mascotas',
    keywords: [
      'perro', 'gato', 'mascota', 'animal', 'veterinario', 'pez', 'pájaro', 'pajaro',
      'caballo', 'vaca', 'cerdo', 'gallina', 'zoo', 'zoológico'
    ],
    phrases: [
      'tener mascota',
      'cuidar animales',
      'ir al veterinario'
    ],
    exactMatches: []
  }
];

export const COFFEE_ADVISOR_URL = 'https://magicloops.dev/api/loop/f55cde9f-e4e9-4718-bc35-a9b086fdd1ff/run';
export const COFFEE_STATS_URL = 'https://magicloops.dev/api/loop/e4c3cd48-b631-4127-8279-47a4f924290e/run';