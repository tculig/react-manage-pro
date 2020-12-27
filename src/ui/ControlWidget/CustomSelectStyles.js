export const CustomSelectStyles = {
  control: (provided) => ({
    ...provided,
    minHeight: "1px",
    width: "160px",
    height: "32px",
    boxShadow: "none",
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    minHeight: "1px",
    paddingTop: "0",
    paddingBottom: "0",
    color: "#757575",
  }),
  valueContainer: (provided) => ({
    ...provided,
    minHeight: "1px",
    height: "30px",
    paddingTop: "0",
    paddingBottom: "0",
  }),
  option: (provided) => ({
    ...provided,
    padding: "4px",
    textAlign: "left",
    paddingLeft: "12px",
    paddingRight: "12px",
  }),
};
