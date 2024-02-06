import {
  Avatar,
  Card,
  CardHeader,
  IconButton,
  Link,
  Modal,
  Stack,
  Typography,
  alpha,
} from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, Link as RouterLink } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import LoadingScreen from "../components/LoadingScreen";
import { fDate } from "../utils/formatTime";
import { FormProvider, FTextField } from "./form";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { LoadingButton } from "@mui/lab";
import { updateComment } from "../features/comment/commentSlice";

const contentSchema = Yup.object().shape({
  comment: Yup.string().required("Comment field can not be empty"),
});

const styledCard = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
};

function ModalUpdateComment() {
  const navigate = useNavigate();
  const params = useParams();
  const commentId = params.id;
  const dispatch = useDispatch();
  const comment = useSelector((state) => state.comment.commentsById[commentId]);
  const isLoading = useSelector((state) => state.comment.isLoading);
  const defaultValues = {
    comment: comment?.content || "",
  };
  const methods = useForm({
    defaultValues,
    resolver: yupResolver(contentSchema),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = (data) => {
    if (comment) {
      const { post } = comment;
      const content = data.comment;
      dispatch(updateComment({ commentId, postId: post, content })).then(() =>
        navigate(-1)
      );
    }
  };
  return (
    <div>
      <Modal
        open={true}
        onClose={() => navigate(-1)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {comment ? (
          <Card sx={styledCard}>
            <CardHeader
              disableTypography
              avatar={
                <Avatar
                  src={comment?.author?.avatarUrl}
                  alt={comment?.author?.name}
                />
              }
              title={
                <Link
                  variant="subtitle2"
                  color="text.primary"
                  component={RouterLink}
                  sx={{ fontWeight: 600 }}
                  to={`/user/${comment.author._id}`}
                >
                  {comment?.author?.name}
                </Link>
              }
              subheader={
                <Typography
                  variant="caption"
                  sx={{ display: "block", color: "text.secondary" }}
                >
                  {fDate(comment.updatedAt)}
                </Typography>
              }
              action={
                <IconButton onClick={() => navigate(-1)}>
                  <CloseIcon />
                </IconButton>
              }
            />

            <Stack sx={{ p: 3 }}>
              <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <Stack alignItems="flex-end" spacing={2}>
                  <FTextField
                    name="comment"
                    multiline
                    fullWidth
                    rows={4}
                    sx={{
                      "& fieldset": {
                        borderWidth: "1px !important",
                        borderColor: alpha("#919EAB", 0.32),
                      },
                    }}
                  />
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    size="small"
                    loading={isSubmitting || isLoading}
                  >
                    Update
                  </LoadingButton>
                </Stack>
              </FormProvider>
            </Stack>
          </Card>
        ) : (
          <LoadingScreen />
        )}
      </Modal>
    </div>
  );
}

export default ModalUpdateComment;
