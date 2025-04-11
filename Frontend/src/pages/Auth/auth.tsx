import React from 'react';

import AuthForm from '../../components/AuthForm/AuthForm';
import { useNavigate } from 'react-router-dom';

// Styles
import styles from './auth.module.css';

import * as LS from '../../utils/LocalStorage'; // Local Storage utils


const AuthPage = () => {
  const navigate = useNavigate();
  const username = LS.getUsername();

  React.useEffect(() => {
    if (username && LS.getAccessToken()) {
      navigate('/');
    }
  }
  , [navigate, username]);


  return (
    <div className={styles.authPage}>
      <AuthForm />
    </div>
  );
};

export default AuthPage;
