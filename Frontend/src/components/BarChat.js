// src/components/BarChart.js
import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { fetchBarChart } from "../services/api";

const BarChart = ({ month }) => {
  const [data, setData] = useState({});

  useEffect(() => {
    const getBarChartData = async () => {
      const response = await fetchBarChart(month);
      setData({
        labels: Object.keys(response.data),
        datasets: [
          {
            label: "Number of Items",
            data: Object.values(response.data),
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      });
    };
    getBarChartData();
  }, [month]);

  return (
    <div>
      <h3>Bar Chart for {month}</h3>
      <Bar data={data} />
    </div>
  );
};

export default BarChart;
