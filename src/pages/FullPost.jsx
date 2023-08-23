import React, { useEffect, useState } from "react";
import axios from "../axios";
import ReactMarkdown from "react-markdown";
import { useParams } from "react-router-dom";

import { Post } from "../components/Post";
import { CommentsBlock } from "../components/CommentsBlock";

export const FullPost = ({ isAuth }) => {
  const [data, setData] = useState();
  const [comments, setComments] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isCommentsLoading, setIsCommentsLoading] = useState(true);
  const { id } = useParams();

  const handleCommentAdded = (newComment) => {
    setComments([...comments, newComment]);
  };

  useEffect(() => {
    axios
      .get(`/posts/${id}`)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.warn(err);
        alert("Error getting article");
      });
  }, [id]);

  useEffect(() => {
    axios
      .get(`/comments?post=${id}`)
      .then((res) => {
        setComments(res.data);
        setIsCommentsLoading(false);
      })
      .catch((err) => {
        console.warn(err);
        alert("Error getting comments");
      });
  }, [id, comments]);

  if (isLoading) {
    return <Post isLoading={isLoading} isFullPost />;
  }

  const filteredComments = comments.filter((comment) => comment.post === data._id);

  return (
    <>
      <Post
        mt={{ marginTop: 65 }}
        id={data._id}
        title={data.title}
        imageUrl={data.imageUrl ? `http://localhost:4444${data.imageUrl}` : ""}
        user={data.user}
        createdAt={new Date(data.createdAt).toLocaleDateString()}
        viewsCount={data.viewsCount}
        commentsCount={data.commentsCount}
        tags={data.tags}
        isFullPost
      >
        <ReactMarkdown children={data.text} />
      </Post>

      <CommentsBlock
        post={data._id}
        isCommentsLoading={isCommentsLoading}
        items={filteredComments}
        onCommentAdded={handleCommentAdded}
        isAuth={isAuth}
      />
    </>
  );
};