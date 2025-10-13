
class EmotionalState {
    // Propiedades privadas (encapsulación)
    #id;
    #emoji;
    #color;
  
    /**
     * Constructor de la clase EmotionalState
     * @param {string} id - Identificador único del estado emocional
     * @param {string} emoji - Emoji representativo del estado
     * @param {string} color - Color hexadecimal asociado al estado
     * @throws {Error} Si los parámetros no son válidos
     */
    constructor(id, emoji, color) {
      // Validación de parámetros
      if (!id || typeof id !== 'string') {
        throw new Error('El ID del estado emocional debe ser una cadena válida');
      }
      if (!emoji || typeof emoji !== 'string') {
        throw new Error('El emoji debe ser una cadena válida');
      }
      if (!color || typeof color !== 'string' || !color.startsWith('#')) {
        throw new Error('El color debe ser un código hexadecimal válido');
      }
  
      // Asignación de propiedades privadas
      this.#id = id;
      this.#emoji = emoji;
      this.#color = color;
    }
  
    // Getters públicos para acceder a propiedades privadas (encapsulación)
    get id() {
      return this.#id;
    }
  
    get emoji() {
      return this.#emoji;
    }
  
    get color() {
      return this.#color;
    }
  
    /**
     * Obtiene el nombre traducido del estado emocional
     * @param {Object} translations - Objeto de traducciones
     * @returns {string} Nombre traducido del estado
     */
    getName(translations) {
      return translations[this.#id] || this.#id;
    }
  
    /**
     * Obtiene el color del tema asociado al estado
     * @returns {string} Color hexadecimal
     */
    getThemeColor() {
      return this.#color;
    }
  
    /**
     * Determina el tipo de música predeterminado para este estado emocional
     * @returns {string} Tipo de música recomendado
     */
    getDefaultMusicType() {
      const musicMap = {
        focused: 'ambient',
        energetic: 'electronic',
        calm: 'nature',
        happy: 'jazz',
        creative: 'jazz',
        relaxed: 'lofi'
      };
      return musicMap[this.#id] || 'lofi';
    }
  
    /**
     * Convierte el estado emocional a un objeto plano para usar en React
     * @param {Object} translations - Objeto de traducciones
     * @returns {Object} Objeto con todas las propiedades del estado
     */
    toObject(translations) {
      return {
        id: this.#id,
        name: this.getName(translations),
        emoji: this.#emoji,
        color: this.#color
      };
    }
  
    /**
     * Verifica si este estado es igual a otro
     * @param {EmotionalState|string} other - Otro estado o ID de estado
     * @returns {boolean} True si son iguales
     */
    equals(other) {
      if (other instanceof EmotionalState) {
        return this.#id === other.#id;
      }
      return this.#id === other;
    }
  
    /**
     * Representación en string del estado emocional
     * @returns {string} Representación del estado
     */
    toString() {
      return `${this.#emoji} ${this.#id}`;
    }
  
    // ==================== MÉTODOS ESTÁTICOS ====================
  
    /**
     * Definición de todos los estados emocionales disponibles
     * @private
     */
    static #states = [
      new EmotionalState('happy', '😊', '#FFD700'),
      new EmotionalState('focused', '🎯', '#4A90E2'),
      new EmotionalState('relaxed', '😌', '#7ED321'),
      new EmotionalState('energetic', '⚡', '#FF6B35'),
      new EmotionalState('creative', '🎨', '#9013FE'),
      new EmotionalState('calm', '🧘', '#50E3C2')
    ];
  
    /**
     * Obtiene todos los estados emocionales disponibles
     * @param {Object} translations - Objeto de traducciones (opcional)
     * @returns {Array<EmotionalState>|Array<Object>} Array de estados emocionales
     */
    static getAll(translations = null) {
      if (translations) {
        // Retorna objetos planos con traducciones para compatibilidad con React
        return EmotionalState.#states.map(state => state.toObject(translations));
      }
      // Retorna las instancias de la clase
      return [...EmotionalState.#states];
    }
  
    /**
     * Busca un estado emocional por su ID
     * @param {string} id - ID del estado a buscar
     * @returns {EmotionalState|null} Estado encontrado o null
     */
    static findById(id) {
      return EmotionalState.#states.find(state => state.#id === id) || null;
    }
  
    /**
     * Busca un estado emocional por su ID y retorna un objeto plano
     * @param {string} id - ID del estado a buscar
     * @param {Object} translations - Objeto de traducciones
     * @returns {Object|null} Objeto del estado o null
     */
    static findByIdAsObject(id, translations) {
      const state = EmotionalState.findById(id);
      return state ? state.toObject(translations) : null;
    }
  
    /**
     * Obtiene todos los IDs de estados disponibles
     * @returns {Array<string>} Array de IDs
     */
    static getAllIds() {
      return EmotionalState.#states.map(state => state.#id);
    }
  
    /**
     * Verifica si un ID de estado es válido
     * @param {string} id - ID a validar
     * @returns {boolean} True si el ID es válido
     */
    static isValidId(id) {
      return EmotionalState.#states.some(state => state.#id === id);
    }
  
    /**
     * Obtiene un estado emocional aleatorio
     * @returns {EmotionalState} Estado emocional aleatorio
     */
    static getRandom() {
      const randomIndex = Math.floor(Math.random() * EmotionalState.#states.length);
      return EmotionalState.#states[randomIndex];
    }
  
    /**
     * Crea un mapa de estados emocionales indexados por ID
     * Útil para búsquedas rápidas en componentes
     * @param {Object} translations - Objeto de traducciones
     * @returns {Object} Mapa de estados {id: objeto}
     */
    static getAsMap(translations) {
      const map = {};
      EmotionalState.#states.forEach(state => {
        map[state.#id] = state.toObject(translations);
      });
      return map;
    }
  }
  
  export default EmotionalState;