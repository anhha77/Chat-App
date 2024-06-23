import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiService from "../../app/apiService";
import { toast } from "react-toastify";
import { cloudinaryUpload } from "../../utils/cloudinary";

const initialState = {
  isLoading: false,
  error: null,
  selectedUser: null,
  updatedProfile: null,
};

export const getUser = createAsyncThunk("user/getUser", async ({ userId }) => {
  try {
    const response = await apiService.get(`/users/${userId}`);
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
});

export const updateUserProfile = createAsyncThunk(
  "user/updateUserProfile",
  async ({
    userId,
    name,
    avatarUrl,
    coverUrl,
    aboutMe,
    city,
    country,
    company,
    jobTitle,
    facebookLink,
    instagramLink,
    linkedinLink,
    twitterLink,
  }) => {
    try {
      const data = {
        userId,
        name,
        coverUrl,
        aboutMe,
        city,
        country,
        company,
        jobTitle,
        facebookLink,
        instagramLink,
        linkedinLink,
        twitterLink,
      };
      if (avatarUrl instanceof File) {
        const imageUrl = await cloudinaryUpload(avatarUrl);
        data.avatarUrl = imageUrl;
      }
      const response = await apiService.put(`/users/${userId}`, data);
      return { ...response.data.data };
    } catch (error) {
      console.log(error);
    }
  }
);

const slice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateFriendshipStatus: (state, action) => {
      state.selectedUser.friendship = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedUser = action.payload;
      })
      .addCase(getUser.rejected, (state) => {
        state.isLoading = false;
      });

    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.updatedProfile = action.payload;
        toast.success("Update Successfully");
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.error.message);
        state.error = action.error.message;
      });
  },
});

export const { updateFriendshipStatus } = slice.actions;
export default slice.reducer;
