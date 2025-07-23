// src/utils/apiHelper.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const createApiAsyncThunk = ({ name, method, url, typePrefix }) =>
  createAsyncThunk(`${typePrefix}/${name}`, async (
    { data = {}, params = {} } = {},
    { rejectWithValue, getState }
  ) => {
    try {
      const token = getState().auth?.user?.token;
      const headers = {
        ...(token && { Authorization: `Bearer ${token}` }),
        "Content-Type": "application/json",
      };

      const response = await axios({
        method,
        url: `${BASE_URL}${url}`,
        data,
        params,
        headers,
        withCredentials: true,
      });
      console.log(response)
      return response.data;
     
    } catch (error) {
      const errData = {
        message:
          error?.response?.data?.message ||
          error?.message ||
          "Something went wrong",
        status: error?.response?.status || 500,
        details: error?.response?.data || null,
      };
      console.error("API Error:", errData); // Logs shaped error to console
      return rejectWithValue(errData); // Always return an object
    }
  });
