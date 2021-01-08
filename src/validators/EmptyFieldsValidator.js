import Validator from "./Validator";

export default class EmptyFieldsValidator extends Validator {
  validate(fields, passed, message) {    // eslint-disable-line
    [fields, passed, message] = this.checkArguments(fields, passed, message);
    // field empty check
    const emptyCheckResult = fields.map((el) => {
      if (el.property_value === "") {
        el.placeholder = "!";
        passed = false;
      } else {
        el.placeholder = "";
      }
      return el;
    });
    if (!passed) message += "Please fill in all the fileds.\n";

    return [passed, message, emptyCheckResult];
  }
}
