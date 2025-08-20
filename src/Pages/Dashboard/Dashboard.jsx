import React, { useState, useEffect, useRef } from "react";
import DashHeader from "../CommonComponents/Dashboard_Header";
import "../../Components/Styles/LiveChart.css";
import LiveOccupancyChart2 from "./OccupancyChart2";
import CustomCard from "../CommonComponents/Card";
import axios from "axios";
import { Tab, Nav } from "react-bootstrap";
import DashFilters from "./CascadeMultiSelect";
import { showSuccess, showError, showInfo } from "../CommonComponents/Toaster";

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [countriesData, setCountriesData] = useState([]);
  const [citiesData, setCitiesData] = useState([]);
  const [zonesData, setZonesData] = useState([]);
  const [selectedCountriesData, setselectedCountriesData] = useState([]);
  const [selectedCitiesData, setselectedCitiesData] = useState([]);
  const [selectedZonesData, setselectedZonesData] = useState([]);
  const [zones, setZones] = useState([]);
  // 🔑 Always store applied filters safely
  const [appliedFilters, setAppliedFilters] = useState({
    countries: [],
    cities: [],
    zones: [],
  });

  const token = sessionStorage.getItem("token");
  const vid = sessionStorage.getItem("vid");
  const username = sessionStorage.getItem("username");
  const API_URL = import.meta.env.VITE_API_URL;
  const hasFetchedRef = useRef(false);
  const tableWrapperRef = useRef(null);

  const fetchDashData = async () => {
    try {
      const payload = {
        selectedZones: ["HighZone", "LowZone"],
      };
      const res = await axios.post(
        `${API_URL}/dashboard/dashboard1/generateDashboardData`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // console.log(res.data?.data);
      // setDashboardData(res.data?.data)
    } catch (err) {
      console.log(err);
    }
  };
  ///-----------------------------------------------------------------------------------------------------------------------------///

  const handleZones = async () => {
    // setLoading(true);
    try {
      let payload = {
        vid: vid,
        username: username,
        country: "",
        city: "",
        zone: "",
      };
      const response = await axios.post(
        `${API_URL}/dashboard/dashboard1filter/getSelectedZones`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const zoneData = response.data?.data; // assume [{id:1,name:"Zone1"}, {id:2,name:"Zone2"}]
      setZones(zoneData);
      const zoneNames = zoneData ? zoneData.selectedZones : "";
      let dashpayload = {
        selectedZones: zoneNames,
      };
      const sendRes = await axios.post(
        `${API_URL}/dashboard/dashboard1/generateDashboardData`,
        dashpayload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDashboardData(sendRes.data?.data);

      // console.log("Zones sent successfully:", sendRes.data?.data);
      // }
    } catch (error) {
      console.error("Error in handleZones:", error);
    } finally {
      // setLoading(false);
    }
  };

  // Call once on mount + every 5s
  useEffect(() => {
    handleZones();
    const interval = setInterval(() => {
      handleZones();
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  const filters = async () => {
    try {
      let payload = {
        vid: vid,
        username: username,
        country: "",
        city: "",
        zone: "",
      };
      const res = await axios.post(
        `${API_URL}/dashboard/dashboard1filter/filters`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // console.log(res.data?.selectedFilters,res.data?.allFilters );
      setCountriesData(
        (res.data?.allFilters?.countries || []).map((c) => ({
          value: String(c.id),
          label: c.Country,
        }))
      );
      setCitiesData(
        (res.data?.allFilters?.cities || []).map((ci) => ({
          value: String(ci.id),
          label: ci.City,
          countryId: String(ci.countryId),
        }))
      );
      setZonesData(
        (res.data?.allFilters?.zones || []).map((z) => ({
          value: String(z.id),
          label: z.Zonename,
          cityId: String(z.cityId),
        }))
      );
      setselectedCountriesData(
        (res.data?.selectedFilters?.countries || []).map((c) => ({
          value: String(c.id),
          label: c.Country,
        }))
      );
      setselectedCitiesData(
        (res.data?.selectedFilters?.cities || []).map((ci) => ({
          value: String(ci.id),
          label: ci.City,
          countryId: String(ci.countryId),
        }))
      );
      setselectedZonesData(
        (res.data?.selectedFilters?.zones || []).map((z) => ({
          value: String(z.id),
          label: z.Zonename,
          cityId: String(z.cityId),
        }))
      );
    } catch (err) {
      console.error("Error loading master data:", err);
    }
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        tableWrapperRef.current &&
        !tableWrapperRef.current.contains(event.target)
      ) {
        // setSelectedRowId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    fetchDashData();
    filters();
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
      {
        ZoneName: "Zone4",
        Incount: 220,
        Outcount: 10,
        Occupancy: 210,
        Status: "Low",
      },
      {
        ZoneName: "Zone6",
        Incount: 367,
        Outcount: 13,
        Occupancy: 354,
        Status: "Low",
      },
      {
        ZoneName: "Zone 9",
        Incount: 197,
        Outcount: 87,
        Occupancy: 110,
        Status: "Low",
      },
      {
        ZoneName: "Zone6",
        Incount: 112,
        Outcount: 32,
        Occupancy: 80,
        Status: "Low",
      },
    ];
    setDashboardData(datas);
  }, []);

  const handleApplyFilters = async (data) => {
    console.log("Filters from modal:", data);
    const payload = {
      vid,
      username,
      zone: data.zones?.map((o) => o.label).join(",") || "",
    };

    // console.log("Payload to API:", payload);

    try {
      let response = await axios.post(
        `${API_URL}/dashboard/dashboard1filter/updateFilterSettings`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Filtered data:", response.data);
      if (response.data) {
        showSuccess(response.data.message);
      }

      await handleZones();
      await filters();
    } catch (err) {
      console.error("Error applying filters:", err);
    }

    setShowFilters(false);
  };
  return (
    <div className="p-4">
      <DashHeader
        title="Live Occupancy"
        onFilterClick={async () => {
          await filters();
          setShowFilters(true);
        }}
        // onFilterClick={() => setShowFilters(true)}
      />

      {/* Cascade Filter Modal */}
      <DashFilters
        show={showFilters}
        onClose={() => setShowFilters(false)}
        onSave={handleApplyFilters}
        initialValues={appliedFilters}
        countriesData={countriesData}
        citiesData={citiesData}
        zonesData={zonesData}
        selectedCountriesData={selectedCountriesData}
        selectedCitiesData={selectedCitiesData}
        selectedZonesData={selectedZonesData}
      />

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

// import React, { useState, useEffect, useRef } from "react";
// import DashHeader from "../CommonComponents/Dashboard_Header";
// import "../../Components/Styles/LiveChart.css";
// import LiveOccupancyChart2 from "./OccupancyChart2";
// import CustomCard from "../CommonComponents/Card";
// import axios from "axios";
// import { Tab, Nav, Modal, Button } from "react-bootstrap";

// const DashboardPage = () => {
//   const [dashboardData, setDashboardData] = useState([]);
//   const [showFilters, setShowFilters] = useState(false);
//   const [showEnlarge, setShowEnlarge] = useState(false);
//   const tableWrapperRef = useRef(null);

//   // 🔑 Demo data – replace with API later
//   useEffect(() => {
//     const datas = [
//       { ZoneName: "Bana Zone1", Incount: 850, Outcount: 68, Occupancy: 782 },
//       { ZoneName: "SEZ Zone1", Incount: 340, Outcount: 11, Occupancy: 329 },
//       { ZoneName: "Tidal Zone1", Incount: 503, Outcount: 17, Occupancy: 486 },
//       { ZoneName: "Bana Zone2", Incount: 980, Outcount: 18, Occupancy: 962 },
//       { ZoneName: "SEZ Zone2", Incount: 756, Outcount: 40, Occupancy: 716 },
//       { ZoneName: "Tidal Zone2", Incount: 402, Outcount: 28, Occupancy: 374 },
//       { ZoneName: "Bana Zone3", Incount: 385, Outcount: 24, Occupancy: 361 },
//       { ZoneName: "SEZ Zone3", Incount: 428, Outcount: 23, Occupancy: 405 },
//       { ZoneName: "Tidal Zone3", Incount: 950, Outcount: 39, Occupancy: 911 },
//       { ZoneName: "Bana Zone4", Incount: 214, Outcount: 10, Occupancy: 204 },
//       { ZoneName: "Zone4", Incount: 220, Outcount: 10, Occupancy: 210 },
//       { ZoneName: "Zone6", Incount: 367, Outcount: 13, Occupancy: 354 },
//       { ZoneName: "Zone 9", Incount: 197, Outcount: 87, Occupancy: 110 },
//       { ZoneName: "Zone6", Incount: 112, Outcount: 32, Occupancy: 80 },
//     ];
//     setDashboardData(datas);
//   }, []);

//   return (
//     <div className="p-4">
//       <DashHeader
//         title="Live Occupancy"
//         onFilterClick={() => setShowFilters(true)}
//       />

//       <div className="tabsec_dash">
//         <Tab.Container defaultActiveKey="Dash1">
//           <Nav variant="tabs">
//             <Nav.Item>
//               <Nav.Link eventKey="Dash1">Dashboard 1</Nav.Link>
//             </Nav.Item>
//             <Nav.Item>
//               <Nav.Link eventKey="Dash2">Dashboard 2</Nav.Link>
//             </Nav.Item>
//             <Nav.Item>
//               <Nav.Link eventKey="Dash3">Dashboard 3</Nav.Link>
//             </Nav.Item>
//           </Nav>

//           <Tab.Content className="bg-white border p-3">
//             {/* Dashboard 1 */}
//             <Tab.Pane eventKey="Dash1">
//               <div className="UserTable_TopSection" ref={tableWrapperRef}>
//                 <div className="UserTable_Section">
//                   <div style={{ maxHeight: "650px" }}>
//                     <div className="mt-4">
//                       {dashboardData && dashboardData.length > 0 ? (
//                         <CustomCard title="" size="md">
//                           <div style={{ position: "relative" }}>
//                             {/* Enlarge button */}
//                             <button
//                               className="chart-enlarge"
//                               onClick={() => setShowEnlarge(true)}
//                               title="Enlarge"
//                               style={{
//                                 position: "absolute",
//                                 right: 8,
//                                 top: 8,
//                                 border: "none",
//                                 background: "transparent",
//                                 cursor: "pointer",
//                                 fontSize: 18,
//                               }}
//                             >
//                               ⛶
//                             </button>
//                             <LiveOccupancyChart2 data={dashboardData} />
//                           </div>
//                         </CustomCard>
//                       ) : (
//                         <p>No data loaded yet.</p>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </Tab.Pane>

//             {/* Dashboard 2 */}
//             <Tab.Pane eventKey="Dash2">
//               <CustomCard title="Dashboard 2 (Coming Soon)" size="md">
//                 <p>Placeholder for future charts</p>
//               </CustomCard>
//             </Tab.Pane>

//             {/* Dashboard 3 */}
//             <Tab.Pane eventKey="Dash3">
//               <CustomCard title="Dashboard 3 (Coming Soon)" size="md">
//                 <p>Placeholder for future charts</p>
//               </CustomCard>
//             </Tab.Pane>
//           </Tab.Content>
//         </Tab.Container>
//       </div>

//       {/* Modal for Enlarge View */}
//       <Modal show={showEnlarge} onHide={() => setShowEnlarge(false)} size="xl" centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Live Occupancy (Enlarged)</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <div style={{ width: "100%", height: 520 }}>
//             <LiveOccupancyChart2 data={dashboardData} />
//           </div>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowEnlarge(false)}>
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default DashboardPage;
