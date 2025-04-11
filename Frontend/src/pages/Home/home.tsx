import React from 'react';
import { useNavigate } from 'react-router-dom';

// Components
import LeftPanel from './Panels/leftPanel';  // Custom Component
import MiddlePanel from './Panels/middlePanel';  // Custom Component
import RightPanel from './Panels/rightPanel';  // Custom Component

// Styles
import styles from './home.module.css';  // CSS Modules (scoped styles)

// Utils
import * as LS from '../../utils/LocalStorage';


const HomePage = () => {
  const navigate = useNavigate();

  const username = LS.getUsername();
  React.useEffect(() => {
    if (!username || !LS.getAccessToken() ) {
      navigate('/auth');
    }
  }
    , [navigate, username]);


  return (
    <div className={styles.homePage}>

      < LeftPanel />
      < MiddlePanel />
      < RightPanel />

    </div>
  )
}

export default HomePage
