// src/utils/apiHelper.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const createApiAsyncThunk = ({ name, method, url, typePrefix, prepareHeaders = false }) =>
  createAsyncThunk(`${typePrefix}/${name}`, async (
    { data = {}, params = {}, ...rest } = {},  // support dynamic params like { id }
    { rejectWithValue, getState }
  ) => {
    try {
      const token = getState().auth?.user?.token;

      const headers = {
        ...(token && prepareHeaders && { Authorization: `Bearer ${token}` }),
        "Content-Type": "application/json",
      };

      // If url is a function, call it with dynamic args
      const resolvedUrl = typeof url === "function" ? url(rest) : url;

      const response = await axios({
        method,
        url: `${BASE_URL}${resolvedUrl}`,
        data,
        params,
        headers,
        withCredentials: true,
      });

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
      console.error("API Error:", errData);
      return rejectWithValue(errData);
    }
  });

