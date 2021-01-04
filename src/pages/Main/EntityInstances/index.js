import { groupBy as rowGrouper, first as _first } from "lodash";
import React, { useMemo, useReducer, useCallback, useEffect, useState } from "react";
import DataGrid from "react-data-grid";
import ZoomControls from "../../../ui/GridUtils/ZoomControls";
import GroupByControl from "../../../ui/GridUtils/GroupByControl";
import ControlWidget from "../../../ui/ControlWidget";
import { renameKeys, modReducer } from "../../../utils";
import EntityInstanceModal from "../../../modals/EntityInstanceModal";
import ConfirmationModal from "../../../modals/ConfirmationModal";
import InfoModal from "../../../modals/InfoModal";
import { createEntityTypeDB, updateEntityTypeDB, getAvailableEntityTypes, removeEntityTypeDB, getEntityTypeProperties, getEntityTypeEntries } from "./dbcalls";
import "react-data-grid/dist/react-data-grid.css";
import "../../../ui/GridUtils/style.scss";
import "./style.scss";
import { CustomSelectStyles } from "../../../ui/ControlWidget/CustomSelectStyles";
import InputEmptyValidator from "../../../utils/InputEmptyValidator";

CustomSelectStyles.control = (provided) => ({
  ...provided,
  minHeight: "1px",
  width: "160px",
  height: "36px",
  boxShadow: "none",
});

export default function EntityInstances() {
  const columnsForGrid = [];

  const [state, setState] = useReducer(modReducer, {
    gridColumns: [],
    gridRows: [],
  });

  const [selectState, setSelectState] = useReducer(modReducer, {
    options: [],
    onChange: updateShowing,// eslint-disable-line
    styles: CustomSelectStyles,
    value: null,
  });

  function updateShowing(newValue) {
    setSelectState({
      value: newValue,
    });
  }

  // DB FUNCTIONS
  async function loadDataEntityTypesDB() {
    const availableEntities = await getAvailableEntityTypes();
    const selectRows = availableEntities.map((entry) => {
      return { value: entry.id, label: entry.name };
    });
    setSelectState({
      options: selectRows,
      value: selectRows[0]
    });
  }

  async function loadEntityTypePropertiesDB(entityTypeId) {
    const entityTypeProperties = await getEntityTypeProperties(entityTypeId);
    const newGridColumns = entityTypeProperties.map((entry) => {
      return { key: entry.id, name: entry.property_name };
    });
    setState({
      gridColumns: newGridColumns
    });
    return true;
  }

  async function loadEntityTypeEntriesDB(entityTypeId) {
    const entityTypeEntries = await getEntityTypeEntries(entityTypeId);
    console.log(entityTypeEntries);
  }

  async function createEntityInstance(modalState) {
    const filledFields = modalState.fields.filter((item) => item.fieldName !== "");
    await createEntityTypeDB(modalState.name, filledFields);
    loadDataEntityTypesDB();
  }

  async function updateEntityInstance(modalState) {
    const filledFields = modalState.fields.filter((item) => item.fieldName !== "");
    updateEntityTypeDB(modalState.name, filledFields, modalState.originalValues);
  }

  useEffect(() => {
    loadDataEntityTypesDB();
  }, []);

  useEffect(() => {
    async function loadColumnsAndEntries(value) {
      await loadEntityTypePropertiesDB(value);
      loadEntityTypeEntriesDB(value);
    }
    if (selectState.value !== null) {
      loadColumnsAndEntries(selectState.value.value);
    }
  }, [selectState.value]);

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
  function toggleNewEntityInstanceModal() {
    setModalState({
      isShowing: true,
      loadID: null,
      confirm: createEntityInstance
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
        confirm: updateEntityInstance
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
    loadDataEntityTypesDB();
  }

  const isShowingEntityModal = modalState.isShowing;
  const entityTypeSelected = {
    label: selectState.value?.label,
    id: selectState.value?.value
  };

  return (
    <div style={{ padding: "10px" }}>
      <ControlWidget
        onAdd={toggleNewEntityInstanceModal}
        onEdit={toggleEditModal}
        onDelete={toggleDeleteModal}
        select={selectState}
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
      {isShowingEntityModal && (
        <EntityInstanceModal
          {...modalState}
          close={closeModal}
          cancel={closeModal}
          entityTypeBasicInfo={entityTypeSelected}
          validator={new InputEmptyValidator()}
        />
      )}
      {isShowingDeleteConfirmModal && (
        <ConfirmationModal
          header="Confirmation"
          message={`Are you sure you want to delete entity instance: ${getSelectedRow().name}`}
          confirm={deleteEntityType}
          close={() => setIsShowingDeleteConfirmModal(false)}
        />
      )}
      <InfoModal {...infoModalState} close={closeInfoModal} />
    </div>
  );
}
