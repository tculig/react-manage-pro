
import React, { useState, useEffect ,useRef} from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter ,Input,colSpan,scope,Label} from 'reactstrap';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash,faTrashAlt} from '@fortawesome/free-solid-svg-icons';
import * as dbCalls from '../../databaseCalls/dbCalls';
import Draggable from 'react-draggable';
import MyDraggableTable from '../../utils/MyDragableTable';



export default function InsertEntityModal(props){

  //values have to be actual MYSQL variable types!
    const fieldTypes = [
        { value: 'TEXT', label: 'Text'},
        { value: 'INT', label: 'Integer' },
        { value: 'DECIMAL(10,2)', label: 'Decimal' },
        { value: 'DATE', label: 'Date' },
      ]; 

  useEffect(()=>{
    if(props.loadID!=undefined){
      fetch('http://localhost:3001/getEntityInfo?entityID='+props.loadID).then(response => {return response.json();})
          .then(data => {
            let loadedFields = JSON.parse(data[0].fields);
            for(let i=0;i<loadedFields.length;i++){
              loadedFields[i].originalFieldName = loadedFields[i].fieldName;
              loadedFields[i].originalFieldType = loadedFields[i].fieldType;
              loadedFields[i].checked = true;
            }
            setState({
              ...state,
              entityName:data[0].entityName,
              oldEntityName:data[0].entityName,
              fields:loadedFields
            });
          });
    }
  },[]);

  const initRowsNum = 3;

  const [state,setState] = useState({
    entityName:"",
    fields:(()=>{
         let initValues = [];
        if(props.loadID!=undefined) return initValues;
        for(let i=0;i<initRowsNum;i++){
          initValues.push({fieldName:"",fieldType:fieldTypes[i]});
        }
        return initValues;
    })()
  })

  useEffect(()=>{
    props.showPreview(state.fields);
  },[state.fields]);

  function toggleChecked(i){
    let newFields = [...state.fields];
    newFields[i].checked =  !newFields[i].checked;
    setState({
        ...state,
        fields:newFields
      });
  }


  function generateField(stateObj,i){
    return(
      <React.Fragment>
        <div  className="myTd" style={{width: "53%"}}>
            <Input 
             value={stateObj.fieldName}
             disabled 
            />
        </div>
        <div className="myTd" style={{width: "30%"}}>
            <Input
            disabled 
            value={stateObj.fieldType.label}
 
            />
        </div>
        <div className="myTd" 
        onMouseDown={(e)=>e.stopPropagation()}
        onClick={(e)=>e.stopPropagation()}
        style={{
          width: "15%",
          cursor:"auto"
          }}>
                <div style={{
                 display:"flex",
                justifyContent:"center",
                alignItems:"center",
                marginTop:"8px"}}>
                <Input type="checkbox"
                checked={stateObj.checked}
                onChange={() => toggleChecked(i)}
                 style={{
                margin:"auto",
                flexGrow:"1",
                height:"20px",
                position:"relative"}}/> 
               </div>
          </div>
        </React.Fragment>
 
      );
  }




  function insertEntity(){
    let filledFields =  state.fields.filter(item => item.checked == true);
    toggle(true);
  }


  function generateTableRows(){
        let fieldsHTML = [];
        for(let i=0;i<state.fields.length;i++){
          fieldsHTML.push(
              generateField(state.fields[i],i)
            );
        }
        return fieldsHTML;
  }
 


const [modal, setModal] = useState(true);
const toggle = (commit) => {
  setModal(false);
  setTimeout(function(){   props.closeModal(commit);}, 300);//not the best practice. Explore later how to reset component state without this shenanigance
}
const toggleNested = (queryResponse,onlyClose) => {
  if(onlyClose) setNestedModal({
    ...nestedModal,
    showing:!nestedModal.showing
  });
  else{
    if(queryResponse.error){
      setNestedModal({
        showing:!nestedModal.showing,
        message:queryResponse.error,
        messageHeader:"Error!",
        buttonType:"danger",
        errorState:true
      });
    }else{
      setNestedModal({
        showing:!nestedModal.showing,
        message:props.loadID==undefined?"Entity was successfully created.":"Entity was successfully updated.",
        messageHeader:"Confirm",
        buttonType:"primary",
        errorState:false
      });
    }
  }
}
const [nestedModal, setNestedModal] = useState({
  showing:false,
  message:"",
  messageHeader:"",
});


function onFieldsChange(newFields){
  setState({
    ...state,
    fields:newFields
  });
  }

return(
  <Draggable handle=".modal-header" defaultPosition={{x: -360, y:100}}>
        <Modal isOpen={modal} className="modal-120w headerDragged" style={{
          marginTop:"88px",
          transition:"all 0s"//due to dragging
        }} 
        backdropTransition={{timeout:modal?0:300}} 
        modalTransition={{timeout:modal?0:300}} 
        >
        <ModalHeader >
           <div style={{display:"flex",flexDirection: "row",alignItems:"center",margin:"4px"}}>
                    <div style={{width:"30%",textAlign:"right",paddingRight:"10px"}}>
                        Entity name:
                    </div>
                    <div style={{width:"70%"}}>
                     <Input disabled 
                     value={state.entityName}
                     />
                    </div>
              </div>
            </ModalHeader>
        <ModalBody>
          <div style={{display:"flex",flexDirection: "column"}}>
              <div style={{display:"flex",flexDirection: "row",alignItems:"center",margin:"4px"}}>
            
    
              <div className="table  myTableMock" style={{position:"relative",transition:"all 0.3s"}}>
                    
                            <div 
                            className="myTr"
                            style={{
                              display:"flex",
                              fontWeight:"bold"
                          }}>
                            <div style={{width: "7%"}} className="myTh" scope="col">#</div>
                            <div style={{width: "53%"}} className="myTh" scope="col">Field name</div>
                            <div style={{width: "30%"}} className="myTh" scope="col">Field type</div>
                            <div style={{width: "15%"}} className="myTh" scope="col">Show</div>
                            </div>
                       
                             <div>
                           <MyDraggableTable
                           transitionSpeed={600}
                           fields={state.fields}
                           rowHeight={55}
                           onFieldsChange={onFieldsChange}
                           showRowCount={true}
                           tableRows={generateTableRows()}
                           />
                            </div>
                          </div>
                        
              </div>

          </div>

          <Modal isOpen={nestedModal.showing}  onClosed={nestedModal.errorState?undefined:toggle} 
          style={{marginTop:"108px",transform:"translate(10%,0px)"}}>
            <ModalHeader>{nestedModal.messageHeader}</ModalHeader>
            <ModalBody>{nestedModal.message}</ModalBody>
            <ModalFooter>
              <Button color={nestedModal.buttonType} onClick={()=>toggleNested(null,true)}>Done</Button>
            </ModalFooter>
          </Modal>
        </ModalBody>
        <ModalFooter>
                  <Button color="primary" onClick={insertEntity}>Confirm</Button>
                  <Button color="danger" onClick={()=>toggle(false)}>Cancel</Button>
        </ModalFooter>
       </Modal>
      </Draggable>
    );
}