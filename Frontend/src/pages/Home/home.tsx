// import React from 'react'

// Components
import LeftPanel from './Panels/leftPanel';  // Custom Component
import MiddlePanel from './Panels/middlePanel';  // Custom Component
import RightPanel from './Panels/rightPanel';  // Custom Component

// Styles
import styles from './home.module.css';  // CSS Modules (scoped styles)


const Home = () => {
  return (
    <div className={styles.homePage}>

      < LeftPanel />
      < MiddlePanel />
      < RightPanel />

    </div>
  )
}

export default Home
