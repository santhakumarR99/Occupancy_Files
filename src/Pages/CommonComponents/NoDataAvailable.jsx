import React from "react";
import "../../Components/Styles/NoData.css"
import { AlertCircle } from "lucide-react"; 

const NoData = () => {
  return (
    <div className="no-data-container">
      <AlertCircle className="no-data-icon" />
      <p className="no-data-text">No Data Available</p>
    </div>
  );
};

export default NoData;
