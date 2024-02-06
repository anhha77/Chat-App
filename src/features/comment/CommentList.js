import React, { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { getComments } from "../comment/commentSlice";
import { Pagination, Stack, Typography } from "@mui/material";
import CommentCard from "./CommentCard";

function CommentList({ postId }) {
  const dispatch = useDispatch();

  const { commentsByPost, commentsById, totalComments, currentPage } =
    useSelector(
      (state) => ({
        commentsByPost: state.comment.commentsByPost[postId],
        totalComments: state.comment.totalCommentsByPost[postId],
        currentPage: state.comment.currentPageByPost[postId] || 1,
        commentsById: state.comment.commentsById,
        isLoading: state.comment.isLoading,
      }),
      shallowEqual
    );

  const totalPages = Math.ceil(totalComments / 2);

  useEffect(() => {
    dispatch(getComments({ postId, page: 1 }));
  }, [postId, dispatch]);

  // console.log(commentsByPost);

  let renderComments;

  if (commentsByPost) {
    const comments = commentsByPost.map((commentId) => commentsById[commentId]);
    renderComments = (
      <Stack spacing={1.5}>
        {comments.map((comment) => (
          <CommentCard key={comment._id} comment={comment} />
        ))}
      </Stack>
    );
  }

  return (
    <Stack spacing={1.5}>
      <Stack direction="row" justifyContent="space-between">
        <Typography>
          {totalComments > 1
            ? `${totalComments} comments`
            : totalComments === 1
            ? `${totalComments} comment`
            : "No comment"}
        </Typography>
        {totalComments > 2 && (
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(event, page) => dispatch(getComments({ postId, page }))}
          />
        )}
      </Stack>
      {renderComments}
    </Stack>
  );
}

export default CommentList;
