// src/components/PieChart.js
import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { fetchPieChart } from "../services/api";

const PieChart = ({ month }) => {
  const [data, setData] = useState({});

  useEffect(() => {
    const getPieChartData = async () => {
      const response = await fetchPieChart(month);
      setData({
        labels: Object.keys(response.data),
        datasets: [
          {
            label: "Number of Items",
            data: Object.values(response.data),
            backgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#FF6347",
              "#36A2D2",
            ],
          },
        ],
      });
    };
    getPieChartData();
  }, [month]);

  return (
    <div>
      <h3>Pie Chart for {month}</h3>
      <Pie data={data} />
    </div>
  );
};

export default PieChart;
