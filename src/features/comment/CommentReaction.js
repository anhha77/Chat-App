import { IconButton, Stack, Typography } from "@mui/material";
import React from "react";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import { useDispatch } from "react-redux";
import { createReaction } from "./commentSlice";

function CommentReaction({ comment }) {
  const dispatch = useDispatch();
  const handleClick = (commentId, emoji) => {
    dispatch(createReaction({ commentId, emoji }));
  };

  return (
    <Stack direction="row" alignItems="center">
      <IconButton onClick={() => handleClick(comment._id, "like")}>
        <ThumbUpAltIcon sx={{ fontSize: 20, color: "primary.main" }} />
      </IconButton>
      <Typography variant="body2" mr={1}>
        {comment?.reactions?.like}
      </Typography>

      <IconButton onClick={() => handleClick(comment._id, "dislike")}>
        <ThumbDownAltIcon sx={{ fontSize: 20, color: "error.main" }} />
      </IconButton>
      <Typography variant="body2" mr={1}>
        {comment?.reactions?.dislike}
      </Typography>
    </Stack>
  );
}

export default CommentReaction;
