import { IconButton, Stack, Typography } from "@mui/material";
import React from "react";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import { useDispatch } from "react-redux";
import { createReaction } from "./postSlice";

function PostReaction({ post }) {
  const dispatch = useDispatch();

  const handleClick = (postId, emoji) => {
    dispatch(createReaction({ postId, emoji }));
  };

  return (
    <Stack direction="row" alignItems="center">
      <IconButton onClick={() => handleClick(post._id, "like")}>
        <ThumbUpAltIcon sx={{ fontSize: 24, color: "primary.main" }} />
      </IconButton>
      <Typography variant="h6" mr={1}>
        {post?.reactions?.like}
      </Typography>

      <IconButton onClick={() => handleClick(post._id, "dislike")}>
        <ThumbDownAltIcon sx={{ fontSize: 24, color: "error.main" }} />
      </IconButton>
      <Typography variant="h6" mr={1}>
        {post?.reactions?.dislike}
      </Typography>
    </Stack>
  );
}

export default PostReaction;
