
import AuthForm from '../../components/AuthForm/AuthForm';
import { useNavigate } from 'react-router-dom';

// Styles
import styles from './auth.module.css';

import * as LS from '../../utils/LocalStorage'; // Local Storage utils


const AuthPage = () => {
  const navigate = useNavigate();

  const username = LS.getUsername();

  if (username) {
    navigate('/');
  }

  return (
    <div className={styles.authPage}>
      <AuthForm />
    </div>
  );
};

export default AuthPage;
