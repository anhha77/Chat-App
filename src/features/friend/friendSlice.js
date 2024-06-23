import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiService from "../../app/apiService";
import { toast } from "react-toastify";
import { updateFriendshipStatus } from "../user/userSlice";

const initialState = {
  isLoading: false,
  error: null,
  currentPageUsers: [],
  // currentPageFriends: [],
  // currentPageFriendRequests: [],
  // currentPageFriendRequestsSent: [],
  usersById: {},
  // friendsById: {},
  // friendRequestsById: {},
  // friendRequestsSentById: {},
  totalPages: 1,
};

export const getUsers = createAsyncThunk(
  "friend/getUsers",
  async ({ filterName, page = 1, limit = 12 }) => {
    try {
      const params = { page, limit };
      if (filterName) params.name = filterName;
      const response = await apiService.get("/users", { params });
      return response.data.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const sendFriendRequest = createAsyncThunk(
  "friend/sendFriendRequest",
  async ({ targetUserId }, { thunkAPI }) => {
    try {
      const response = await apiService.post("/friends/requests", {
        to: targetUserId,
      });
      console.log(response.data);
      thunkAPI.dispatch(updateFriendshipStatus(response.data.data));
      return { ...response.data, targetUserId };
    } catch (error) {
      console.log(error);
    }
  }
);

export const declineRequest = createAsyncThunk(
  "friend/declineRequest",
  async ({ targetUserId }, thunkAPI) => {
    try {
      const response = await apiService.put(
        `/friends/requests/${targetUserId}`,
        { status: "declined" }
      );
      thunkAPI.dispatch(getFriendRequestsIncomming({ page: 1 }));
      return { ...response.data, targetUserId };
    } catch (error) {
      console.log(error);
    }
  }
);

export const acceptRequest = createAsyncThunk(
  "friend/acceptRequest",
  async ({ targetUserId }, thunkAPI) => {
    try {
      const response = await apiService.put(
        `/friends/requests/${targetUserId}`,
        { status: "accepted" }
      );
      thunkAPI.dispatch(getFriendRequestsIncomming({ page: 1 }));
      return { ...response.data, targetUserId };
    } catch (error) {
      console.log(error);
    }
  }
);

export const cancelRequest = createAsyncThunk(
  "friend/cancelRequest",
  async ({ targetUserId }, thunkAPI) => {
    try {
      const response = await apiService.delete(
        `/friends/requests/${targetUserId}`
      );
      thunkAPI.dispatch(getFriendRequestsOutgoing({ page: 1 }));
      return { ...response.data, targetUserId };
    } catch (error) {
      console.log(error);
    }
  }
);

export const unFriend = createAsyncThunk(
  "friend/unFriend",
  async ({ targetUserId }, thunkAPI) => {
    try {
      const response = await apiService.delete(`/friends/${targetUserId}`);
      thunkAPI.dispatch(getFriends({ page: 1 }));
      return { ...response.data, targetUserId };
    } catch (error) {
      console.log(error);
    }
  }
);

export const getFriends = createAsyncThunk(
  "friend/getFriends",
  async ({ filterName, page }) => {
    try {
      const params = { page, limit: 10 };
      if (filterName) params.name = filterName;
      const response = await apiService.get("/friends", { params });
      return response.data.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getFriendRequestsIncomming = createAsyncThunk(
  "friend/getFriendRequestsIncomming",
  async ({ filterName, page }) => {
    try {
      const params = { page, limit: 10 };
      if (filterName) params.name = filterName;
      const response = await apiService.get("/friends/requests/incoming", {
        params,
      });
      return response.data.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getFriendRequestsOutgoing = createAsyncThunk(
  "friend/getFriendRequestsOutgoing",
  async ({ filterName, page }) => {
    try {
      const params = { page, limit: 10 };
      if (filterName) params.name = filterName;
      const response = await apiService.get("/friends/requests/outgoing", {
        params,
      });
      return response.data.data;
    } catch (error) {
      console.log(error);
    }
  }
);

const slice = createSlice({
  name: "friend",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        const { users, count, totalPages } = action.payload;
        state.currentPageUsers = users.map((user) => user._id);
        users.forEach((user) => (state.usersById[user._id] = user));
        state.totalUsers = count;
        state.totalPages = totalPages;
        state.isLoading = false;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });

    builder
      .addCase(sendFriendRequest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(sendFriendRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        const { data, targetUserId } = action.payload;
        state.usersById[targetUserId].friendship = data;
        toast.success("Request sent");
      })
      .addCase(sendFriendRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
        toast.error(action.error.message);
      });

    builder
      .addCase(declineRequest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(declineRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        const { data, targetUserId } = action.payload;
        state.usersById[targetUserId].friendship = data;
        toast.success("Request Declined");
      })
      .addCase(declineRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
        toast.error(action.error.message);
      });

    builder
      .addCase(acceptRequest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(acceptRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        const { data, targetUserId } = action.payload;
        state.usersById[targetUserId].friendship = data;
        toast.success("Request Accepted");
      })
      .addCase(acceptRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
        toast.error(action.error.message);
      });

    builder
      .addCase(cancelRequest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(cancelRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        const { targetUserId } = action.payload;
        state.usersById[targetUserId].friendship = null;
        toast.success("Cancel Request Success");
      })
      .addCase(cancelRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
        toast.error(action.error.message);
      });

    builder
      .addCase(unFriend.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(unFriend.fulfilled, (state, action) => {
        state.isLoading = false;
        const { targetUserId } = action.payload;
        state.usersById[targetUserId].friendship = null;
        toast.success("Unfriend Success");
      })
      .addCase(unFriend.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
        toast.error(action.error.message);
      });

    builder
      .addCase(getFriends.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFriends.fulfilled, (state, action) => {
        state.isLoading = false;
        const { users, totalPages, count } = action.payload;
        state.currentPageUsers = users.map((user) => user._id);
        users.forEach((user) => (state.usersById[user._id] = user));
        state.totalPages = totalPages;
        state.totalUsers = count;
      })
      .addCase(getFriends.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });

    builder
      .addCase(getFriendRequestsIncomming.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFriendRequestsIncomming.fulfilled, (state, action) => {
        state.isLoading = false;
        const { users, totalPages, count } = action.payload;
        state.currentPageUsers = users.map((user) => user._id);
        users.forEach((user) => (state.usersById[user._id] = user));
        state.totalPages = totalPages;
        state.totalUsers = count;
      })
      .addCase(getFriendRequestsIncomming.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });

    builder
      .addCase(getFriendRequestsOutgoing.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFriendRequestsOutgoing.fulfilled, (state, action) => {
        state.isLoading = false;
        const { users, totalPages, count } = action.payload;
        state.currentPageUsers = users.map((user) => user._id);
        users.forEach((user) => (state.usersById[user._id] = user));
        state.totalPages = totalPages;
        state.totalUsers = count;
      })
      .addCase(getFriendRequestsOutgoing.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export default slice.reducer;
