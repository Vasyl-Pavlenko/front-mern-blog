import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import styles from './Login.module.scss';
import { fetchRegister, selectIsAuth } from '../../redux/slices/auth';

const theme = createTheme({
  shadows: ['none', '0px 1px 3px 0px rgba(0,0,0,0.12)']
});

export const Registration = () => {
  const [error, setError] = useState('');
  const isAuth = useSelector(selectIsAuth);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
    },
    mode: 'onBlur',
  });

  const onSubmit = async (values) => {
    const data = await dispatch(fetchRegister(values));

    if (!data.payload) {
      setError('Registration failed');
    }

    if ('token' in data.payload) {
      window.localStorage.setItem('token', data.payload.token);
    }
  };

  if (isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <ThemeProvider theme={theme}>
      <Paper
        elevation={1}
        classes={{ root: styles.root }}
      >
        <Typography
          classes={{ root: styles.title }}
          variant="h5"
        >
          Creating new acount
        </Typography>

        {error && (
          <Typography
            variant="body2"
            color="error"
            align="center"
            style={{ marginBottom: 10 }}
          >
            {error}
          </Typography>
        )}

        <div className={styles.avatar}>
          <Avatar sx={{ width: 100, height: 100 }} />
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            error={Boolean(errors.fullName?.message)}
            helperText={errors.fullName?.message}
            type='text'
            {...register('fullName', { required: 'Enter full name at least 3 characters' })}
            className={styles.field}
            label="Full name"
            fullWidth
          />

          <TextField
            error={Boolean(errors.email?.message)}
            helperText={errors.email?.message}
            type="email"
            {...register('email', { required: 'Enter email' })}
            className={styles.field}
            label="E-Mail"
            fullWidth
          />

          <TextField
            error={Boolean(errors.password?.message)}
            helperText={errors.password?.message}
            type="password"
            {...register('password', { required: 'Enter password at least 5 characters' })}
            className={styles.field}
            label="Password"
            fullWidth
          />

          <Button
            disabled={!isValid}
            type="submit"
            size="large"
            variant="contained"
            fullWidth
          >
            Sign in
          </Button>
        </form>
      </Paper>
    </ThemeProvider>
  );
};