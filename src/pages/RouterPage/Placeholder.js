import React from "react";
import PropTypes from "prop-types";

export default function Placeholder(props) {
  const { title } = props;
  return <h2>{title}</h2>;
}

Placeholder.propTypes = {
  title: PropTypes.node.isRequired,
};
