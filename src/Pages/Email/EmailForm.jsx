import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const EmailForm = () => {
  const [form, setForm] = useState({
    smtpServer: "",
    smtpPort: "",
    email: "",
    username: "",
    password: "",
    ssl: false,
  });
  const token = sessionStorage.getItem("token");
  const MainUsername = sessionStorage.getItem("username") || "Occupancy";

  // Fetch existing SMTP settings
  const fetchSMTP = async () => {
    try {
      const res = await axios.post(
        "http://delbi2dev.deloptanalytics.com:3000/settings/email/getSMTP",
        { username: MainUsername },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const d = res?.data || {};
      // API returns: { success, message, smtpData: [ { "SMTP server": ..., "SMTP Port": ..., ... } ] }
      const item = Array.isArray(d.smtpData) && d.smtpData.length > 0 ? d.smtpData[0] : null;
      if (!item) {
        toast.info("No SMTP settings found");
        return;
      }

      const smtpserver = item["SMTP server"] ?? item.smtpserver ?? item.smtpServer ?? "";
      const port = item["SMTP Port"] ?? item.port ?? item.smtpPort ?? "";
      const email = item["Email"] ?? item.email ?? "";
      const eusername = item["UserName"] ?? item.eusername ?? item.username ?? "";
      const pwd = item["Password"] ?? "";
      const sslVal = item["SSL"] ?? item.ssl ?? false; // may be 0/1 or boolean

      setForm((prev) => ({
        ...prev,
        smtpServer: smtpserver || "",
        smtpPort: port !== undefined && port !== null ? String(port) : "",
        email: email || "",
        username: eusername || "",
        password: typeof pwd === "string" ? pwd : "",
        ssl: typeof sslVal === "number" ? Boolean(sslVal) : Boolean(sslVal),
      }));
    } catch (err) {
      console.error(err);
      toast.error("Failed to load SMTP settings");
    }
  };

  useEffect(() => {
    if (!token) {
      toast.error("Missing auth token");
      return;
    }
    fetchSMTP();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateField = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "smtpPort") {
      const onlyDigits = value.replace(/\D+/g, "");
      setForm((prev) => ({ ...prev, smtpPort: onlyDigits }));
      return;
    }
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const validate = () => {
    const errors = [];
    if (!form.smtpServer.trim()) errors.push("SMTP Server is required");
    if (!form.smtpPort.trim()) {
      errors.push("SMTP Port is required");
    } else if (!/^\d+$/.test(form.smtpPort) || +form.smtpPort <= 0 || +form.smtpPort > 65535) {
      errors.push("SMTP Port must be a number between 1 and 65535");
    }
    if (!form.email.trim()) {
      errors.push("Email is required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.push("Email is invalid");
    }
    if (!form.username.trim()) errors.push("User Name is required");
  if (!form.password.trim()) errors.push("Password is required");

    if (errors.length) {
      errors.forEach((msg) => toast.error(msg, { toastId: msg }));
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    saveSMTP();
  };

  const saveSMTP = async () => {
    // Save/Update SMTP settings
    try {
      if (!token) {
        toast.error("Missing auth token");
        return;
      }
      const payload = {
        username: MainUsername,
        smtpserver: form.smtpServer.trim(),
        port: Number(form.smtpPort),
        email: form.email.trim(),
        eusername: form.username.trim(),
        euserpwd: form.password,
        ssl: form.ssl,
      };
      await axios.post(
        "http://delbi2dev.deloptanalytics.com:3000/settings/email/saveSMTP",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("SMTP settings saved");
      // refresh form from server (optional)
      fetchSMTP();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save SMTP settings");
    }
  };

  return (
    <div>
      <div className="email-form-bg">
        <form onSubmit={handleSubmit} className="email-form" noValidate>
          <div className="form-row">
            <div>
              <label>SMTP Server *</label>
              <input
                type="text"
                name="smtpServer"
                value={form.smtpServer}
                onChange={updateField}
              />
            </div>
            <div>
              <label>SMTP Port *</label>
              <input
                type="text"
                name="smtpPort"
                inputMode="numeric"
                value={form.smtpPort}
                onChange={updateField}
              />
            </div>
          </div>
          <div className="form-row">
            <div>
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={updateField}
              />
            </div>
            <div>
              <label>User Name *</label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={updateField}
              />
            </div>
          </div>
          <div className="form-row">
            <div>
              <label>Password *</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={updateField}
              />
            </div>
            <div className="ssl-checkbox">
              <input
                type="checkbox"
                id="ssl"
                name="ssl"
                checked={form.ssl}
                onChange={updateField}
              />
              <label htmlFor="ssl">Enable SSL</label>
            </div>
          </div>
          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() =>
                setForm({
                  smtpServer: "",
                  smtpPort: "",
                  email: "",
                  username: "",
                  password: "",
                  ssl: false,
                })
              }
            >
              Cancel
            </button>
            <button type="submit" className="save-btn">Save</button>
          </div>
        </form>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        toastStyle={{ textAlign: "center" }}
      />
    </div>
  );
};

export default EmailForm;
