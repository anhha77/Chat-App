import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../app/apiService";
import { cloudinaryUpload } from "../../utils/cloudinary";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const initialState = {
  isLoadingPostBtn: false,
  isLoadingLoadMoreBtn: false,
  error: null,
  postsById: {},
  currentPagePosts: [],
};

export const createPost = createAsyncThunk(
  "post/createPost",
  async ({ content, image }) => {
    try {
      const imageUrl = await cloudinaryUpload(image);
      const response = await apiService.post("/posts", {
        content,
        image: imageUrl,
      });
      console.log(response.data);
      return response.data.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getPosts = createAsyncThunk(
  "post/getPosts",
  async ({ userId, page, limit = 2 }) => {
    try {
      const params = { page, limit };
      const response = await apiService.get(`/posts/user/${userId}`, {
        params,
      });
      // console.log(response.data);
      return { ...response.data.data, page };
    } catch (error) {
      console.log(error);
    }
  }
);

export const createReaction = createAsyncThunk(
  "post/createReaction",
  async ({ postId, emoji }) => {
    try {
      const response = await apiService.post(`/reactions`, {
        targetType: "Post",
        targetId: postId,
        emoji,
      });
      return { ...response.data, postId };
    } catch (error) {
      console.log(error);
    }
  }
);

export const deletePost = createAsyncThunk(
  "post/deletePost",
  async ({ postId, userId }, thunkAPI) => {
    try {
      console.log("hi");
      await apiService.delete(`/posts/${postId}`);
      thunkAPI.dispatch(getPosts({ userId, page: 1, limit: 2 }));
    } catch (error) {
      console.log(error);
    }
  }
);

const slice = createSlice({
  name: "post",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createPost.pending, (state) => {
        state.isLoadingPostBtn = true;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.isLoadingPostBtn = false;
        state.error = null;
        const newPost = action.payload;
        if (state.currentPagePosts.length % 2 === 0) {
          const removeId = state.currentPagePosts.pop();
          delete state.postsById[removeId];
        }

        state.postsById[newPost._id] = newPost;
        state.currentPagePosts.unshift(newPost._id);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.isLoadingPostBtn = false;
        state.error = action.error.message;
        toast.error(action.error.message);
      });

    builder
      .addCase(getPosts.pending, (state) => {
        state.isLoadingLoadMoreBtn = true;
      })
      .addCase(getPosts.fulfilled, (state, action) => {
        state.isLoadingLoadMoreBtn = false;
        const { posts, count, page } = action.payload;
        if (page === 1) {
          state.postsById = {};
          state.currentPagePosts = [];
        }
        posts.forEach((post) => {
          state.postsById[post._id] = post;
          if (!state.currentPagePosts.includes(post._id))
            state.currentPagePosts.push(post._id);
        });
        state.totalPosts = count;
      })
      .addCase(getPosts.rejected, (state, action) => {
        state.isLoadingLoadMoreBtn = false;
        state.error = action.error.message;
        toast.error(action.error.message);
      });

    builder
      .addCase(createReaction.pending, (state) => {})
      .addCase(createReaction.fulfilled, (state, action) => {
        const { data, postId } = action.payload;
        state.postsById[postId].reactions = data;
      })
      .addCase(createReaction.rejected, (state, action) => {
        state.error = action.error.message;
        toast.error(action.error.message);
      });

    builder
      .addCase(deletePost.pending, (state) => {})
      .addCase(deletePost.fulfilled, (state) => {
        Swal.fire({
          title: "Update Successfully",
          icon: "success",
          confirmButtonColor: "#54D62C",
        });
      })
      .addCase(deletePost.rejected, (state, action) => {
        Swal.fire({
          title: "Error",
          text: action.error.message,
          icon: "error",
          confirmButtonColor: "#54D62C",
        });
      });
  },
});

export default slice.reducer;
