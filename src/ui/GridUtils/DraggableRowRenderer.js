import React from "react";
import PropTypes from "prop-types";
import { Row } from "react-data-grid";

export default function DraggableRowRenderer(props) {
  const { row } = props;

  function startDrag(e) {
    e.dataTransfer.setData("Text", JSON.stringify({ entityID: row.id }));
    e.stopPropagation();
  }

  return (
    <div
      draggable
      onDragStart={(e) => { startDrag(e); }}
    >
      <Row
        {...props}
      />
    </div>
  );
}

DraggableRowRenderer.propTypes = {
  row: PropTypes.shape({
    id: PropTypes.number,
  }).isRequired,
};
