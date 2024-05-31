// src/services/api.js
import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const fetchTransactions = async (
  month,
  search = "",
  page = 1,
  perPage = 10
) => {
  return axios.get(`${API_URL}/transactions`, {
    params: { month, search, page, perPage },
  });
};

export const fetchStatistics = async (month) => {
  return axios.get(`${API_URL}/statistics`, { params: { month } });
};

export const fetchBarChart = async (month) => {
  return axios.get(`${API_URL}/bar-chart`, { params: { month } });
};

export const fetchPieChart = async (month) => {
  return axios.get(`${API_URL}/pie-chart`, { params: { month } });
};

export const fetchCombinedData = async (month) => {
  return axios.get(`${API_URL}/combined-data`, { params: { month } });
};
