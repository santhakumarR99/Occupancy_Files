// import React, { useState } from "react";
// import PropTypes from "prop-types";
// // import { exportToCSV } from "../utils/csvExport";
// import DateFilter from "./DateFilter";
// import './LogTable.css'

// const PAGE_SIZE = 10; // Number of logs to show per page

// const LogTable = ({
//   logs,
//   selectedDate,
//   dateFilterProps,
//   userFilterProps,
//   eventFilterProps,
// }) => {
//   const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
//   const [loading, setLoading] = useState(false);

//   const handleLoadMore = () => {
//     setLoading(true);
//     setTimeout(() => {
//       setVisibleCount((prev) => prev + PAGE_SIZE);
//       setLoading(false);
//     }, 500); // Simulate loading delay for UX
//   };

//   const visibleLogs = logs.slice(0, visibleCount);

//   return (
//     <div className="log-table-wrapper">
//       {logs.length > 0 && (
//         <div className="table-header">
//           <div className="table-controls">
//             {/* Optional Filters and Actions */}
//             {userFilterProps && <userFilterProps.component {...userFilterProps} />}
//             {eventFilterProps && <eventFilterProps.component {...eventFilterProps} />}
//             {dateFilterProps && <DateFilter {...dateFilterProps} />}
//             {/* <button
//               className="export-btn"
//               onClick={() => exportToCSV(logs, selectedDate)}
//             >
//               Export to CSV
//             </button> */}
//           </div>
//         </div>
//       )}

//       <table className="log-table">
//         <thead>
//           <tr>
//             <th>DATE</th>
//             <th>USER NAME</th>
//             <th>DESCRIPTION</th>
//             <th>EVENT</th>
//           </tr>
//         </thead>
//         <tbody>
//           {logs.length === 0 ? (
//             <tr>
//               <td colSpan="4" style={{ textAlign: "center" }}>No logs found</td>
//             </tr>
//           ) : (
//             visibleLogs.map((log, idx) => (
//               <tr key={`${log.date}-${log.userName}-${idx}`}>
//                 <td>{log.date}</td>
//                 <td>{log.userName}</td>
//                 <td>{log.description}</td>
//                 <td>{log.event}</td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>
//       {/* Lazy loading: Show Load More if there are more logs */}
//       {visibleCount < logs.length && (
//         <div style={{ textAlign: "center", margin: "1rem 0" }}>
//           <button
//             className="load-more-btn"
//             onClick={handleLoadMore}
//             disabled={loading}
//           >
//             {loading ? (
//               <>
//                 Loading
//                 <span className="spinner" />
//               </>
//             ) : (
//               "Load More"
//             )}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// LogTable.propTypes = {
//   logs: PropTypes.arrayOf(
//     PropTypes.shape({
//       date: PropTypes.string.isRequired,
//       userName: PropTypes.string.isRequired,
//       description: PropTypes.string.isRequired,
//       event: PropTypes.string.isRequired,
//     })
//   ).isRequired,
//   selectedDate: PropTypes.string.isRequired,
//   dateFilterProps: PropTypes.object,
//   userFilterProps: PropTypes.shape({
//     component: PropTypes.elementType.isRequired,
//   }),
//   eventFilterProps: PropTypes.shape({
//     component: PropTypes.elementType.isRequired,
//   }),
// };

// export default LogTable;

import React from "react";
import PropTypes from "prop-types";
import { DataGrid } from "@mui/x-data-grid";
import DateFilter from "./DateFilter";
import './LogTable.css';

const columns = [
  { field: "date", headerName: "DATE", flex: 1 },
  { field: "userName", headerName: "USER NAME", flex: 1 },
  { field: "description", headerName: "DESCRIPTION", flex: 2 },
  { field: "event", headerName: "EVENT", flex: 1 },
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

      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50, 100]}
          disableSelectionOnClick
          autoHeight
          sx={{
            backgroundColor: "white",
          }}
          localeText={{
            noRowsLabel: "No logs found",
          }}
        />
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