import React from "react";
import "../../Components/Styles/Header.css";
import { Button } from "react-bootstrap";
import "../../Components/Styles/CustomButtons.css"
const DashHeader = ({ title ,onFilterClick }) => {
  return (
    <>
      <div className="bg-light text-muted  d-flex justify-content-between align-items-center">
        <div className="headerLabel">
          <header className="headersec">
            <h3>{title}</h3>
          </header>
        </div>
        <div className="filterSection">
          <Button
            className="custom-close-button"
            variant="secondary"
            onClick={onFilterClick}
          >
            Filters
          </Button>
        </div>
      </div>
    </>
  );
};

export default DashHeader;
