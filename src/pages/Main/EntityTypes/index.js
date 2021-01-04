import { groupBy as rowGrouper, first as _first } from "lodash";
import React, { useMemo, useReducer, useCallback, useEffect, useState } from "react";
import DataGrid, { SelectColumn } from "react-data-grid";
import ZoomControls from "../../../ui/GridUtils/ZoomControls";
import GroupByControl from "../../../ui/GridUtils/GroupByControl";
import ControlWidget from "../../../ui/ControlWidget";
import { renameKeys, modReducer } from "../../../utils";
import EntityTypeModal from "../../../modals/EntityTypeModal";
import ConfirmationModal from "../../../modals/ConfirmationModal";
import InfoModal from "../../../modals/InfoModal";
import { createEntityTypeDB, updateEntityTypeDB, getAvailableEntityTypes, removeEntityTypeDB } from "./dbcalls";
import "react-data-grid/dist/react-data-grid.css";
import "../../../ui/GridUtils/style.scss";
import "./style.scss";

export default function EntityTypes() {
  const columnsForGrid = [
    { key: "name", name: "Entity type name" },
    { key: "number_of_fields", name: "Number of fields" },
    { key: "active_entries", name: "Active entries" },
    { key: "dateCreated", name: "Date created" },
  ];

  const [state, setState] = useReducer(modReducer, {
    gridColumns: [
      SelectColumn,
      ...columnsForGrid
    ],
    gridRows: []
  });

  async function loadDataFromDB() {
    const availableEntities = await getAvailableEntityTypes();
    setState({
      gridRows: availableEntities
    });
  }

  // DB FUNCTIONS
  async function createEntityType(modalState) {
    const filledFields = modalState.fields.filter((item) => item.fieldName !== "");
    await createEntityTypeDB(modalState.name, filledFields);
    loadDataFromDB();
  }

  async function updateEntityType(modalState) {
    const filledFields = modalState.fields.filter((item) => item.fieldName !== "");
    updateEntityTypeDB(modalState.name, filledFields, modalState.originalValues);
  }

  useEffect(() => {
    loadDataFromDB();
  }, []);

  const [modalState, setModalState] = useState({
    isShowing: false,
    loadID: null,
    confirm: () => {}
  });
  const [infoModalState, setInfoModalState] = useState({
    isShowing: false,
    message: ""
  });
  const [isShowingDeleteConfirmModal, setIsShowingDeleteConfirmModal] = useState(false);
  const [gridZoom, setGridZoom] = useState(1);
  const [selectedRowIDs, setSelectedRowIDs] = useState(() => new Set());

  function getSelectedRows() {
    const selectedRowsArray = Array.from(selectedRowIDs);
    const selectedRows = selectedRowsArray.map((selectedID) => {
      for (let i = 0; i < state.gridRows.length; i++) {
        if (state.gridRows[i].id === selectedID) {
          return state.gridRows[i];
        }
      }
      return null;
    });
    return selectedRows;
  }

  function getSelectedRow() {
    return _first(getSelectedRows());
  }

  const [[sortColumn, sortDirection], setSort] = useState([
    "name",
    "NONE",
  ]);
  function closeModal() {
    setModalState({
      isShowing: false,
      loadID: null,
      confirm: () => {}
    });
  }
  function closeInfoModal() {
    setInfoModalState({
      isShowing: false,
      message: ""
    });
  }

  // mostly things related to GroupByControl, some shared with GridControl
  const [groupByOptions, setGroupByOptions] = useState([]);
  const [expandedGroupIds, setExpandedGroupIds] = useState(() => new Set());
  const columnsForSort = renameKeys(columnsForGrid, { key: "value", name: "label" });
  const groupBy = useMemo(
    () => (Array.isArray(groupByOptions)
      ? groupByOptions.map((o) => o.value)
      : undefined),
    [groupByOptions],
  );

  const sortRowsFunction = useMemo(() => {
    if (sortDirection === "NONE") return state.gridRows;
    const newSortedRows = [...state.gridRows];
    return sortDirection === "DESC" ? newSortedRows.reverse() : newSortedRows;
  }, [state.gridRows, sortDirection]);

  const handleSort = useCallback((columnKey, direction) => {
    setSort([columnKey, direction]);
  }, []);

  // MODAL FUNCTIONS
  function toggleNewEntityTypeModal() {
    setModalState({
      isShowing: true,
      loadID: null,
      confirm: createEntityType
    });
  }
  function toggleEditModal() {
    const selectedRowsArray = Array.from(selectedRowIDs);
    if (selectedRowsArray.length === 0) {
      setInfoModalState({
        isShowing: true,
        message: "Please select an entity type first."
      });
    } else {
      setModalState({
        isShowing: true,
        loadID: selectedRowsArray[0],
        confirm: updateEntityType
      });
    }
  }

  function toggleDeleteModal() {
    const selectedRowsArray = Array.from(selectedRowIDs);
    if (selectedRowsArray.length === 0) {
      setInfoModalState({
        isShowing: true,
        message: "Please select an entity type first."
      });
    } else {
      setIsShowingDeleteConfirmModal(true);
    }
  }

  async function deleteEntityType() {
    console.log("HE");
    const response = await removeEntityTypeDB(getSelectedRow().id);
    console.log(response);
    loadDataFromDB();
  }

  const isShowingEntityTypeModal = modalState.isShowing;

  return (
    <div style={{ padding: "10px" }}>
      <ControlWidget
        onAdd={toggleNewEntityTypeModal}
        onEdit={toggleEditModal}
        onDelete={toggleDeleteModal}
      />
      <GroupByControl
        options={columnsForSort}
        {...{
          groupByOptions,
          setGroupByOptions,
          setExpandedGroupIds,
        }}
      />
      <ZoomControls zoom={gridZoom} setZoom={setGridZoom} />
      <div className="gridTable" style={{ zoom: gridZoom }}>
        <DataGrid
          rowKey="id"
          rowKeyGetter={(row) => row.id}
          columns={state.gridColumns}
          rows={sortRowsFunction}
          selectedRows={selectedRowIDs}
          onRowClick={(x, row) => {
            const newSelectedRows = new Set(
              [row.id].filter((y) => !selectedRowIDs.has(y))
            );
            setSelectedRowIDs(newSelectedRows);
          }}
          defaultColumnOptions={{
            resizable: true,
            sortable: true,
          }}
          groupBy={groupBy}
          rowGrouper={rowGrouper}
          expandedGroupIds={expandedGroupIds}
          onExpandedGroupIdsChange={setExpandedGroupIds}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
        />
      </div>
      {isShowingEntityTypeModal && (
        <EntityTypeModal
          {...modalState}
          close={closeModal}
          cancel={closeModal}
          entityTypeBasicInfo={getSelectedRow()}
        />
      )}
      {isShowingDeleteConfirmModal && (
        <ConfirmationModal
          header="Confirmation"
          message={`Are you sure you want to delete entity type: ${getSelectedRow().name}`}
          confirm={deleteEntityType}
          close={() => setIsShowingDeleteConfirmModal(false)}
        />
      )}
      <InfoModal {...infoModalState} close={closeInfoModal} />
    </div>
  );
}
