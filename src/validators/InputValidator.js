import Validator from "./Validator";

function isNumeric(value) {
  return /^-?\d+$/.test(value);
}
function isDecimal(value) {
  return /^\d*\.?\d*$/.test(value);
}
function isDate(value) {
  return /^\d{4}-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])$/.test(value);
}

export default class InputValidator extends Validator {
  validate(fields, passed, message) { // eslint-disable-line
    [fields, passed, message] = this.checkArguments(fields, passed, message);
    // field type check
    const fieldTypeResult = fields.map((el) => {
      if (el.property_value === "") return el;
      el.color = "inherit";
      let passedFields = true;
      switch (el.property_type.value) {
        case "TEXT":
          break;
        case "INT":
          passedFields = isNumeric(el.property_value);
          if (!passedFields) message += `Field '${el.property_name}' should be of type ${el.property_type.label}.\n`;
          break;
        case "DECIMAL(10,2)":
          passedFields = isDecimal(el.property_value);
          if (!passedFields) message += `Field '${el.property_name}' should be of type ${el.property_type.label}.\n`;
          break;
        case "DATE":
          passedFields = isDate(el.property_value);
          if (!passedFields) message += `Field '${el.property_name}' should be of type ${el.property_type.label}. Date should be in format YYYY-MM-DD. \n`;
          break;
        default:
          break;
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
