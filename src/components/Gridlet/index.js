import React from "react";
import GridLayout from "react-grid-layout";
import PropTypes from "prop-types";
/* eslint-disable */
export default function Gridlet(props) {
  const { layout, cols, rows, scale, width, height, name, level } = props;
  const rowHeight = height / rows;
  const scaleFactor = 1;
  const layoutCurrent =  layout.filter((el)=>{return el.parent===name});

  function makeGrid(el) {
    return (
      <div key={el.i} style={{ border: "1px solid black" }}>
        <Gridlet
          name={el.i}
          level={level + 1}
          scale={scale / scaleFactor}
          cols={scaleFactor * el.w}
          maxRows={scaleFactor * el.h}
          width={(scaleFactor * width * el.w) / cols}
          height={(scaleFactor * height * el.h) / rows}
          layout={layout}
        />
      </div>
    );
  }

  return (
    <div style={{ position:"relative" }}>
      <GridLayout
        layout={layout}
        cols={cols}
        compactType={null}
        preventCollision
        transformScale={scale}
        width={width}
        onMouseDown={(e) => { e.stopPropagation(); }}
        rowHeight={rowHeight}
        containerPadding={[0, 0, 0, 0]}
        margin={[0, 0]}
        maxRows={rows}
        stretchContainer
        name={name}
        showPlaceholder={false}
      >
        {layoutCurrent.map((el) => { return makeGrid(el); })}
      </GridLayout>
    </div>
  );
}

Gridlet.propTypes = {
  name: PropTypes.string.isRequired,
  level: PropTypes.number.isRequired,
  layout: PropTypes.arrayOf(PropTypes.object).isRequired,
  scale: PropTypes.number,
  cols: PropTypes.number,
  rows: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
};

Gridlet.defaultProps = {
  scale: 1,
  cols: 100,
  rows: 100,
  width: 1000,
  height: 1000,
};
