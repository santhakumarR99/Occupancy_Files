import React from "react";
import PropTypes from "prop-types";
import { DataGrid } from "@mui/x-data-grid";
import DateFilter from "./DateFilter";
import './LogTable.css';
import DataTable from "react-data-table-component";


  const conditionalRowStyles = [
    // {
    //   when: (row) => row.id === selectedRowId,
    //   style: {
    //     backgroundColor: "#f6f7fc",
    //   },
    // },
  ];
  const columns = [
    {
      name: "DATE",
      selector: (row) => row.date,
    },
    {
      name: "USER NAME",
      selector: (row) => row.userName,
    },
    {
      name: "DESCRIPTION",
      selector: (row) => row.description,
    },
    {
      name: "EVENT",
      selector: (row) => row.event,
    },
  ];

const LogTable = ({
  logs,
  selectedDate,
  dateFilterProps,
  userFilterProps,
  eventFilterProps,
}) => {
  // DataGrid requires a unique id for each row
  const rows = logs.map((log, idx) => ({
    id: idx,
    ...log,
  }));

  return (
    <div className="log-table-wrapper">
      {logs.length > 0 && (
        <div className="table-header">
          <div className="table-controls">
            {userFilterProps && <userFilterProps.component {...userFilterProps} />}
            {eventFilterProps && <eventFilterProps.component {...eventFilterProps} />}
            {dateFilterProps && <DateFilter {...dateFilterProps} />}
          </div>
        </div>
      )}

      <div style={{ width: "100%" }}>
      {/* <div> */}
        {/* <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[5,10, 25, 50, 100]}
          disableSelectionOnClick
          autoHeight
          sx={{
            backgroundColor: "white",
          }}
          localeText={{
            noRowsLabel: "No logs found",
          }} */}
        {/* <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: { paginationModel: { pageSize: 10, page: 0 } }
          }}
          pageSizeOptions={[5, 10, 25, 50, 100]}
          disableSelectionOnClick
          autoHeight
          sx={{
            backgroundColor: "white",
          }}
          localeText={{
            noRowsLabel: "No logs found",
          }}
        /> */}

          <div style={{ overflowY: "scroll" }}>
                    {/* const FixedHeaderStory = ({ fixedHeader, fixedHeaderScrollHeight }) => ( */}
                    <DataTable
                      columns={columns}
                      data={rows}
                      // onRowClicked={(row) => setSelectedRowId(row.SL)}
                      highlightOnHover
                      pointerOnHover
                      selectableRowsHighlight
                      conditionalRowStyles={conditionalRowStyles}
                      pagination
                      paginationPerPage={10}
                      paginationRowsPerPageOptions={[5, 10, 15]}
                      responsive
                      // fixedHeader={FixedHeader}
                      // fixedHeaderScrollHeight={
                      //   FixedHeader.fixedHeaderScrollHeight
                      // }
                    />
                  </div>

      </div>
    </div>
  );
};

LogTable.propTypes = {
  logs: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      userName: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      event: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedDate: PropTypes.string.isRequired,
  dateFilterProps: PropTypes.object,
  userFilterProps: PropTypes.shape({
    component: PropTypes.elementType.isRequired,
  }),
  eventFilterProps: PropTypes.shape({
    component: PropTypes.elementType.isRequired,
  }),
};

export default LogTable;