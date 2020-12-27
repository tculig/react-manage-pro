import React from "react";
import { Row } from "react-data-grid";
export default function DraggableRowRenderer({
  rowIdx,
  isRowSelected,
  className,
  ...props
}) {
  function startDrag(e, row) {
    e.dataTransfer.setData(
      "Text",
      JSON.stringify({
        entityTable: props.showingentity.label,
        entityID: row.id,
      })
    );
    e.stopPropagation();
  }

  return (
    <div
      draggable
      onDragStart={(e) => {
        startDrag(e, props.row);
      }}
    >
      <Row
        rowIdx={rowIdx}
        isRowSelected={isRowSelected}
        className={className}
        {...props}
      />
    </div>
  );
}
