import React, { useReducer, useContext, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import GridLayout from "react-grid-layout";
import { Menu, Item, Submenu, useContextMenu } from "react-contexify";
import PropTypes from "prop-types";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import ColorEditor from "../ColorEditor";
import FontEditor from "../FontEditor";
import ActiveFieldsEditor from "../ActiveFieldsEditor";
import { changeAttributeRedux, commitLayoutToDBRedux, selectLayoutId } from "../../redux/layoutSlice";
import { modReducer } from "../../utils";
import "react-contexify/dist/ReactContexify.css";
import { createBlockDB, connectEntityToBlockDB } from "./dbcalls";
import { MainContext } from "../../pages/Main/HomeView";

/* eslint-disable */
export default function Gridlet(props) {
  const dispatch = useDispatch();
  const mainContext = useContext(MainContext);
  const [dropGlowing, setDropGlowing] = useState(-1);
  const { layout, cols, rows, scale, width, height, name, level, customContextMenu,
    availableTemplates, showColorEditor, showFontEditor, showActiveFieldsEditor } = props;
  const rowHeight = height / rows;
  const colHeight = width / cols;
  const scaleFactor = 1;
  const layoutCurrent = layout.filter((el) => { return el.parent === name; });
  const layoutElement = layoutCurrent[0];
  const layoutElementFontConfiguration = layoutCurrent[0]?.fontConfiguration;
  const layoutElementEntityDataConfiguration = layoutCurrent[0]?.entityDataConfiguration;
  const layoutElementEntityTypeId = layoutCurrent[0]?.entityTypeId;
  const layoutElementGridletId = layoutCurrent[0]?.id;
  const layoutElementGridletColor = layoutCurrent[0]?.bgcolor;
  
  const [state] = useReducer(modReducer, {
    showColorEditorState: showColorEditor,
    showFontEditorState: showFontEditor,
    showActiveFieldsEditorState: showActiveFieldsEditor,
  });

  function updateElementColor(color) {
    dispatch(
      changeAttributeRedux({
        id: layoutElementGridletId,
        value: { bgcolor: color },
      })
    );
  }

  function updateReduxFontConfiguration(updatedAttribute) {
    if (layoutElement !== undefined) {
      const newFontConfiguration = {
        ...layoutElementFontConfiguration,
        ...updatedAttribute,
      };
      dispatch(
        changeAttributeRedux({
          id: layoutElementGridletId,
          value: { fontConfiguration: newFontConfiguration },
        })
      );
      commitLayoutToDB();
    }
  }
  function updateReduxElement(updatedAttribute) {
    if (layoutElement !== undefined) {
      dispatch(
        changeAttributeRedux({
          id: layoutElementGridletId,
          value: updatedAttribute,
        })
      );
      commitLayoutToDB();
    }
  }
  function updateLayout(newElementData) {
    dispatch(
      changeAttributeRedux({
        id: parseInt(newElementData.i),
        value: { 
          x: newElementData.x,
          y: newElementData.y,
          w: newElementData.w,
          h: newElementData.h
         },
      })
    );
    commitLayoutToDB();
  }

  function commitLayoutToDB() {
    dispatch(commitLayoutToDBRedux());
  }

  function cancelLayoutChange() {
    console.log("cancel");
  }

  async function takeDrop(blockId, e){
    e.preventDefault();
    var data = e.dataTransfer.getData("Text");
    const received = JSON.parse(data);
    await connectEntityToBlockDB(blockId, received.entityID);
    mainContext.reloadLayout();
  }

  function glowDrop(id, isActive) {
    if(isActive){
      setDropGlowing(id);
    }else{
      setDropGlowing(-1);
    }
  }

  function makeGrid(el) {
    let middle;
    let shadow = {};
    if (el.id === dropGlowing){
      shadow = {
        boxShadow: "0px 0px 20px 8px royalblue"
      }
    }
    switch(el.type) {
      case "block":
        middle = (
          <div 
           onDrop={(e) => {
             takeDrop(el.id, e);
             glowDrop(el.id, false);
           }} 
           onDragOver={
             (e)=>{
               e.preventDefault();
               e.stopPropagation();
             }
           }
           onDragEnter={() => glowDrop(el.id, true)}
           onDragLeave={() => glowDrop(el.id, false)}
           key={el.id.toString()}
           style={{
            height: "100%",
            color: layoutElementGridletColor,
            ...el.fontConfiguration,
            ...shadow
            }}
          >
            {el.entityDataConfiguration.map(el => 
              el.checked ? (
                <div 
                  key={ el.id }
                  style= {{
                    pointerEvents: "none"
                  }}
                >
                  {el.property_name}
                </div>
              ): null)}
          </div>
        );
        break;
      case "gridlet":
        middle = (
          <Gridlet
            name={el.id.toString()}
            level={level + 1}
            scale={scale / scaleFactor}
            cols={scaleFactor * el.w}
            maxRows={scaleFactor * el.h}
            width={(scaleFactor * width * el.w) / cols}
            height={(scaleFactor * height * el.h) / rows}
            layout={layout}
            parentLayoutElement={el}
          />
        );
        break;
      default: middle = (<div key={el.id.toString()}></div>);
    }
    return (
      <div
        data-grid={{
          ...el,
          i: el.id.toString(),
        }}
        key={el.id.toString()}
        style={{
          border: "2px solid black",
          borderRadius: "12px",
          backgroundColor: el.bgcolor,
        }}
      >
        {middle}
      </div>
    );
  }

  const layoutId = useSelector(selectLayoutId);
  async function addBlock(templateId, gridletName, e){
    const event = e.triggerEvent;
    let xPos = Math.round(event.offsetX/rowHeight); 
    let yPos = Math.round(event.offsetY/colHeight); 
    let layoutElement={
      id:null,
      parent:gridletName,
      x:xPos,
      y:yPos,
      static:0
    };
    console.log(layoutElement.x+" "+layoutElement.y);
    await createBlockDB(templateId, layoutId, layoutElement);
    mainContext.reloadLayout();
  } 

  const { show } = useContextMenu({
    id: "contextMenu"
  });
  
  const contextMenu = (
    <Menu id="contextMenu">
      <Submenu label="Insert template">
        {availableTemplates.map(el => 
          {
            return <Item key={el.name} onClick={ (e) => addBlock(el.id, name, e) }>{el.name}</Item>
          })}
      </Submenu>
    </Menu>
  );

  const {
    showColorEditorState,
    showFontEditorState,
    showActiveFieldsEditorState,
  } = state;

  return (
    <div style={{ position: "relative" }}>
      {showColorEditorState && (
        <ColorEditor
          onChange={(color) => {
            updateElementColor(color);
          }}
          onCommit={commitLayoutToDB}
          onCommitCancel={cancelLayoutChange}
          positionOffset={{ x: 6, y: 6 }}
          scale={1.2}
          color={layoutElementGridletColor || undefined}
        />
      )}
      {showFontEditorState && (
        <FontEditor
          onChange={(updatedAttribute) => {
            updateReduxFontConfiguration(updatedAttribute);
            commitLayoutToDB();
          }}
          onCommit={commitLayoutToDB}
          onCommitCancel={cancelLayoutChange}
          positionOffset={{ x: 6, y: 506 }}
          scale={0.8}
          {...layoutElementFontConfiguration}
        />
      )}
      {showActiveFieldsEditorState && (
        <ActiveFieldsEditor
          onChange={(updatedAttribute) => {
            updateReduxElement(updatedAttribute);
            commitLayoutToDB();
          }}
          onCommit={commitLayoutToDB}
          onCommitCancel={cancelLayoutChange}
          entityDataConfiguration={layoutElementEntityDataConfiguration}
          entityTypeId={layoutElementEntityTypeId}
          entityTypeName={ layoutElementEntityDataConfiguration ? layoutElementEntityDataConfiguration[0]?.name: "" }
          right={"20px"}
          top={"100px"}
        />
      )}
      <div 
      onContextMenu={customContextMenu? show: null}
      style={{border:"0px solid pink"}}>
        <GridLayout
          cols={cols}
          compactType={null}
          preventCollision
          transformScale={scale}
          width={width}
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
          rowHeight={rowHeight}
          onDragStop={(layout, oldDragItem, l, bnull, e, node) => { updateLayout(l); }}
          onResizeStop={(layout, oldResizeItem, l, placeholder, e, node) => { updateLayout(l); }}
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
      {contextMenu}
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
  showColorEditor: PropTypes.bool,
  showFontEditor: PropTypes.bool,
  showActiveFieldsEditor: PropTypes.bool,
  availableTemplates: PropTypes.arrayOf(PropTypes.object),
  customContextMenu: PropTypes.bool,
};

Gridlet.defaultProps = {
  scale: 1,
  cols: 100,
  rows: 100,
  width: 1000,
  height: 1000,
  showColorEditor: false,
  showFontEditor: false,
  showActiveFieldsEditor: false,
  availableTemplates: [],
  customContextMenu: false
};
