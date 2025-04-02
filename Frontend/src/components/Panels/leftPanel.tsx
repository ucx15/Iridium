
import React from 'react'
import { useNavigate } from 'react-router-dom'


// styles
import defaultStyles from './panel.module.css'
import styles from './leftPanel.module.css'

// utils
import * as LS from '../../LocalStorage.js';
// import { refreshAccessToken } from '../../JWT';


const LeftPanel = () => {

	const navigate = useNavigate();
	const username = localStorage.getItem('username');

	// redirect to auth page if not logged in
	React.useEffect(() => {
		if (!username) {
			navigate('/auth');
		}
	}
		, [navigate, username]);


	const handleLogout = () => {
		LS.clear();
		navigate('/auth');
	}

	return (

		<div className={[defaultStyles.panel, styles.leftPanel].join(' ')}>

			<header>
				{username}
			</header>

			<nav>
				<button
				className={[styles.navButton, styles.logoutButton].join(' ')}
				onClick={handleLogout}>Logout</button >
			</nav>
		</div>

	)
}

export default LeftPanel