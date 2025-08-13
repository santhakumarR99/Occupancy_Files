import React, { useState } from "react";
import "./EmailTab.css";
import EmailTabButtons from "./EmailTabButtons";
import EmailForm from "./EmailForm";
import EmailGroupTable from "./EmailGroupTable";

const EmailTab = () => {
  const [activeTab, setActiveTab] = useState("email");

  return (
    <div className="email-container">
      {/* <h2 className="email-title">Email</h2> */}
      <EmailTabButtons activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="email_tab-content">
        {activeTab === "email" ? <EmailForm /> : <EmailGroupTable />}
      </div>
      <footer className="email-footer">
        <span>04:20pm, 24-Nov-25</span>
        <span className="footer-right">
          Copyright © 2025 All Rights Reserved by DELOPT
        </span>
      </footer>
    </div>
  );
};

export default EmailTab;