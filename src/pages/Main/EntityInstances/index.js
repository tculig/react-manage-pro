import { groupBy as rowGrouper } from "lodash";
import React, { useMemo, useState, useCallback } from "react";
import DataGrid, { SelectColumn } from "react-data-grid";
import "react-data-grid/dist/react-data-grid.css";
import ZoomControls from "../../../ui/GridUtils/ZoomControls";
import GroupByControl from "../../../ui/GridUtils/GroupByControl";
import utils from "../../../utils";
import "./style.scss";

export default function EntityInstances() {
  const columnsForGrid = [
    { key: "entityName", name: "Entity name" },
    { key: "numberOfFields", name: "Number of fields" },
    { key: "activeEntries", name: "Active entries" },
    { key: "dateCreated", name: "Date created" },
  ];

  const [state, setState] = useState({// eslint-disable-line
    gridColumns: [
      SelectColumn,
      ...columnsForGrid
    ],
    gridRows: [{
      id: 1,
      entityName: "test",
      numberOfFields: 3,
      activeEntries: 1,
      dateCreated: "2020-11-20"
    }, {
      id: 2,
      entityName: "test2",
      numberOfFields: 5,
      activeEntries: 4,
      dateCreated: "2020-14-20"
    }],
  });

  const [gridZoom, setGridZoom] = useState(1);
  const [selectedRows, setSelectedRows] = useState(() => new Set());
  const [[sortColumn, sortDirection], setSort] = useState([
    "entityName",
    "NONE",
  ]);

  // mostly things related to GroupByControl, some shared with GridControl
  const [groupByOptions, setGroupByOptions] = useState([]);
  const [expandedGroupIds, setExpandedGroupIds] = useState(() => new Set());
  const columnsForSort = utils.renameKeys(columnsForGrid, { key: "value", name: "label" });
  const groupBy = useMemo(
    () => (Array.isArray(groupByOptions)
      ? groupByOptions.map((o) => o.value)
      : undefined),
    [groupByOptions],
  );

  const sortRowsFunction = useMemo(() => {
    console.log(sortDirection);
    if (sortDirection === "NONE") return state.gridRows;
    let newSortedRows = [...state.gridRows];
    return sortDirection === "DESC" ? newSortedRows.reverse() : newSortedRows;
  }, [state.gridRows, sortDirection]);

  const handleSort = useCallback((columnKey, direction) => {
    setSort([columnKey, direction]);
  }, []);

  return (
    <>
      <GroupByControl
        options={columnsForSort}
        {...{
          groupByOptions,
          setGroupByOptions,
          setExpandedGroupIds,
        }}
      />
      <ZoomControls
        zoom={gridZoom}
        setZoom={setGridZoom}
      />
      <div className="gridTable" style={{ zoom: gridZoom }}>
        <DataGrid
          rowKey="id"
          rowKeyGetter={(row) => row.id}
          columns={state.gridColumns}
          rows={sortRowsFunction}
          selectedRows={selectedRows}
          onRowClick={(x, row) => {
            const newSelectedRows = new Set(
              [row.id].filter((y) => !selectedRows.has(y))
            );
            setSelectedRows(newSelectedRows);
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
    </>
  );
}
