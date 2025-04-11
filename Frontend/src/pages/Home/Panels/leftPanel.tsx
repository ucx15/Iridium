
import React from 'react'
import { useNavigate } from 'react-router-dom'


// styles
import defaultStyles from './panel.module.css'
import styles from './leftPanel.module.css'

// utils
import * as LS from '../../../utils/LocalStorage.js';


const LeftPanel = () => {

	const navigate = useNavigate();
	const username = LS.getUsername();

	const handleLogout = () => {
		LS.clear();
		navigate('/auth');
	}

	return (

		<div className={[defaultStyles.panel, styles.leftPanel].join(' ')}>

			<header>
				<p onClick={() => navigate(`/u/${username}`)} style={{ cursor: 'pointer' }}>{username}</p>
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