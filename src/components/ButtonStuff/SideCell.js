import React from 'react';
import * as utils from '../utils/utils';
import * as dbAlati from '../databaseStuff/dbAlati';
import * as dbMaterijali from '../databaseStuff/dbMaterijali';
import * as dbTriggers from '../databaseStuff/dbTriggers';
import * as dbLayout from '../databaseStuff/dbLayout';
import * as utilsReact from '../utils/utilsReact';

export default class SideCell extends React.Component{
 
    state={
        color:"grey",
        triggerResults:this.props.cellData.triggerResults,
        debug:false,
        selected:false,
        borderRadius:"12px",
        borderWidth:"2px",
        clickSelected:false,
        fontSizeSliderLast:this.props.fontSizeSlider,
        fontSize:((this.props.cellData.fontSizes&&this.props.cellData.fontSizes[0])||24),//to sam malo zajebal, al je ok. zapravo ne bi trebalo bit array
        lastEditFontMode:false,
        primaDrop:false,
        text:""
    }
    //LIFECYCLE FUNCTIONS
    componentDidMount(){
      if(this.state.debug) console.log(this.props);
    }
    constructor(props){
      super(props);
      this.state.color=props.cellData.tempAllowed?"#2AC59B":(props.cellData.triggerResults&&props.cellData.triggerResults.color||"white");
     if(props.cellData.alat) this.state.text=props.cellData.alat.name;
    }
    componentDidUpdate(){
      if(this.props.confirmFonts){
        this.saveFontSize();
      }
    }

    saveFontSize=()=>{
       dbLayout.saveFontSize(this.props.tableID,this.props.id,this.state.fontSize,1);
    }

    /*
    static getDerivedStateFromProps(nextProps, prevState) {
      //calculate the correct border radii for the multi button
      let newState={
        lastColor:nextProps.cellData.color
      };
      if(prevState.lastColor && nextProps.cellData.color!=prevState.lastColor){
        newState.color=nextProps.cellData.tempAllowed?"#2AC59B":(nextProps.cellData.color||"white")
      }
       if(nextProps.cellData.type=="buttonFragment"){ 
        const borders=utils.getBorderRadii(nextProps.cellData);
          newState = {
            ...newState,
            ...borders
          }
        }
        if(nextProps.cellData.triggerResults!=prevState.triggerResults){
          newState={
            ...newState,
            triggerResults:nextProps.cellData.triggerResults,
            color:nextProps.cellData.tempAllowed?"#2AC59B":(nextProps.cellData.triggerResults&&nextProps.cellData.triggerResults.color||"white")
          }
        }
        if(nextProps.sidebarState.editFontMode!=prevState.lastEditFontMode){
          newState.selected=false;//deselect all just in case
          newState.clickSelected=false;
          newState.lastEditFontMode=nextProps.sidebarState.editFontMode;
          if(nextProps.sidebarState.editFontMode){ newState.color="white";}
          else {newState.color=nextProps.cellData.tempAllowed?"#2AC59B":(nextProps.cellData.triggerResults&&nextProps.cellData.triggerResults.color||"white");}
         }
         if(nextProps.cellData.tempAllowed!=prevState.oldTempAllowed && !prevState.clickSelected){ 
          newState.selected=nextProps.cellData.tempAllowed;
          if(nextProps.sidebarState.editFontMode) {newState.color=nextProps.cellData.tempAllowed?"#2AC59B":"white";}else{
            newState.color=nextProps.cellData.tempAllowed?"#2AC59B":(nextProps.cellData.triggerResults&&nextProps.cellData.triggerResults.color||"white");
          }
          newState.oldTempAllowed=nextProps.cellData.tempAllowed;
         }
         if(prevState.selected && nextProps.fontSizeSlider!=prevState.fontSizeSliderLast){
          newState.fontSizeSliderLast=nextProps.fontSizeSlider;
          if(nextProps.fontSizeSlider==null){
            newState.fontSize=((nextProps.cellData.fontSizes&&nextProps.cellData.fontSizes[0])||24);
          }else{
            newState.fontSize=nextProps.fontSizeSlider;
          }
         }
        return newState;
    }*/
    
    ondragover=(e)=>{
      e.preventDefault();
      if(window.GlogalMessDragToBlankIgnore) return;
      if(this.state.primaDrop==false){
          this.setState(()=>({
            primaDrop:true
            }));
      }
    }

    ondragexit=(e)=>{
      this.setState(()=>({
          primaDrop:false
        }));
    }

    takeDrop=(e)=>{
      e.preventDefault();
      //if(window.GlogalMessDragToBlankIgnore) return;
      var data = e.dataTransfer.getData("Text");
      let received = JSON.parse(data);
      console.log(received);
      switch(received.type){
        case "alat":dbAlati.assignAlat(received.value.id,this.props.tableID,this.props.layoutElementID,this.props.reloadLayout);break;
        case "materijal":dbMaterijali.assignMaterijal(received.value.id,this.props.tableID,this.props.layoutElementID,this.props.reloadLayout);break;
        case "trigger":dbTriggers.assignTrigger(received.id,this.props.tableID,this.props.layoutElementID,this.props.reloadLayout);break;
      }
      //
    /* this.setState(()=>({
        text:decoded.name
      }));*/
    }

    mouseDown=(e)=>{
      if(Window.editingLayout) return;
       e.stopPropagation();
       e.preventDefault();
       utilsReact.closeAllContextifyMenus();//since I'm preventing defaults and propagation, I have to handle certain cases manually..
   }  

    processClick=(e)=>{
      e.stopPropagation();
      e.preventDefault();
      if(Window.editingLayout) return;
      if(this.state.lastEditFontMode){
        this.setState((oldState)=>({
          color:oldState.selected?"white":"#2AC59B",
          selected:!oldState.selected,
          clickSelected:!oldState.selected
        }));
        return;
      }
   } 



    componentDidMount(){
        if(this.state.debug) console.log(this.props);
      }

    render(){
      if(this.state.triggerResults){
        return(
          <div  
                className={"rukica "}
                onDragOver={(e)=>{this.ondragover(e)}}
                onDragLeave={(e)=>{this.ondragexit(e)}}
                onDrop={(e)=>{this.takeDrop(e)}} 
                onClick={(e)=>{this.processClick(e)}}  
                onMouseDown={this.mouseDown} 
            style={{
            backgroundColor:this.state.color,
            borderWidth:this.state.borderWidth,
            borderStyle:"solid",
            borderColor:"black",
            fontSize:this.state.fontSize,
            justifyContent: "center",
            textAlign:"center",
            borderRadius: this.state.borderRadius,
            height:"100%"}}
            onContextMenu={utils.closeAllContextifyMenus}
            >
                 <div className="centerInParent">
                 {this.state.triggerResults.brojPrijava}
                 </div>
          </div>
        );
      }
      return(
          <div  
                className={"rukica "}
                onDragOver={(e)=>{this.ondragover(e)}}
                onDragLeave={(e)=>{this.ondragexit(e)}}
                onDrop={(e)=>{this.takeDrop(e)}} 
                onClick={(e)=>{this.processClick(e)}}  
                onMouseDown={this.mouseDown} 
            style={{
            backgroundColor:(this.state.primaDrop?"orange":"lemonchiffon"),
            borderWidth:this.state.borderWidth,
            borderStyle:"solid",
            borderColor:"black",
            fontSize:this.state.fontSize,
            justifyContent: "center",
            textAlign:"center",
            borderRadius: this.state.borderRadius,
            height:"100%"}}
            onContextMenu={utils.closeAllContextifyMenus}
            >
                 {this.state.text}
          </div>
      );
  }
}
