// utils/validation.js
class Validation {
  static isEmpty(value) {
    if (typeof value === 'string' || value instanceof String) {
      return value.trim() === '';
    }
    return true;
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

  static validatePostalCode(value) {
    if (this.isEmpty(value)) return "El codigo postal es requerido";
    if (!this.isNumber(value)) return "El codigo posta debe contener solo números";
    if (!this.isLengthInRange(value, 5, 5)) return "El codigo posta debe de tener 5 dígitos";
    return "";
  }


  static validateEmail(value) {
    if (this.isEmpty(value)) return "El correo electrónico es requerido";
    if (!this.isEmail(value)) return "El formato del correo electrónico no es válido";
    return "";
  }

  static validateString(value) {
    const pattern = /^[a-zA-ZÁÉÍÓÚáéíóúÜü\s]+$/;
    if (this.isEmpty(value)) return "El campo es requerido";
    if (!pattern.test(value)) return "El campo no puede contener números ni caracteres especiales, excepto letras con tilde y espacios";
    return "";
  }

  static validateStringSpecial(value) {
    const pattern = /^[a-zA-Z\s.,();]+$/;
    if (this.isEmpty(value)) return "El campo es requerido";
    if (!pattern.test(value)) return "El campo no puede contener números ni caracteres especiales, excepto puntos, comas y paréntesis";
    return "";
  }

  static validatePhoneNumber(value) {
    if (this.isEmpty(value)) return "El teléfono es requerido";
    if (!this.isNumber(value)) return "El teléfono debe contener solo números";
    if (!this.isLengthInRange(value, 10, 15)) return "El teléfono debe tener entre 10 y 15 dígitos";
    return "";
  }

  static validateWeb(value) {
    // La web es opcional, por lo que solo se valida si no está vacía
    return "";
  }

  // Agrega más métodos de validación según sea necesario
}

export default Validation;
