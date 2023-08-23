import React, { useState, useEffect, useCallback } from "react";
import axios from "../../axios";
import styles from "./AddComment.module.scss";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";

export const AddComment = ({ post }) => {
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]); 

  const fetchComments = useCallback(async () => {
    try {
      const response = await axios.get(`/comments?post=${post}`);
      setComments(response.data);
    } catch (error) {
      console.error("Failed to fetch comments", error.message);
    }
  }, [post]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async () => {
    try {
      const res = await axios.post("/comments", {
        text: commentText,
        postId: post,
      });

      if (res.status === 201) {
        const newComment = res.data;

        setComments([...comments, newComment]);

        setCommentText('');
      } else {
        console.error("Failed to add comment");
      }
    } catch (error) {
      console.error("Failed to add comment", error.message);
    }
  };

  return (
    <div className={styles.root}>
      <Avatar
        classes={{ root: styles.avatar }}
      />

      <div className={styles.commentContainer}>
        <TextField
          className={styles.commentInput}
          label="Enter your comment"
          variant="outlined"
          multiline
          rows={3}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />

        <div className={styles.buttonContainer}>
          <Button
            type="submit"
            className={styles.commentButton}
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            endIcon={<SendIcon />}
          >
            Add comment
          </Button>
        </div>
      </div>
    </div>
  );
};