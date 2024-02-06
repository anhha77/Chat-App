import React from "react";
import {
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { fDate } from "../../utils/formatTime";
import CommentReaction from "./CommentReaction";
import useAuth from "../../hooks/useAuth";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { deleteComment } from "./commentSlice";
import { Link as RouterLink, useLocation } from "react-router-dom";

function CommentCard({ comment, postId }) {
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const location = useLocation();

  const dispatch = useDispatch();

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
          dispatch(deleteComment({ commentId: comment._id, postId }));
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
          sx={{ color: "text.secondary", textDecoration: "none" }}
          component={RouterLink}
          to={`/commentUpdate/${comment._id}`}
          state={{ background: location }}
        >
          Update Comment
        </Box>
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>
        <Box
          flexGrow={1}
          sx={{ color: "text.secondary" }}
          onClick={() => windowPopup("delete")}
        >
          Delete Comment
        </Box>
      </MenuItem>
    </Menu>
  );

  return (
    <Stack direction="row" spacing={2}>
      <Avatar alt={comment.author?.name} src={comment.author?.avatarUrl} />
      <Paper sx={{ p: 1.5, flexGrow: 1, bgcolor: "background.neutral" }}>
        <Stack
          direction="row"
          alignItems={{ sm: "center" }}
          justifyContent="space-between"
          sx={{ mb: 0.5 }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }} pl={2}>
            {comment.author?.name}
          </Typography>
          <Typography variant="caption" sx={{ color: "text.disabled" }}>
            {fDate(comment.createdAt)}
          </Typography>
        </Stack>
        <Typography variant="body2" sx={{ color: "text.secondary" }} pl={2}>
          {comment.content}
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent:
              user._id === comment.author._id ? "space-between" : "flex-end",
          }}
        >
          {user._id === comment.author._id ? (
            <IconButton onClick={handleMenuOpen}>
              <MoreVertIcon />
            </IconButton>
          ) : (
            ""
          )}
          {renderMenu}

          <CommentReaction comment={comment} />
        </Box>
      </Paper>
    </Stack>
  );
}

export default CommentCard;
