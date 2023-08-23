import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Container from '@mui/material/Container';

import { Header, TagsBlock, PostsByTag } from './components';
import { Home, FullPost, Registration, AddPost, Login } from './pages';
import { useEffect } from 'react';
import { fetchAuthMe, selectIsAuth } from './redux/slices/auth';

function App() {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);

  useEffect(() => {
    dispatch(fetchAuthMe());
  }, [dispatch]);

  return (
    <>
      <Header />
      <Container maxWidth="lg">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/posts/:id' element={<FullPost isAuth={isAuth} />} />
          <Route path='/posts/:id/edit' element={<AddPost />} />
          <Route path='/add-post' element={isAuth ? <AddPost /> : <Navigate to="/login" replace />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Registration />} />
          <Route path='*' element={<Navigate to="/" replace />} />
          <Route path="/tags" element={<TagsBlock />} />
          <Route path="/tags/:tag" element={<PostsByTag />} /> 
        </Routes>
      </Container>
    </>
  );
}

export default App;
