// src/components/Statistics.js
import React, { useState, useEffect } from "react";
import { fetchStatistics } from "../services/api";

const Statistics = ({ month }) => {
  const [statistics, setStatistics] = useState({});

  useEffect(() => {
    const getStatistics = async () => {
      const response = await fetchStatistics(month);
      setStatistics(response.data);
    };
    getStatistics();
  }, [month]);

  return (
    <div>
      <h3>Statistics for {month}</h3>
      <p>Total Sale Amount: ${statistics.totalSaleAmount}</p>
      <p>Total Sold Items: {statistics.totalSoldItems}</p>
      <p>Total Not Sold Items: {statistics.totalNotSoldItems}</p>
    </div>
  );
};

export default Statistics;
