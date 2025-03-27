
import React from 'react'
import { useNavigate } from 'react-router-dom'


// styles
import defaultStyles from './panel.module.css'
import styles from './middlePanel.module.css'

const MiddlePanel = () => {

	const navigate = useNavigate();
	const username = localStorage.getItem('username');

	// redirect to auth page if not logged in
	React.useEffect(() => {
		if (!username) {
			navigate('/auth');
		}
	}
		, [navigate, username]);


	return (

		<div className={[defaultStyles.panel, styles.middlePanel].join(' ')}>
			Posts go Here
		</div>

	)
}

export default MiddlePanel
