import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiService from "../../app/apiService";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const initialState = {
  isLoading: false,
  error: null,
  commentsById: {},
  commentsByPost: {},
  currentPageByPost: {},
  totalCommentsByPost: {},
};

export const createComment = createAsyncThunk(
  "comment/createComment",
  async ({ content, postId }, thunkAPI) => {
    try {
      const response = await apiService.post("/comments", { content, postId });
      thunkAPI.dispatch(getComments({ postId, page: 1 }));
      return response.data.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getComments = createAsyncThunk(
  "comment/getComments",
  async ({ postId, page }) => {
    try {
      const params = { page, limit: 2 };
      const response = await apiService.get(`/posts/${postId}/comments`, {
        params,
      });
      return { ...response.data.data, postId, page };
    } catch (error) {
      console.log(error);
    }
  }
);

export const createReaction = createAsyncThunk(
  "comment/createReaction",
  async ({ commentId, emoji }) => {
    try {
      const response = await apiService.post("/reactions", {
        targetType: "Comment",
        targetId: commentId,
        emoji,
      });
      return { ...response.data, commentId };
    } catch (error) {
      console.log(error);
    }
  }
);

export const deleteComment = createAsyncThunk(
  "comment/deleteComment",
  async ({ commentId, postId }, thunkAPI) => {
    try {
      await apiService.delete(`comments/${commentId}`);
      thunkAPI.dispatch(getComments({ postId, page: 1 }));
      return commentId;
    } catch (error) {
      console.log(error);
    }
  }
);

export const updateComment = createAsyncThunk(
  "comment/updateComment",
  async ({ commentId, postId, content }, thunkAPI) => {
    try {
      const response = await apiService.put(`/comments/${commentId}`, {
        content,
      });
      thunkAPI.dispatch(getComments({ postId, page: 1 }));
      return { ...response.data.data };
    } catch (error) {}
  }
);

const slice = createSlice({
  name: "comment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createComment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(createComment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });

    builder
      .addCase(getComments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getComments.fulfilled, (state, action) => {
        state.isLoading = false;
        const { postId, comments, count, page } = action.payload;
        comments.forEach(
          (comment) => (state.commentsById[comment._id] = comment)
        );
        state.commentsByPost[postId] = comments.map((comment) => comment._id);
        state.totalCommentsByPost[postId] = count;
        state.currentPageByPost[postId] = page;
      })
      .addCase(getComments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });

    builder
      .addCase(createReaction.pending, (state) => {})
      .addCase(createReaction.fulfilled, (state, action) => {
        const { data, commentId } = action.payload;
        state.commentsById[commentId].reactions = data;
      })
      .addCase(createReaction.rejected, (state, action) => {
        state.error = action.error.message;
      });

    builder
      .addCase(deleteComment.pending, (state) => {})
      .addCase(deleteComment.fulfilled, (state) => {
        Swal.fire({
          title: "Update Successfully",
          icon: "success",
          confirmButtonColor: "#54D62C",
        });
      })
      .addCase(deleteComment.rejected, (state, action) => {
        Swal.fire({
          title: "Error",
          text: action.error.message,
          icon: "error",
          confirmButtonColor: "#54D62C",
        });
      });

    builder
      .addCase(updateComment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        state.isLoading = false;
        toast.success("Update Successfully");
      })
      .addCase(updateComment.rejected, (state, action) => {
        state.isLoading = false;
        toast.error = action.error.message;
      });
  },
});

export default slice.reducer;
