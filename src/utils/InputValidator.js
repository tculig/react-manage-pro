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
  validate(fields) { // eslint-disable-line
    let passed = true;
    let message = "";
    console.log(fields);
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

    // field type check
    const fieldTypeResult = emptyCheckResult.map((el) => {
      if (el.property_value === "") return el;
      el.color = "inherit";
      let passedFields = false;
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
