// import React, { useState, useEffect, useRef } from "react";
// import DashHeader from "../CommonComponents/Dashboard_Header";
// import "../../Components/Styles/LiveChart.css";
// import LiveOccupancyChart2 from "./OccupancyChart2";
// import CustomCard from "../CommonComponents/Card";
// import axios from "axios";
// import { Tab, Nav, Spinner } from "react-bootstrap";
// import DashFilters from "./CascadeMultiSelect";
// import { showSuccess } from "../CommonComponents/Toaster";
// import NoData from "../CommonComponents/NoDataAvailable";

// const DashboardPage = () => {
//   const [dashboardData, setDashboardData] = useState(null);
//   const [showFilters, setShowFilters] = useState(false);
//   const [countriesData, setCountriesData] = useState([]);
//   const [citiesData, setCitiesData] = useState([]);
//   const [zonesData, setZonesData] = useState([]);
//   const [selectedCountriesData, setselectedCountriesData] = useState([]);
//   const [selectedCitiesData, setselectedCitiesData] = useState([]);
//   const [selectedZonesData, setselectedZonesData] = useState([]);
//   const [zones, setZones] = useState([]);

//   const [pageLoading, setPageLoading] = useState(true); // ✅ only for first load

//   const [appliedFilters, setAppliedFilters] = useState({
//     countries: [],
//     cities: [],
//     zones: [],
//   });

//   const token = sessionStorage.getItem("token");
//   const vid = sessionStorage.getItem("vid");
//   const username = sessionStorage.getItem("username");
//   const API_URL = import.meta.env.VITE_API_URL;
//   const hasFetchedRef = useRef(false);
//   const tableWrapperRef = useRef(null);

//   const handleZones = async (isFirstLoad = false) => {
//     if (isFirstLoad) setPageLoading(true);

//     try {
//       let payload = { vid, username, country: "", city: "", zone: "" };
//       const response = await axios.post(
//         `${API_URL}/dashboard/dashboard1filter/getSelectedZones`,
//         payload,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       const zoneData = response.data?.data;
//       setZones(zoneData);

//       const zoneNames = zoneData ? zoneData.selectedZones : "";
//       let dashpayload = { selectedZones: zoneNames };

//       const sendRes = await axios.post(
//         `${API_URL}/dashboard/dashboard1/generateDashboardData`,
//         dashpayload,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setDashboardData(sendRes.data?.data || []);
//     } catch (error) {
//       console.error("Error in handleZones:", error);
//       setDashboardData([]);
//     } finally {
//       if (isFirstLoad) setPageLoading(false);
//     }
//   };

//   // First load + auto refresh silently
//   useEffect(() => {
//     handleZones(true); // ✅ loader only here

//     const interval = setInterval(() => {
//       handleZones(false); // ✅ silent refresh, no loader
//     }, 5000);

//     return () => clearInterval(interval);
//   }, []);

//   const filters = async () => {
//     try {
//       let payload = { vid, username, country: "", city: "", zone: "" };
//       const res = await axios.post(
//         `${API_URL}/dashboard/dashboard1filter/filters`,
//         payload,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setCountriesData(
//         (res.data?.allFilters?.countries || []).map((c) => ({
//           value: String(c.id),
//           label: c.Country,
//         }))
//       );
//       setCitiesData(
//         (res.data?.allFilters?.cities || []).map((ci) => ({
//           value: String(ci.id),
//           label: ci.City,
//           countryId: String(ci.countryId),
//         }))
//       );
//       setZonesData(
//         (res.data?.allFilters?.zones || []).map((z) => ({
//           value: String(z.id),
//           label: z.Zonename,
//           cityId: String(z.cityId),
//         }))
//       );
//       setselectedCountriesData(
//         (res.data?.selectedFilters?.countries || []).map((c) => ({
//           value: String(c.id),
//           label: c.Country,
//         }))
//       );
//       setselectedCitiesData(
//         (res.data?.selectedFilters?.cities || []).map((ci) => ({
//           value: String(ci.id),
//           label: ci.City,
//           countryId: String(ci.countryId),
//         }))
//       );
//       setselectedZonesData(
//         (res.data?.selectedFilters?.zones || []).map((z) => ({
//           value: String(z.id),
//           label: z.Zonename,
//           cityId: String(z.cityId),
//         }))
//       );
//     } catch (err) {
//       console.error("Error loading master data:", err);
//     }
//   };

//   useEffect(() => {
//     if (hasFetchedRef.current) return;
//     hasFetchedRef.current = true;
//     filters();
//   }, []);

//   const handleApplyFilters = async (data) => {
//     const payload = {
//       vid,
//       username,
//       zone: data.zones?.map((o) => o.label).join(",") || "",
//     };

//     try {
//       let response = await axios.post(
//         `${API_URL}/dashboard/dashboard1filter/updateFilterSettings`,
//         payload,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       if (response.data) {
//         showSuccess(response.data.message);
//       }

//       await handleZones(true); // ✅ reload with loader
//       await filters();
//     } catch (err) {
//       console.error("Error applying filters:", err);
//     }

//     setShowFilters(false);
//   };

//   return (
//     <div className="p-4">
//       <DashHeader
//         title="Live Occupancy"
//         onFilterClick={async () => {
//           await filters();
//           setShowFilters(true);
//         }}
//       />

//       {/* Cascade Filter Modal */}
//       <DashFilters
//         show={showFilters}
//         onClose={() => setShowFilters(false)}
//         onSave={handleApplyFilters}
//         initialValues={appliedFilters}
//         countriesData={countriesData}
//         citiesData={citiesData}
//         zonesData={zonesData}
//         selectedCountriesData={selectedCountriesData}
//         selectedCitiesData={selectedCitiesData}
//         selectedZonesData={selectedZonesData}
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
//             <Tab.Pane eventKey="Dash1">
//               <div className="UserTable_TopSection" ref={tableWrapperRef}>
//                 <div className="UserTable_Section">
//                   <div style={{ maxHeight: "650px" }}>
//                     <div className="mt-4">
//                       <CustomCard title="" size="md">
//                         {pageLoading ? (
//                           // ✅ loader only on first load / refresh
//                           <div
//                             className="d-flex justify-content-center align-items-center"
//                             style={{ height: "250px" }}
//                           >
//                             <Spinner animation="border" variant="primary" />
//                           </div>
//                         ) : dashboardData && dashboardData.length > 0 ? (
//                           <LiveOccupancyChart2 data={dashboardData} />
//                         ) : (
//                           <NoData />
//                         )}
//                       </CustomCard>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </Tab.Pane>
//           </Tab.Content>
//         </Tab.Container>
//       </div>
//     </div>
//   );
// };

// export default DashboardPage;
import React, { useState, useEffect, useRef } from "react";
import DashHeader from "../CommonComponents/Dashboard_Header";
import "../../Components/Styles/LiveChart.css";
import LiveOccupancyChart2 from "./OccupancyChart2";
import CustomCard from "../CommonComponents/Card";
import axios from "axios";
import { Tab, Nav, Spinner } from "react-bootstrap";
import DashFilters from "./CascadeMultiSelect";
import { showSuccess } from "../CommonComponents/Toaster";
import NoData from "../CommonComponents/NoDataAvailable";

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
  const [pageLoading, setPageLoading] = useState(true); // ✅ only for first load
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

  const handleZones = async (isFirstLoad = false) => {
    if (isFirstLoad) setPageLoading(true);

    try {
      let payload = { vid, username, country: "", city: "", zone: "" };
      const response = await axios.post(
        `${API_URL}/dashboard/dashboard1filter/getSelectedZones`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const zoneData = response.data?.data;
      setZones(zoneData);

      const zoneNames = zoneData ? zoneData.selectedZones : "";
      let dashpayload = { selectedZones: zoneNames };

      const sendRes = await axios.post(
        `${API_URL}/dashboard/dashboard1/generateDashboardData`,
        dashpayload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setDashboardData(sendRes.data?.data || []);
    } catch (error) {
      console.error("Error in handleZones:", error);
      setDashboardData([]);
    } finally {
      if (isFirstLoad) setPageLoading(false);
    }
  };

  // First load + auto refresh silently
  useEffect(() => {
    handleZones(true); 

    const interval = setInterval(() => {
      handleZones(false); 
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const filters = async () => {
    try {
      let payload = { vid, username, country: "", city: "", zone: "" };
      const res = await axios.post(
        `${API_URL}/dashboard/dashboard1filter/filters`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
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
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    filters();
  }, []);

  const handleApplyFilters = async (data) => {
    const payload = {
      vid,
      username,
      zone: data.zones?.map((o) => o.label).join(",") || "",
    };

    try {
      let response = await axios.post(
        `${API_URL}/dashboard/dashboard1filter/updateFilterSettings`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data) {
        showSuccess(response.data.message);
      }

      await handleZones(true);
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
              <div className="UserTable_TopSection">
                <div className="UserTable_Section">
                  <div style={{ maxHeight: "650px" }}>
                    <div className="mt-4">
                      <CustomCard title="" size="md">
                        {pageLoading ? (
                          // Loader only on first page load
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              alignItems: "center",
                              height: "250px",
                              background: "rgba(250,250,250,0.7)",
                              borderRadius: "12px",
                            }}
                          >
                            <Spinner
                              animation="border"
                              variant="primary"
                              style={{ width: "2rem", height: "2rem" }}
                            />
                            <p className="mt-3 text-muted">Loading chart...</p>
                          </div>
                        ) : dashboardData && dashboardData.length > 0 ? (
                          <LiveOccupancyChart2 data={dashboardData} />
                        ) : (
                          // ✅ Only show NoData when pageLoading is false AND data is empty
                          <NoData />
                        )}
                      </CustomCard>
                    </div>
                  </div>
                </div>
              </div>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </div>
    </div>
  );
};

export default DashboardPage;
