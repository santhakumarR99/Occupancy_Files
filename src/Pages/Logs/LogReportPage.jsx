import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchBar from "../Logs/SearchBar";
import DateFilter from "../Logs/DateFilter";
import LogTable from "../Logs/LogTable";
import CurrentTime from "../Logs/CurrentTime";
import '../Logs/common.css';
// import DeloptName from '../images/Delopt_name.png';
// import JKLogo from '../images/JK_Logo.png';

function getTodayString() {
  const today = new Date();
  return today.toISOString().slice(0, 10);
}

const Footer = 'Copyright © 2025 All Rights Reserved by';

function LogReportPage() {
  const [search, setSearch] = useState("");
  const [date, setDate] = useState(getTodayString());
  const [pendingDate, setPendingDate] = useState(getTodayString());
  const [selectedUser, setSelectedUser] = useState([]);
  const [pendingUser, setPendingUser] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState([]);
  const [pendingEvent, setPendingEvent] = useState([]);
  const [logs, setLogs] = useState([]);
  const [uniqueUsers, setUniqueUsers] = useState([]);
  const [uniqueEvents, setUniqueEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("");
  const [popup, setPopup] = useState({ show: false, message: "" });

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const loginRes = await axios.post("http://delbi2dev.deloptanalytics.com:3000/auth/login", {
          username: "Occupancy",
          password: "Occupancy@2025"
        });
        const token = loginRes.data?.token?.token;
        if (!token) throw new Error("No token received");
        setToken(token);

        const usersEventsRes = await axios.post(
          "http://delbi2dev.deloptanalytics.com:3000/settings/logs/usersEvents",
          {
            vid: 4,
            username: "Occupancy"
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );

        const users = (usersEventsRes.data.users || []).flat().map(u => u.UserName);
        const events = (usersEventsRes.data.events || []).flat().map(e => e.Events);

        setUniqueUsers(users);
        setUniqueEvents(events);

        setPendingUser(users);
        setPendingEvent(events);
        setSelectedUser(users);
        setSelectedEvent(events);

        await fetchLogs({
          username: users.join(","),
          events: events.join(","),
          fromDate: getTodayString(),
          toDate: getTodayString()
        }, token);

      } catch (err) {
        setLogs([]);
        setUniqueUsers([]);
        setUniqueEvents([]);
        setToken("");
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
    // eslint-disable-next-line
  }, []);

  const fetchLogs = async (params, overrideToken) => {
    setLoading(true);
    try {
      const body = {
        vid: 4,
        username: params.username,
        events: params.events,
        fromDate: params.fromDate,
        toDate: params.toDate,
        startTime: "0",
        endTime: "23"
      };
      const res = await axios.post(
        "http://delbi2dev.deloptanalytics.com:3000/settings/logs/getAuditLogs",
        body,
        {
          headers: {
            Authorization: `Bearer ${overrideToken || token}`,
            "Content-Type": "application/json"
          }
        }
      );
      const apiLogs = (res.data.logs || []).flat().map(log => ({
        date: log.CtDateTime ? log.CtDateTime.split("T")[0] : "",
        userName: log.UserName,
        description: log.Description,
        event: log.Event
      }));
      setLogs(apiLogs);
    } catch (err) {
      setLogs([]);
      console.error("Failed to fetch logs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => setSearch(e.target.value);

  const handleDateChange = (e) => {
    setPendingDate(e.target.value);
  };

  const handleClear = () => {
    const today = getTodayString();
    setPendingDate(today);
    setPendingUser(uniqueUsers);
    setPendingEvent(uniqueEvents);
    setSearch("");
    setDate(today);
    setSelectedUser(uniqueUsers);
    setSelectedEvent(uniqueEvents);

    fetchLogs({
      username: uniqueUsers.join(","),
      events: uniqueEvents.join(","),
      fromDate: today,
      toDate: today
    });
  };

  const handleApply = () => {
    if (!pendingUser.length) {
      setPopup({ show: true, message: "Please select at least one user." });
      return;
    }
    if (!pendingEvent.length) {
      setPopup({ show: true, message: "Please select at least one event." });
      return;
    }
    setDate(pendingDate);
    setSelectedUser([...pendingUser]);
    setSelectedEvent([...pendingEvent]);
    setSearch("");

    fetchLogs({
      username: pendingUser.join(","),
      events: pendingEvent.join(","),
      fromDate: pendingDate,
      toDate: pendingDate
    });
  };

  const handleUserChange = (values) => {
    setPendingUser(Array.isArray(values) ? values : []);
  };

  const handleEventChange = (values) => {
    setPendingEvent(Array.isArray(values) ? values : []);
  };

  const shouldDisableClear = () => {
    return pendingDate === getTodayString() &&
      pendingUser.length === uniqueUsers.length &&
      pendingEvent.length === uniqueEvents.length &&
      search === "";
  };

  const userOptions = uniqueUsers.map(u => ({ value: u, label: u }));
  const eventOptions = uniqueEvents.map(e => ({ value: e, label: e }));

  const filteredLogs = logs.filter(
    (log) => {
      const matchesSearch = log.description?.toLowerCase().includes(search.toLowerCase()) ||
        log.userName?.toLowerCase().includes(search.toLowerCase());
      const matchesDate = log.date?.startsWith(date);
      const matchesUser = !selectedUser || selectedUser.length === 0 || selectedUser.includes(log.userName);
      const matchesEvent = !selectedEvent || selectedEvent.length === 0 || selectedEvent.includes(log.event);
      return matchesSearch && matchesDate && matchesUser && matchesEvent;
    }
  );

  if (loading) return <div>Loading...</div>;

  return (
    <div className="Logs_container">
      <div className="bg">
        {/* <h1 className="logs-header">Logs</h1> */}
        {/* <div className="header-gap"></div> */}
      </div>
      <div className="logs-container">
        <div className="card">
          <div className="controls">
            <div className="filter-row">
              <SearchBar
                value={search}
                onChange={handleSearch}
                users={userOptions}
                events={eventOptions}
                selectedUser={pendingUser}
                selectedEvent={pendingEvent}
                onUserChange={handleUserChange}
                onEventChange={handleEventChange}
              />
              <DateFilter
                value={pendingDate}
                onChange={handleDateChange}
                onClear={handleClear}
                onApply={handleApply}
                disableClear={shouldDisableClear()}
              />
            </div>
          </div>
          <LogTable logs={filteredLogs} selectedDate={date} />
        </div>
        
        {popup.show && (
          <div className="popup-overlay">
            <div className="popup">
              <p>{popup.message}</p>
              <button onClick={() => setPopup({ show: false, message: "" })}>OK</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LogReportPage;