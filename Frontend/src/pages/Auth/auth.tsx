
import AuthForm from '../../components/AuthForm/AuthForm';
import { useNavigate } from 'react-router-dom';

// Styles
import styles from './auth.module.css';  // CSS Modules (scoped styles)


const Auth = () => {
  const navigate = useNavigate();

  const username = localStorage.getItem('username');
  if (username) {
    navigate('/');
  }

  return (
    <div className={styles.authPage}>
      <AuthForm />
    </div>
  );
};

export default Auth;
