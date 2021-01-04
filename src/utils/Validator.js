export default class Validator {
  constructor() {
    if (this.validate === undefined) {
      throw new TypeError("Validator must implement function 'validate'.");
    }
  }
}
