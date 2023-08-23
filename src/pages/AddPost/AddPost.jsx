import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, Navigate, useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';

import 'easymde/dist/easymde.min.css';
import { selectIsAuth } from '../../redux/slices/auth';
import axios from '../../axios';
import styles from './AddPost.module.scss';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  shadows: ['none', '0px 1px 3px 0px rgba(0,0,0,0.12)']
});

export const AddPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isAuth = useSelector(selectIsAuth);
  const [isLoading, setLoading] = useState(false);
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const inputFileRef = useRef(null);

  const isEditing = Boolean(id);

  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append('image', file);
      const { data } = await axios.post('/upload', formData);
      setImageUrl(data.url);
    } catch (err) {
      console.error(err);
      alert('Error uploading file!');
    }
  };

  const onClickRemoveImage = () => {
    setImageUrl('');
  };

  const onChange = useCallback((value) => {
    setText(value);
  }, []);

  const onSubmit = async () => {
    try {
      setLoading(true);

      const fields = {
        title,
        imageUrl,
        tags,
        text,
      };

      const { data } = isEditing
        ? await axios.patch(`/posts/${id}`, fields)
        : await axios.post('/posts', fields);

      const _id = isEditing ? id : data._id;

      navigate(`/posts/${_id}`);
    } catch (err) {
      console.error(err);
      alert('Error creating/updating article!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      axios
        .get(`/posts/${id}`)
        .then(({ data }) => {
          setTitle(data.title);
          setText(data.text);
          setImageUrl(data.imageUrl);
          setTags(data.tags.join(','));
        })
        .catch((err) => {
          console.error(err);
          alert('Error fetching article!');
        });
    }
  }, [id]);

  const options = useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Enter text...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    [],
  );

  if (!window.localStorage.getItem('token') && !isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <ThemeProvider theme={theme}>
      <Paper
        elevation={1}
        style={{ padding: 30 }}
      >
        {isLoading ? <div className={styles.loader} /> : (
          <>
            <Button
              style={{marginTop: 50}}
              onClick={() => inputFileRef.current.click()}
              variant="outlined"
              size="large"
            >
              Load preview
            </Button>

            <input
              ref={inputFileRef}
              type="file"
              onChange={handleChangeFile}
              hidden
            />

            {imageUrl && (
              <>
                <Button
                  style={{ marginTop: 50 }}
                  variant="contained"
                  color="error"
                  onClick={onClickRemoveImage}
                >
                  Delete
                </Button>

                <img
                  className={styles.image}
                  src={`${process.env.REACT_APP_API_URL}${imageUrl}`}
                  alt="Uploaded"
                />
              </>
            )}

            <br />

            <br />

            <TextField
              classes={{ root: styles.title }}
              variant="standard"
              placeholder="Article title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
            />

            <TextField
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              classes={{ root: styles.tags }}
              variant="standard"
              placeholder="Tags"
              fullWidth
            />

            <SimpleMDE
              className={styles.editor}
              value={text}
              onChange={onChange}
              options={options}
            />

            <div className={styles.buttons}>
              <Button
                onClick={onSubmit}
                size="large"
                variant="contained"
              >
                {isEditing ? 'Save' : 'Publish'}
              </Button>

              <Link to="/">
                <Button size="large">
                  Cancel
                </Button>
              </Link>
            </div>
          </>
        )}
      </Paper>
    </ThemeProvider>
  );
};
