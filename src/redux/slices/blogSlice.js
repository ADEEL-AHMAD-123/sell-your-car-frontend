// src/redux/slices/blogSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { createApiAsyncThunk } from "../../utils/apiHelper";

// API Thunks
export const getAllBlogs = createApiAsyncThunk({
  name: "getAllBlogs",
  method: "GET",
  url: "/api/blogs",
  typePrefix: "blogs",
});
export const getBlogBySlug = createApiAsyncThunk({
  name: "getBlogBySlug",
  method: "GET",
  url: (rest) => `/api/blogs/${rest.slug}`,
  typePrefix: "blogs",
});

export const createBlogPost = createApiAsyncThunk({
  name: "createBlogPost",
  method: "POST",
  url: "/api/blogs",
  typePrefix: "blogs",
  prepareHeaders: true,
});
export const updateBlogPost = createApiAsyncThunk({
  name: "updateBlogPost",
  method: "PUT",
  url: (rest) => `/api/blogs/${rest.id}`,
  typePrefix: "blogs",
  prepareHeaders: true,
});
export const deleteBlogPost = createApiAsyncThunk({
  name: "deleteBlogPost",
  method: "DELETE",
  url: (rest) => `/api/blogs/${rest.id}`,
  typePrefix: "blogs",
  prepareHeaders: true,
});

const initialState = {
  blogs: [],
  blog: null,
  isLoading: false,
  error: null,
  pagination: {}, 
};

const blogSlice = createSlice({
  name: "blogs",
  initialState,
  reducers: {
    resetBlogState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllBlogs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllBlogs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.blogs = action.payload.data.blogs;
        state.pagination = action.payload.data.pagination; // Store pagination data
      })
      .addCase(getAllBlogs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to fetch blogs.";
      })
      .addCase(getBlogBySlug.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.blog = null;
      })
      .addCase(getBlogBySlug.fulfilled, (state, action) => {
        state.isLoading = false;
        state.blog = action.payload.data.blog;
      })
      .addCase(getBlogBySlug.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Blog not found.";
      })
      .addCase(createBlogPost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createBlogPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.blogs.push(action.payload.data.blog);
      })
      .addCase(createBlogPost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Blog creation failed.";
      })
      .addCase(updateBlogPost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateBlogPost.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedBlog = action.payload.data.blog;
        state.blogs = state.blogs.map((blog) =>
          blog._id === updatedBlog._id ? updatedBlog : blog
        );
        if (state.blog && state.blog._id === updatedBlog._id) {
          state.blog = updatedBlog;
        }
      })
      .addCase(updateBlogPost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Blog update failed.";
      })
      .addCase(deleteBlogPost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteBlogPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.blogs = state.blogs.filter(
          (blog) => blog._id !== action.meta.arg.id
        );
      })
      .addCase(deleteBlogPost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Blog deletion failed.";
      });
  },
});

export const { resetBlogState } = blogSlice.actions;
export default blogSlice.reducer;