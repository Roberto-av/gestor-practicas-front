// utils/validation.js
class Validation {
    static isEmpty(value) {
      return value.trim() === "";
    }
  
    static isEmail(value) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailPattern.test(value);
    }
  
    static isNumber(value) {
      return /^\d+$/.test(value);
    }
  
    static isLengthInRange(value, min, max) {
      return value.length >= min && value.length <= max;
    }
  
    static validateControlNumber(value) {
      if (this.isEmpty(value)) return "El número de control es requerido";
      if (!this.isNumber(value)) return "El número de control debe contener solo números";
      if (!this.isLengthInRange(value, 1, 9)) return "El número de control no debe exceder los 9 dígitos";
      return "";
    }
  
    static validateEmail(value) {
      if (this.isEmpty(value)) return "El correo electrónico es requerido";
      if (!this.isEmail(value)) return "El formato del correo electrónico no es válido";
      return "";
    }
  
    // Agrega más métodos de validación según sea necesario
  }
  
  export default Validation;
  