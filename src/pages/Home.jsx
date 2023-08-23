import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Tabs, Tab } from '@mui/material';
import Grid from '@mui/material/Grid';

import { Post } from '../components/Post/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';
import { fetchPosts, fetchTags, fetchComments } from '../redux/slices/posts';

export const Home = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.data);
  const { posts, tags, comments } = useSelector((state) => state.posts);
  const [activeTab, setActiveTab] = useState('New');
  const [selectedTags, setSelectedTags] = useState([]);
  const { tagName } = useParams();

  const isPostsLoading = posts.status === 'loading';
  const isTagsLoading = tags.status === 'loading';
  const isCommentsLoading = comments.status === 'loading';

  useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchTags());
    dispatch(fetchComments());
  }, [dispatch]);

  useEffect(() => {
    if (tagName && !selectedTags.includes(tagName)) {
      setSelectedTags([tagName]);
    }
  }, [tagName, selectedTags]);

  const getPostsForTab = (tab, selectedTags) => {
    let filteredPosts = [...posts.items];

    if (selectedTags.length > 0) {
      filteredPosts = filteredPosts.filter((post) => selectedTags.some((tag) => post.tags.includes(tag)));
    }

    if (tab === 'New') {
      filteredPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (tab === 'Popular') {
      filteredPosts.sort((a, b) => b.viewsCount - a.viewsCount);
    }

    return filteredPosts;
  };

  const handleTagClick = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((selectedTag) => selectedTag !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const sortedComments = comments.items.slice(-5).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <>
      <Tabs
        style={{ marginBottom: 15, marginTop: 60 }}
        value={activeTab}
        onChange={(event, newValue) => setActiveTab(newValue)}
        aria-label="basic tabs example"
      >
        <Tab
          label="New"
          value="New"
        />
        <Tab
          label="Popular"
          value="Popular"
        />
      </Tabs>

      <Grid
        container
        spacing={4}
      >
        <Grid
          xs={12}
          md={8}
          item
        >
          {isPostsLoading ? (
            [...Array(5)].map((_, index) => (
              <Post
                key={index}
                isLoading={true}
              />
            ))
          ) : (
            getPostsForTab(activeTab, selectedTags).map((obj, index) => (
              <Post
                key={index}
                id={obj._id}
                title={obj.title}
                imageUrl={obj.imageUrl ? `${process.env.REACT_APP_API_URL}${obj.imageUrl}` : ''}
                user={obj.user}
                createdAt={new Date(obj.createdAt).toLocaleDateString()}
                viewsCount={obj.viewsCount}
                commentsCount={obj.commentsCount}
                tags={obj.tags}
                isEditable={userData?._id === obj.user._id}
              />
            ))
          )}
        </Grid>

        <Grid
          xs={12}
          md={4}
          item
        >
          <TagsBlock
            items={tags.items.slice(-5)}
            isLoading={isTagsLoading}
            handleTagClick={handleTagClick}
          />

          <CommentsBlock
            items={sortedComments}
            isCommentsLoading={isCommentsLoading}
          />
        </Grid>
      </Grid>
    </>
  );
};