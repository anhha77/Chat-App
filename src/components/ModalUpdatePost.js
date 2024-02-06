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
import React, { useCallback } from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import CloseIcon from "@mui/icons-material/Close";
import LoadingScreen from "../components/LoadingScreen";
import { fDate } from "../utils/formatTime";
import { FormProvider, FTextField } from "./form";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import FUpdateImage from "./form/FUpdateImage";
import { fData } from "../utils/numeralFormat";
import { updatePost } from "../features/post/postSlice";
import useAuth from "../hooks/useAuth";

const contentSchema = Yup.object().shape({
  content: Yup.string().required("Post content field can not be empty"),
});

const styledCard = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", md: "800px" },
};

function ModalUpdatePost() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const params = useParams();
  const postId = params.id;
  const dispatch = useDispatch();
  const post = useSelector((state) => state.post.postsById[postId]);
  const isLoadingUpdate = useSelector((state) => state.post.isLoadingUpdate);
  const defaultValues = {
    content: post?.content || "",
    image: post?.image || "",
  };

  const methods = useForm({
    defaultValues,
    resolver: yupResolver(contentSchema),
  });

  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = (data) => {
    if (post) {
      dispatch(
        updatePost({
          postId,
          content: data.content,
          image: data.image,
          userId: user._id,
        })
      ).then(() => navigate(-1));
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          "image",
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );

  return (
    <div>
      <Modal
        open={true}
        onClose={() => navigate(-1)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {post ? (
          <Card sx={styledCard}>
            <CardHeader
              disableTypography
              avatar={
                <Avatar
                  src={post?.author?.avatarUrl}
                  alt={post?.author?.name}
                />
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
                  {fDate(post.updatedAt)}
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
                    name="content"
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

                  <FUpdateImage
                    name="image"
                    accept="image/*"
                    maxSize={3145728}
                    onDrop={handleDrop}
                    helperText={
                      <Typography
                        variant="caption"
                        sx={{
                          mt: 2,
                          mx: "auto",
                          display: "block",
                          textAlign: "center",
                          color: "text.secondary",
                        }}
                      >
                        Allowed *.jpeg, *.jpg, *.png, *.gif
                        <br /> max size of {fData(3145728)}
                      </Typography>
                    }
                  />

                  <LoadingButton
                    type="submit"
                    variant="contained"
                    size="small"
                    loading={isSubmitting || isLoadingUpdate}
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

export default ModalUpdatePost;
