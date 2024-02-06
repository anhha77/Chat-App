import { Button, Stack } from "@mui/material";
import React from "react";
import { useDispatch } from "react-redux";
import {
  acceptRequest,
  cancelRequest,
  declineRequest,
  unFriend,
  sendFriendRequest,
} from "./friendSlice";

function ActionButton({ currentUserId, targetUserId, friendship, type, sx }) {
  const dispatch = useDispatch();

  if (currentUserId === targetUserId) return null;

  const btnSendRequest = (
    <Button
      sx={{ fontSize: "0.6rem", ...sx }}
      size="small"
      variant="contained"
      onClick={() => dispatch(sendFriendRequest({ targetUserId }))}
    >
      Send Request
    </Button>
  );

  if (!friendship) return btnSendRequest;

  const btnUnfriend = (
    <Button
      sx={{ fontSize: "0.6rem", ...sx }}
      size="small"
      variant="contained"
      color="error"
      onClick={() => dispatch(unFriend({ targetUserId, type }))}
    >
      Unfriend
    </Button>
  );
  const btnResend = (
    <Button
      sx={{ fontSize: "0.6rem", ...sx }}
      size="small"
      variant="contained"
      onClick={() => dispatch(sendFriendRequest({ targetUserId }))}
    >
      {friendship.from === currentUserId ? "Resend" : "Send"} Request
    </Button>
  );
  const btnCancelRequest = (
    <Button
      sx={{ fontSize: "0.6rem", ...sx }}
      size="small"
      variant="contained"
      color="error"
      onClick={() => dispatch(cancelRequest({ targetUserId }))}
    >
      Cancel Request
    </Button>
  );
  const btnGroupReact = (
    <Stack direction="row" spacing={1}>
      <Button
        sx={{ fontSize: "0.6rem", ...sx }}
        size="small"
        variant="contained"
        color="success"
        onClick={() => dispatch(acceptRequest({ targetUserId, type }))}
      >
        Accept
      </Button>
      <Button
        size="small"
        variant="outlined"
        color="error"
        onClick={() => dispatch(declineRequest({ targetUserId, type }))}
      >
        Decline
      </Button>
    </Stack>
  );

  if (friendship.status === "accepted") {
    return btnUnfriend;
  }

  if (friendship.status === "declined") {
    return btnResend;
  }

  if (friendship.status === "pending") {
    const { from, to } = friendship;
    if (from === currentUserId && to === targetUserId) {
      return btnCancelRequest;
    } else if (from === targetUserId && to === currentUserId) {
      return btnGroupReact;
    }
  }

  return btnSendRequest;
}

export default ActionButton;
