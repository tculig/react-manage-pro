import Validator from "./Validator";

export default class InputValidator extends Validator {
  constructor(namesArray) {
    super();
    this.namesArray = namesArray;
  }

  validate(fields, passed, message) { // eslint-disable-line
    console.log(fields);
    console.log(passed);
    console.log(message);
    [fields, passed, message] = this.checkArguments(fields, passed, message);
    console.log(fields);
    console.log(passed);
    console.log(message);
    console.log(fields);
    console.log(this.namesArray);
    // field type check
    const fieldTypeResult = fields.map((el) => {
      if (el.property_value === "") return el;
      el.color = "inherit";
      let passedFields = true;
      for (let i = 0; i < this.namesArray.length; i++) {
        if (el.property_value === this.namesArray[i]) {
          passedFields = false;
          message += `Field '${el.property_name}' already exists.\n`;
        }
      }
      if (!passedFields) {
        passed = false;
        el.color = "red";
      }
      return el;
    });
    return [passed, message, fieldTypeResult];
  }
}
