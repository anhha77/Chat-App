import { styled } from "@mui/material/styles";
import { Avatar, Box, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import useAuth from "../../hooks/useAuth";
import ActionButton from "../friend/ActionButton";
import FriendStatus from "../friend/FriendStatus";
import { useEffect } from "react";

const RootStyle = styled("div")(({ theme }) => ({
  "&:before": {
    backdropFilter: `blur(1px)`,
    backgroundColor: alpha(theme.palette.primary.dark, 0.7),
    top: 0,
    zIndex: 9,
    content: "''",
    width: "100%",
    height: "100%",
    position: "absolute",
  },
}));

const InfoStyle = styled("div")(({ theme }) => ({
  left: 0,
  right: 0,
  zIndex: 99,
  position: "absolute",
  marginTop: theme.spacing(5),
  [theme.breakpoints.up("md")]: {
    right: "auto",
    display: "flex",
    alignItems: "center",
    left: theme.spacing(3),
    bottom: theme.spacing(3),
  },
  [theme.breakpoints.down("md")]: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
}));

function ProfileCover({ profile }) {
  const { user } = useAuth();
  const currentUserId = user._id;
  const {
    _id: targetUserId,
    name,
    jobTitle,
    coverUrl,
    avatarUrl,
    friendship,
  } = profile;

  const handleError = (e) => {
    const imgIndex = Math.floor(Math.random() * 5);
    e.target.src = `/covers/cover${imgIndex}.jpg`;
    e.target.onError = null;
  };

  const friendStatus = (
    <FriendStatus
      sx={{ mt: 1 }}
      currentUserId={currentUserId}
      targetUserId={targetUserId}
      friendship={friendship}
    />
  );

  return (
    <RootStyle>
      <InfoStyle>
        <Avatar
          src={avatarUrl}
          alt={name}
          sx={{
            borderWidth: 2,
            borderStyle: "solid",
            borderColor: "common.white",
            width: { xs: 80, md: 128 },
            height: { xs: 80, md: 128 },
          }}
        />
        <Box
          sx={{
            ml: { md: 3 },
            mt: { xs: 1, md: 0 },
            color: "common.white",
            textAlign: { xs: "center", md: "left" },
          }}
        >
          <Typography variant="h5">{name}</Typography>
          <Typography sx={{ opacity: 0.72 }}>{jobTitle}</Typography>
          {friendship ? (
            friendStatus
          ) : (
            <ActionButton
              sx={{ mt: 1 }}
              currentUserId={currentUserId}
              targetUserId={targetUserId}
              friendship={friendship}
            />
          )}
        </Box>
      </InfoStyle>
      <Box sx={{ overflow: "hidden" }}>
        <img
          src={coverUrl}
          alt="profile cover"
          width="100%"
          height="100%"
          onError={handleError}
        />
      </Box>
    </RootStyle>
  );
}

export default ProfileCover;
