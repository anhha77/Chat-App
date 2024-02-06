import React from "react";
import {
  Box,
  Link,
  Card,
  Stack,
  Avatar,
  Typography,
  CardHeader,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { fDate } from "../../utils/formatTime";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import PostReaction from "./PostReaction";
import CommentForm from "../comment/CommentForm";
import CommentList from "../comment/CommentList";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import useAuth from "../../hooks/useAuth";
import { deletePost } from "./postSlice";

function PostCard({ post, userId }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const dispatch = useDispatch();
  const { user } = useAuth();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (event) => {
    setAnchorEl(null);
  };

  const windowPopup = (action) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#54D62C",
      cancelButtonColor: "#d33",
      confirmButtonText: action === "delete" ? "Delete" : "Update",
    }).then((result) => {
      if (result.isConfirmed) {
        if (action === "delete") {
          console.log("1");
          dispatch(deletePost({ postId: post._id, userId }));
        }
      }
    });
  };

  const renderMenu = (
    <Menu
      d="menu-appbar"
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>
        <Box
          flexGrow={1}
          sx={{ color: "text.secondary" }}
          onClick={windowPopup}
        >
          Update Post
        </Box>
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>
        <Box
          flexGrow={1}
          sx={{ color: "text.secondary" }}
          onClick={() => windowPopup("delete")}
        >
          Delete Post
        </Box>
      </MenuItem>
    </Menu>
  );

  return (
    <Card>
      <CardHeader
        disableTypography
        avatar={
          <Avatar src={post?.author?.avatarUrl} alt={post?.author?.name} />
        }
        title={
          <Link
            variant="subtitle2"
            color="text.primary"
            component={RouterLink}
            sx={{ fontWeight: 600 }}
            to={`/user/${post.author._id}`}
          >
            {post?.author?.name}
          </Link>
        }
        subheader={
          <Typography
            variant="caption"
            sx={{ display: "block", color: "text.secondary" }}
          >
            {fDate(post.createdAt)}
          </Typography>
        }
        action={
          user._id === post.author._id ? (
            <>
              <IconButton onClick={handleMenuOpen}>
                <MoreVertIcon sx={{ fontSize: 30 }} />
              </IconButton>
              {renderMenu}
            </>
          ) : (
            ""
          )
        }
      />

      <Stack spacing={2} sx={{ p: 3 }}>
        <Typography>{post.content}</Typography>

        {post.image && (
          <Box
            sx={{
              borderRadius: 2,
              overflow: "hidden",
              height: 300,
              "& img": { objectFit: "cover", width: 1, height: 1 },
            }}
          >
            <img src={post.image} alt="post" />
          </Box>
        )}

        <PostReaction post={post} />
        <CommentList postId={post._id} />
        <CommentForm postId={post._id} />
      </Stack>
    </Card>
  );
}

export default PostCard;
