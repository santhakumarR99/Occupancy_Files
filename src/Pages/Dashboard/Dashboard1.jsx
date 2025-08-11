import React, { useState, useEffect, useRef } from "react";
import DashboardFilters from "./DashboardFilters";
import LiveOccupancyChart from "./LiveOccupancyChart";
import DashboardFiltersModal from "./DashboardFilters";
import DashHeader from "../CommonComponents/Dashboard_Header";
import "../../Components/Styles/LiveChart.css";
import LiveOccupancyChart2 from "./OccupancyChart2";
import CustomCard from "../CommonComponents/Card";
import axios from "axios";

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(null); // hold selected filters
  const token = sessionStorage.getItem("token"); // token
  const vid = sessionStorage.getItem("vid"); // vendor id
  const username = sessionStorage.getItem("username"); // username
  const API_URL = import.meta.env.VITE_API_URL; // API main url
  const hasFetchedRef = useRef(false); // API  cals only once
const fetchDashData = async () => {
      try {
        const payload = {
          selectedZones: ["HighZone", "LowZone"]
        };
        const res = await 
          axios.post(`${API_URL}/dashboard/dashboard1/generateDashboardData`, payload, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log(res.data?.data)
          setDashboardData(res.data?.data)
      } catch (err) {
        console.log(err);
      }
    };
      useEffect(() => {
    
          if (hasFetchedRef.current) return;
      hasFetchedRef.current = true;
        fetchDashData();
      }, []);
  useEffect(() => {
    const datas = [
      { zone: "Bana Zone1", in: 850, out: 68, occupancy: 782, type: "Medium" },
      { zone: "SEZ Zone1", in: 340, out: 11, occupancy: 329, type: "Low" },
      { zone: "Tidal Zone1", in: 503, out: 17, occupancy: 486, type: "Low" },
      { zone: "Bana Zone2", in: 980, out: 18, occupancy: 962, type: "High" },
      { zone: "SEZ Zone2", in: 756, out: 40, occupancy: 716, type: "Medium" },
      { zone: "Tidal Zone2", in: 402, out: 28, occupancy: 374, type: "Low" },
      { zone: "Bana Zone3", in: 385, out: 24, occupancy: 361, type: "Low" },
      { zone: "SEZ Zone3", in: 428, out: 23, occupancy: 405, type: "Low" },
      { zone: "Tidal Zone3", in: 950, out: 39, occupancy: 911, type: "High" },
      { zone: "Bana Zone4", in: 214, out: 10, occupancy: 204, type: "Low" },
    ];

    setDashboardData(datas);
  }, []);

  const handleApplyFilters = async (filters) => {
    console.log(filters)
    setAppliedFilters(filters); // store for future use
    const payload = {
      vid: vid,
      username: username,
      country:  filters.countries?.map(option => option.label).join(", ")||"",
      city: filters.cities?.map(option => option.label).join(", ")||"",
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
    console.log(response)
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
      <div className="mt-4">
        {dashboardData && dashboardData.length > 0 ? (
          <CustomCard title="Live Occupancy" size="md">
            <LiveOccupancyChart2 data={dashboardData} />
          </CustomCard>
        ) : (
          <p>No data loaded yet.</p>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
