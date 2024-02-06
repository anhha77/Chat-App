import React from "react";
import { FormProvider, FTextField } from "../../components/form";
import { useForm } from "react-hook-form";

import { Avatar, IconButton, Stack } from "@mui/material";
import useAuth from "../../hooks/useAuth";
import SendIcon from "@mui/icons-material/Send";
import { useDispatch } from "react-redux";
import { createComment } from "./commentSlice";

const defaultValues = {
  comment: "",
};

function CommentForm({ postId }) {
  const { user } = useAuth();

  const methods = useForm({
    defaultValues,
  });
  const { handleSubmit, reset } = methods;

  const dispatch = useDispatch();

  const onSubmit = (data) => {
    const { comment } = data;
    if (comment) {
      dispatch(createComment({ content: comment, postId })).then(() => reset());
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack direction="row" alignItems="center">
        <Avatar src={user.avatarUrl} alt={user.name} />
        <FTextField
          fullWidth
          name="comment"
          size="small"
          placeholder="Write a comment..."
          sx={{
            ml: 2,
            mr: 1,
            "& fieldset": {
              borderWidth: "1 px !important",
              borderColor: (theme) =>
                `${theme.palette.grey[500_32]} !important`,
            },
          }}
        />
        <IconButton type="submit">
          <SendIcon sx={{ fontSize: 30 }} />
        </IconButton>
      </Stack>
    </FormProvider>
  );
}

export default CommentForm;
