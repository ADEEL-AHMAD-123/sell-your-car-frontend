import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const createApiAsyncThunk = ({ name, method, url }) =>
  createAsyncThunk(`auth/${name}`, async ({ requestData, data } = {}, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth?.token;

      const finalUrl = requestData
        ? `${BASE_URL}${url}${requestData}`
        : `${BASE_URL}${url}`;

      const headers = {
        'Content-Type': data instanceof FormData ? 'multipart/form-data' : 'application/json',
      };
      if (token) headers.Authorization = `Bearer ${token}`;

      const response = await axios({
        method,
        url: finalUrl,
        data,
        headers,
        withCredentials: true,
      });

      if (response.data?.message) toast.success(response.data.message);

      return response.data;
    } catch (err) {
      let message = 'Something went wrong.';
      let statusCode = 500;

      console.log(err)

      if (err.response) {
        statusCode = err.response.status;
        message = err.response.data?.message || 'Request failed.';
      } else if (err.request) {
        message = 'No response from server.';
      }

      toast.error(message);
      return rejectWithValue({ statusCode, message });
    }
  });
