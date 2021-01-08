import React, { useState, useEffect, useContext, useRef } from "react";
import * as utils from "../../utils/utils";
import { Menu, Item, Separator, Submenu, MenuProvider } from "react-contexify";
import InsertEntityModal from "./InsertEntityModal";
import { templateContext } from "../templates/RootGridTemplates";
import * as dbCalls from "../../databaseCalls/dbCalls";
import ModalPortal from '../../Dialogs/ModalPortal';

export default function BlankCell(props) {
  const isMounted = useRef(false);
  let contextData = useContext(templateContext);
  const modalOpenRef = useRef();
  const multiPositionRef = useRef();
  const [cellConfigurationState, setCellConfiguration] = useState({
    hasEntity:false,
    bgcolor: props.cellData.bgcolor,
    originalBGColor: props.cellData.bgcolor,
    cellContent: props.cellData.text,
    fontConfiguration:
      props.cellData.fontConfiguration || contextData.fontConfiguration,
  });

 
  const [state, setState] = useState({
    debug: false,
    borderRadius: "12px",
    borderWidth: "2px",
    selected: false,
    selectedColor: "red",
    showEntityModal: false,
    novaPrijavaModal:false,
    showEntityTable:props.cellData.entityTable,
    showEntityID:props.cellData.entityID,

  });

  //TODO - get rid of this
  modalOpenRef.current = state.showEntityModal;

  useEffect(() => {
    if (props.cellData.i != contextData.deselectAll) {
       selectCell(false);
    }
  }, [contextData.deselectAll]);

  useEffect(() => {
    if (isMounted.current && props.editMode) { //CHECK THIS LATER TODO!!!
      commitToDB();
    }
  }, [cellConfigurationState]);

  useEffect(() => {
    isMounted.current = true;
    return function cleanup() {
      isMounted.current = false;
    };
  }, []);

  function loadEntityData(){
    fetch('http://localhost:3001/loadEntityData?entityTable='+state.showEntityTable+'&entityID='+state.showEntityID).then(response => {return response.json();})
    .then(data => {
      setCellConfiguration((oldState)=>{
        let pieces = oldState.cellContent.split("\n");
        for(let i=0;i<pieces.length;i++){
          if(pieces[i]!=""){
             pieces[i]=data[0][pieces[i].trim()];
          }
        }
         return{
        ...oldState,
        cellContent: pieces,
        hasEntity:true
      }});
    });
  }

  function commitToDB() {
    const prepped = prepForDB();
    dbCalls.updateElement(prepped, "hsvisum", "templatecells");
  }

  function prepForDB(){
    let cellForDB = {
      ...props.cellData,
      bgcolor: cellConfigurationState.bgcolor,
      text: cellConfigurationState.cellContent,
      fontConfiguration: JSON.stringify(
        cellConfigurationState.fontConfiguration
      ),
    };
    delete cellForDB.gridSize;
    return cellForDB;
  }

  useEffect(() => {
    if (
      state.selected &&
      contextData.currentColor != cellConfigurationState.bgcolor
    ) {
      setCellConfiguration({
        ...cellConfigurationState,
        bgcolor: contextData.currentColor,
      });
    }
  }, [contextData.currentColor]);

  useEffect(() => {
    if (
      state.selected &&
      contextData.fontConfiguration != cellConfigurationState.fontConfiguration
    ) {
      setCellConfiguration({
        ...cellConfigurationState,
        fontConfiguration: contextData.fontConfiguration,
      });
    }
  }, [contextData.fontConfiguration]);

  useEffect(() => {}, [contextData.commit]);

  function closeEntityModal(commit) {
    if (commit) {
      setState({
        ...state,
        showEntityModal: false,
        cachedCellContent: state.cellContent,
      });
      setCellConfiguration({
        ...cellConfigurationState,
        bgcolor: props.cellData.bgcolor,
      });
    } else {
      setState({
        ...state,
        showEntityModal: false,
        cellContent: state.cachedCellContent,
      });
      setCellConfiguration({
        ...cellConfigurationState,
        bgcolor: props.cellData.bgcolor,
      });
    }
  }
  function closePrijavaModal(commit) {
    setState({
      ...state,
      novaPrijavaModal: false
    });
  }
  //Dakle, boja se handla na tri mjesta
  //1. react-contextify drži boju za odabrani gumb
  //2. hover efekt daje boju
  //3. ako je otvoren modal onda on drži boju i blokira react-contextify

  function toggleColor(color) {
    if (!isMounted.current) return;
    if (modalOpenRef.current) return;
    setCellConfiguration({
      ...cellConfigurationState,
      bgcolor: color,
    });
  }

  function showPreview(fields) {
    let newCellContent = "";
    //let newCellContent = [];
    for (let i = 0; i < fields.length; i++) {
      if (fields[i].checked) {
        newCellContent += fields[i].fieldName + "\n";
        //newCellContent.push(<p key={i}>{fields[i].fieldName}</p>);
      }
    }
    setCellConfiguration({
      ...cellConfigurationState,
      cellContent: newCellContent,
    });
  }

  function insertEntity(entityID) {
    setState({
      ...state,
      entityID: entityID,
      showEntityModal: true,
      cachedCellContent: state.cellContent,
    });
    setCellConfiguration({
      ...cellConfigurationState,
      bgcolor: "#40E0d0",
    });
  }

  function getRBorder() {
    if (props.slotPosition == "left" || props.slotPosition == "right") {
      if (props.cellData.x == 0 && props.cellData.y == 0) {
        return "0px";
      }
    }

    return "2px";
  }

  function selectCell(isSelected) {
    if(props.editMode){
        if (state.showEntityModal) return;
        // setState((prevState)=>({selected:!prevState.selected}))
        if (isSelected != undefined) {
          if (state.selected == isSelected) return;
          state.selected = isSelected;
        } else {
          state.selected = !state.selected; //this doesn't set state because the context call will rerender
        }
        if (state.selected) {
          if( contextData.setCurrentColor){
            contextData.setCurrentColor(cellConfigurationState.bgcolor);
          }
          if(contextData.setFontConfiguration){
            contextData.setFontConfiguration(
              cellConfigurationState.fontConfiguration
            );
          }
          setState({ ...state });
    
        } else {
          setState({ ...state });
        }
    }else{
      if(isSelected!=false && cellConfigurationState.hasEntity){
        setState({
          ...state,
          novaPrijavaModal:true
        });
      }
    }
  }

  useEffect(()=>{
    if(state.showEntityID!=undefined){
      loadEntityData();
    }
  },[state.showEntityID]);

  function takeDrop(e){
    e.preventDefault();
    if(props.dragging) return;
    //if(window.GlogalMessDragToBlankIgnore) return;
    var data = e.dataTransfer.getData("Text");
    let received = JSON.parse(data);
    let cellForDB=prepForDB();
    cellForDB={
      ...cellForDB,
      bgcolor:cellConfigurationState.originalBGColor,
      ...received
    }
    setState({
      ...state,
      ...received
    });
    dbCalls.updateElement(cellForDB, "hsvisum", "layoutdata",loadEntityData);
    setCellConfiguration({
      ...cellConfigurationState,
      bgcolor:cellConfigurationState.originalBGColor
    });
  }

  function glowDrop(e,isActive){
    if(props.dragging) return;
    let newbgcolor;
    if(isActive){
      newbgcolor="#FFC1F1";
    }else{
      newbgcolor=cellConfigurationState.originalBGColor
    }
    setCellConfiguration({
      ...cellConfigurationState,
      bgcolor:newbgcolor
    });
  }

  return (
    <div
      className="tealOnHover rukica"
      onDrop={takeDrop} 
      onDragOver={(e)=>e.preventDefault()}
      onDragEnter={(e)=>glowDrop(e,true)}
      onDragLeave={(e)=>glowDrop(e,false)}
      //onClick={selectCell}
      onMouseUp={(e) => {
        if (props.multiCellData == multiPositionRef.current) {
          if (e.button == 0) {
            contextData.deselectAll = props.cellData.i;
            selectCell();
          }
        }
      }}
      onMouseDown={(e) => {
        if (state.showEntityModal) {
          e.stopPropagation();
        } else {
          multiPositionRef.current = props.multiCellData;
          // mousePositionRef.current=
        }
      }} //this because clickin anywhere on modal open was draggin the grid element around. It registered a click anywhere inside the modal+modal overlay as a click on the grid element itself
      style={{
        ...utils.getBorderRadii(props.cellData),
        backgroundColor: cellConfigurationState.bgcolor,
        borderStyle: "solid",
        borderColor: "black",
        borderWidth: "2px",
        //borderBottom:"4px solid red",
        borderBottom:
          (state.selected ? "6px" : "0px") + " solid " + state.selectedColor,
        borderRightWidth: getRBorder(),
        // outline:"20px dashed blue",
        justifyContent: "center",
        textAlign: "center",
        flexDirection: "row",
        display: "flex",
        height: "100%",
      }}
      //    onContextMenu={utils.closeAllContextifyMenus}
    >
      <MenuProvider
              id={props.isSplit ? "template_menu_with_remove_slot" : "template_menu"}
              style={{
                display: "flex",
                border: "0px solid red",
                alignItems: "center",
                width: "100%",
             //   pointerEvents:"none"//!!to prevent glowDrop from firing//prevents context menu from opening!
              }}
              data={{
                placeSlot: (slotPosition) => props.placeSlot(slotPosition),
                insertEntity: insertEntity,
                onShown: () => toggleColor("#40E0d0"),
                onHidden: () => toggleColor(cellConfigurationState.bgcolor),
              }}
            >
              <div
                style={{
                  //  display:"flex",
                  border: "0px solid blue",
                  //   height:"100%",
                  flexGrow: "1",
                  whiteSpace: "pre-wrap",
                  textAlign: "left",
                  ...cellConfigurationState.fontConfiguration,
                }}
              >
                {cellConfigurationState.cellContent}
              </div>
      </MenuProvider>
      {state.showEntityModal && (
        <InsertEntityModal
          loadID={state.entityID}
          showPreview={showPreview}
          closeModal={closeEntityModal}
        />
      )}
      {state.novaPrijavaModal&&(
        <ModalPortal
           modalType="MachineModal"
           closeModal={closePrijavaModal}
           {...props}
          />
      )}
    </div>
  );
}
