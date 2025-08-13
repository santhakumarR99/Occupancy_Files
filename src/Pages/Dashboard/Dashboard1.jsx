import React, { useState, useEffect, useRef } from "react";
import DashboardFilters from "./DashboardFilters";
import LiveOccupancyChart from "./LiveOccupancyChart";
import DashboardFiltersModal from "./DashboardFilters";
import DashHeader from "../CommonComponents/Dashboard_Header";
import "../../Components/Styles/LiveChart.css";
import LiveOccupancyChart2 from "./OccupancyChart2";
import CustomCard from "../CommonComponents/Card";
import axios from "axios";
import { Tab, Nav, Table, Button, Form } from "react-bootstrap";

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(null); // hold selected filters
  const token = sessionStorage.getItem("token"); // token
  const vid = sessionStorage.getItem("vid"); // vendor id
  const username = sessionStorage.getItem("username"); // username
  const API_URL = import.meta.env.VITE_API_URL; // API main url
  const hasFetchedRef = useRef(false); // API  cals only once
    const tableWrapperRef = useRef(null); // div wrapper
  const fetchDashData = async () => {
    try {
      const payload = {
        selectedZones: ["HighZone", "LowZone"],
      };
      const res = await axios.post(
        `${API_URL}/dashboard/dashboard1/generateDashboardData`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res.data?.data);
      // setDashboardData(res.data?.data)
    } catch (err) {
      console.log(err);
    }
  };
   useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          tableWrapperRef.current &&
          !tableWrapperRef.current.contains(event.target)
        ) {
          setSelectedRowId(null);
        }
      };
  
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);
  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    fetchDashData();
  }, []);
  useEffect(() => {
    const datas = [
      {
        ZoneName: "Bana Zone1",
        Incount: 850,
        Outcount: 68,
        Occupancy: 782,
        Status: "Medium",
      },
      {
        ZoneName: "SEZ Zone1",
        Incount: 340,
        Outcount: 11,
        Occupancy: 329,
        Status: "Low",
      },
      {
        ZoneName: "Tidal Zone1",
        Incount: 503,
        Outcount: 17,
        Occupancy: 486,
        Status: "Low",
      },
      {
        ZoneName: "Bana Zone2",
        Incount: 980,
        Outcount: 18,
        Occupancy: 962,
        Status: "High",
      },
      {
        ZoneName: "SEZ Zone2",
        Incount: 756,
        Outcount: 40,
        Occupancy: 716,
        Status: "Medium",
      },
      {
        ZoneName: "Tidal Zone2",
        Incount: 402,
        Outcount: 28,
        Occupancy: 374,
        Status: "Low",
      },
      {
        ZoneName: "Bana Zone3",
        Incount: 385,
        Outcount: 24,
        Occupancy: 361,
        Status: "Low",
      },
      {
        ZoneName: "SEZ Zone3",
        Incount: 428,
        Outcount: 23,
        Occupancy: 405,
        Status: "Low",
      },
      {
        ZoneName: "Tidal Zone3",
        Incount: 950,
        Outcount: 39,
        Occupancy: 911,
        Status: "High",
      },
      {
        ZoneName: "Bana Zone4",
        Incount: 214,
        Outcount: 10,
        Occupancy: 204,
        Status: "Low",
      },
    ];

    setDashboardData(datas);
  }, []);

  const handleApplyFilters = async (filters) => {
    console.log(filters);
    setAppliedFilters(filters); // store for future use
    const payload = {
      vid: vid,
      username: username,
      country:
        filters.countries?.map((option) => option.label).join(", ") || "",
      city: filters.cities?.map((option) => option.label).join(", ") || "",
      //   zones:  filters.zones?.map(option => option.label).join(", ")||""
    };
    console.log(payload);
    let response = await axios.post(
      `${API_URL}/dashboard/dashboard1filter/filter`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response);
    setShowFilters(false); // close modal
  };
  return (
    <div className="p-4">
      <DashHeader
        title="Live Occupancy"
        onFilterClick={() => setShowFilters(true)}
      />
      <DashboardFiltersModal
        show={showFilters}
        onClose={() => setShowFilters(false)}
        onApply={handleApplyFilters}
        initialValues={appliedFilters}
      />
      {/* <DashboardFilters onDataFetched={setDashboardData} /> */}
      {/* <div className="mt-4">
        {dashboardData && dashboardData.length > 0 ? (
          <LiveOccupancyChart data={dashboardData} />
        ) : (
          <p>No data loaded yet.</p>
        )}
      </div> */}
      <div className="tabsec_dash">
        <Tab.Container defaultActiveKey="Dash1">
          <Nav variant="tabs">
            <Nav.Item>
              <Nav.Link eventKey="Dash1">Dashboard 1</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="Dash2">Dashboard 2</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="Dash3">Dashboard 3</Nav.Link>
            </Nav.Item>
          </Nav>

          <Tab.Content className="bg-white border p-3">
            <Tab.Pane eventKey="Dash1">
              <div className="UserTable_TopSection" ref={tableWrapperRef}>
                <div className="UserTable_Section">
                  <div style={{ maxHeight: "650px" }}>
                    <div className="mt-4">
                      {dashboardData && dashboardData.length > 0 ? (
                        <CustomCard title="" size="md">
                          <LiveOccupancyChart2 data={dashboardData} />
                        </CustomCard>
                      ) : (
                        <p>No data loaded yet.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Tab.Pane>

            <Tab.Pane eventKey="Dash2">
              <div className="UserTable_TopSection" ref={tableWrapperRef}>
                <div className="UserTable_Section"></div>
              </div>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </div>
    </div>
  );
};

export default DashboardPage;
