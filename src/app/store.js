import { configureStore, combineReducers } from "@reduxjs/toolkit";
import commentReducer from "../features/comment/commentSlice";
import friendReducer from "../features/friend/friendSlice";
import postReducer from "../features/post/postSlice";
import userReudcer from "../features/user/userSlice";

const store = configureStore({
  reducer: combineReducers({
    comment: commentReducer,
    friend: friendReducer,
    post: postReducer,
    user: userReudcer,
  }),
});

export default store;
