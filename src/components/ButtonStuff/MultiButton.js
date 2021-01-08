import React, { useState, useEffect, useContext } from 'react'
import GridLayout from 'react-grid-layout'
//import * as utils from '../utils/utils';
//import IndividualMachine from '../tabs/pogoni/IndividualMachine';
import * as dbCalls from '../../databaseCalls/dbCalls'
import BlankCell from './BlankCell'
import { v4 as uuidv4 } from 'uuid'
import { dragHandler } from './buttonGridFunctions.js'

let lastUpdateSteps = 0
let clickLocation = { x: 0, y: 0 }
const defaultSlotColor = '#65D2F7'
export default function MultiButton(props) {
    const [state, setState] = useState({
        layout: props.layoutTree
            ? props.layoutTree.filter((obj) => {
                  return obj.parent == props.gridletName
              })
            : [],
        dragging: false,
    })
 
    function placeSlot(slotPosition) {
        let newLayout = []
        switch (slotPosition) {
            case 'remove':
                newLayout = [{ ...state.layout[0], x: 0, y: 0, w: 12, h: 12 }]
                break
            case 'left':
                newLayout = [
                    { ...state.layout[0], x: 6, y: 0, w: 6, h: 12 },
                    {
                        i: 'Cell' + uuidv4(),
                        fontConfiguration: '',
                        static: true,
                        bgcolor: defaultSlotColor,
                        type: 'cell',
                        parent: props.gridletName,
                        name: props.gridletName,
                        x: 0,
                        y: 0,
                        w: 6,
                        h: 12,
                    },
                ]
                break
            case 'right':
                newLayout = [
                    { ...state.layout[0], x: 0, y: 0, w: 6, h: 12 },
                    {
                        i: 'Cell' + uuidv4(),
                        fontConfiguration: '',
                        static: true,
                        bgcolor: defaultSlotColor,
                        type: 'cell',
                        parent: props.gridletName,
                        name: props.gridletName,
                        x: 6,
                        y: 0,
                        w: 6,
                        h: 12,
                    },
                ]
                break
            case 'top':
                newLayout = [
                    { ...state.layout[0], x: 0, y: 6, w: 12, h: 6 },
                    {
                        i: 'Cell' + uuidv4(),
                        fontConfiguration: '',
                        static: true,
                        bgcolor: defaultSlotColor,
                        type: 'cell',
                        parent: props.gridletName,
                        name: props.gridletName,
                        x: 0,
                        y: 0,
                        w: 12,
                        h: 6,
                    },
                ]
                break
            case 'bottom':
                newLayout = [
                    { ...state.layout[0], x: 0, y: 0, w: 12, h: 6 },
                    {
                        i: 'Cell' + uuidv4(),
                        fontConfiguration: '',
                        static: true,
                        bgcolor: defaultSlotColor,
                        type: 'cell',
                        parent: props.gridletName,
                        name: props.gridletName,
                        x: 0,
                        y: 6,
                        w: 12,
                        h: 6,
                    },
                ]
                break
        }
        setState({
            ...state,
            slotPosition: slotPosition,
            layout: newLayout,
        })
        commitToDB(newLayout)
    }

    function commitToDB(newLayout) {
        let newLayoutDB = newLayout.map((x) => {
            return {
                ...x,
                fontConfiguration: JSON.stringify(x.fontConfiguration),
            }
        })
        if (state.layout.length > newLayout.length) {
            dbCalls.updateElement(newLayoutDB[0], 'hsvisum', props.tableID)
            dbCalls.removeElement(
                { i: state.layout[1].i },
                'hsvisum',
                props.tableID
            )
        } else if (newLayout.length > state.layout.length) {
            dbCalls.updateElement(newLayoutDB[0], 'hsvisum', props.tableID)
            dbCalls.addElement(newLayoutDB[1], 'hsvisum', props.tableID)
        } else {
            for (let i = 0; i < newLayout.length; i++) {
                dbCalls.updateElement(newLayoutDB[i], 'hsvisum', props.tableID)
            }
        }
    }

    useEffect(() => {
        if (props.slotPosition) {
            placeSlot(props.slotPosition)
        }
    }, [props.slotPosition])

    function hideDragImage(e) {
        let dragImg = new Image(0, 0)
        dragImg.src =
            'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
        e.dataTransfer.setDragImage(dragImg, 0, 0)
        e.dataTransfer.setData('text/plain', 'dragHV')
        window.GlogalMessDragToBlankIgnore = true
    }

    function prepareLayoutForDB() {
        let newLayout = ''
        for (let i = 0; i < state.layout.length; i++) {
            newLayout +=
                '(' +
                state.layout[i].x +
                ',' +
                state.layout[i].y +
                ',' +
                state.layout[i].w +
                ',' +
                state.layout[i].h +
                ')'
            if (i < state.layout.length - 1) newLayout += ','
        }
        return newLayout
    }

    function saveToDB() {
        let newLayout = prepareLayoutForDB()
        //   dbLayout.saveButtonTemplate(newLayout,props.cellData.id,props.tableID);
    }

    //SPECIAL FUNCTIONS
    //SPLIT DRAGGING STUFF

    function setUpdateSteps(value) {
        lastUpdateSteps = value
    }

    function onDragEnd(e) {
        lastUpdateSteps = 0
        setState({
            ...state,
            dragging: false,
        })
        commitToDB(state.layout)
    }

    function lastMouseDown(e) {
        e.stopPropagation()
        clickLocation = { x: e.clientX, y: e.clientY }
        setState({
            ...state,
            dragging: true,
        })
    }

    function onMouseUp() {
        window.GlogalMessDragToBlankIgnore = false
        setState({
            ...state,
            dragging: false,
        })
    }

    function updateState(newLayout) {
        // props.updateAllSelected(newLayout);
        setState({
            ...state,
            layout: newLayout,
        })
    }

    function createElement(el) {
        // el.type="buttonFragment";
        //  el.tempAllowed=props.cellData.tempAllowed;
        el.gridSize = { w: 12, h: 12 }
        //el.triggerResults=state.triggerResults;
        return (
            <div key={el.i} data-grid={el}>
                <div
                    className="centerInDiv"
                    style={{ height: '100%', border: '0px solid green' }}
                >
                    {el.y != 0 && (
                        <div
                            className="dragV"
                            draggable="true"
                            onDragStart={hideDragImage}
                            onMouseDown={lastMouseDown}
                            onDragEnd={onDragEnd}
                            onDrag={(e) => {
                                dragHandler(
                                    e,
                                    'vertical',
                                    el.i,
                                    lastUpdateSteps,
                                    setUpdateSteps,
                                    state.layout,
                                    clickLocation,
                                    props.scale,
                                    props.width,
                                    props.height / 12,
                                    12,
                                    updateState
                                )
                            }}
                        ></div>
                    )}
                    <BlankCell
                        placeSlot={placeSlot}
                        cellData={el}
                        editMode={props.editMode}
                        isSplit={state.layout.length > 1}
                        slotPosition={state.slotPosition}
                        fontConfiguration={el.fontConfiguration}
                        multiCellData={props.multiCellData}
                        dragging={state.dragging}
                        isSlot={el.isSlot}
                    />
                    {el.x != 0 && (
                        <div
                            className="dragH"
                            draggable="true"
                            onDragStart={hideDragImage}
                            onMouseDown={lastMouseDown}
                            onDragEnd={onDragEnd}
                            onDrag={(e) => {
                                dragHandler(
                                    e,
                                    'horizontal',
                                    el.i,
                                    lastUpdateSteps,
                                    setUpdateSteps,
                                    state.layout,
                                    clickLocation,
                                    props.scale,
                                    props.width,
                                    props.height / 12,
                                    12,
                                    updateState
                                )
                            }}
                        ></div>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div
            //   ref ={props.cellData.ref}
            style={{
                backgroundColor: 'transparent',
                height: '100%',
            }}
        >
            <div
                style={{
                    marginLeft: '-2px',
                    marginRight: '-2px',
                    // overflow:"hidden"
                }} //možda margin na sve strane -4???
                className="centerInDiv"
            >
                <GridLayout
                    className="layoutXX"
                    layout={state.layout}
                    cols={12}
                    transformScale={props.scale}
                    rowHeight={props.height / 12}
                    width={props.width}
                    containerPadding={[0, 0]}
                    stretchContainer={false}
                    margin={[0, 0]}
                >
                    {_.map(state.layout, (el) => createElement(el))}
                </GridLayout>
            </div>
        </div>
    )
}
