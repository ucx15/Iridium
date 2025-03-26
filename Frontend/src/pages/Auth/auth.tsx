
import AuthForm from '../../components/AuthForm/AuthForm';
import styles from './Auth.module.css'; // CSS Modules (scoped styles)
import { useNavigate } from 'react-router-dom';


const Auth = () => {
  const navigate = useNavigate();

  const username = localStorage.getItem('username');
  if ( username ) {
    navigate('/');
  }

  return (
    <div className={styles.authContainer}>

      <AuthForm />
    </div>
  );
};

export default Auth;
