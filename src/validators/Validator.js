export default class Validator {
  constructor() {
    if (this.validate === undefined) {
      throw new TypeError("Validator must implement function 'validate'.");
    }
  }

  checkArguments(fields, passed, message) {  // eslint-disable-line
    return [
      fields !== undefined ? fields : [],
      passed !== undefined ? passed : true,
      message !== undefined ? message : "",
    ];
  }
}
