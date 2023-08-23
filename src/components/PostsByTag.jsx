import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../axios'; 
import { Post } from './Post/Post';

export const PostsByTag = () => {
  const { tag } = useParams();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPostsByTag = async () => {
      try {
        const response = await axios.get(`/posts/byTags?tags=${tag}`); 
        setPosts(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setError('Failed to fetch posts by tag.');
        setIsLoading(false);
      }
    };

    fetchPostsByTag();
  }, [tag]);

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <ul>
              {posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((post) => (
            <Post
              mt={{marginTop: 65}}
              key={post._id}
              id={post._id}
              title={post.title}
                  imageUrl={post.imageUrl ? `${process.env.REACT_APP_API_URL}${post.imageUrl}` : ''}
              user={post.user}
              createdAt={new Date(post.createdAt).toLocaleString()}
              viewsCount={post.viewsCount}
              commentsCount={post.commentsCount}
              tags={post.tags}
            />
          ))}
        </ul>
      )}
    </div>
  );
};
