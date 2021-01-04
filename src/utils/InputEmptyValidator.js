import Validator from "./Validator";

export default class InputEmptyValidator extends Validator {
  validate(fields) {// eslint-disable-line
    let passed = true;
    const result = fields.map((el) => {
      if (el.property_value === "") {
        el.placeholder = "!";
        passed = false;
      } else {
        el.placeholder = "";
      }
      return el;
    });
    return [passed, result];
  }
}
