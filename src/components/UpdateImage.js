import styled from "@emotion/styled";
import { Box } from "@mui/material";
import { isString } from "lodash";
import React from "react";
import { useDropzone } from "react-dropzone";
import RejectionFiles from "./RejectionFiles";

const DropZoneStyle = styled("div")({
  zIndex: 0,
  width: "100%",
  height: "200px",
  outline: "none",
  display: "flex",
  overflow: "hidden",
  position: "relative",
  borderRadius: "8px",
  alignItems: "center",
  justifyContent: "center",
  "& > *": { width: "100%", height: "100%" },
  "&:hover": {
    cursor: "pointer",
    "& .placeholder": {
      zIndex: 9,
    },
  },
});

const PlaceholderStyle = styled("div")(({ theme }) => ({
  display: "flex",
  position: "absolute",
  alignItems: "center",
  flexDirection: "column",
  justifyContent: "center",
  color: "#919EAB",
  backgroundColor: "#919EAB",
  transition: theme.transitions.create("opacity", {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  "&:hover": { opacity: 0.72 },
}));

function UpdateImage({ error, file, helperText, sx, ...other }) {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    fileRejections,
  } = useDropzone({
    multiple: false,
    ...other,
  });

  return (
    <Box sx={{ width: "100%", ...sx }}>
      <DropZoneStyle
        {...getRootProps()}
        sx={{
          ...(isDragActive && { opacity: 0.72 }),
          ...((isDragReject || error) && {
            color: "error.main",
            borderColor: "error.light",
            bgcolor: "error.lighter",
          }),
          ...(file && {
            padding: "5% 0",
          }),
        }}
      >
        <input {...getInputProps()} />
        {file && (
          <Box
            sx={{
              zIndex: 8,
              overflow: "hidden",
              "& img": { objectFit: "cover", width: 1, height: 1 },
            }}
          >
            <img alt="avatar" src={isString(file) ? file : file.preview} />
          </Box>
        )}

        <PlaceholderStyle
          className="placeholder"
          sx={{
            ...(file && {
              opacity: 0,
              color: "common.white",
              bgcolor: "grey.900",
              "&:hover": { opacity: 1 },
            }),
            ...((isDragReject || error) && {
              bgcolor: "error.lighter",
            }),
          }}
        />
      </DropZoneStyle>
      {helperText && helperText}

      {fileRejections.length > 0 && (
        <RejectionFiles fileRejections={fileRejections} />
      )}
    </Box>
  );
}

export default UpdateImage;
