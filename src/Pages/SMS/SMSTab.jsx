import React, { useState } from "react";
import "./EmailTab.css";
import SMSTabButtons from "./SMSTabButtons";
import SMSForm from "./SMSForm";
import SMSGroupTable from "./SMSGroupTable";

const SMSTab = () => {
  const [activeTab, setActiveTab] = useState("sms");

  return (
    <div className="sms_email-container">
      {/* <h2 className="email-title">SMS</h2> */}
      <SMSTabButtons activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="sms_tab-content">
        {activeTab === "sms" ? <SMSForm /> : <SMSGroupTable />}
      </div>
    </div>
  );
};

export default SMSTab;
