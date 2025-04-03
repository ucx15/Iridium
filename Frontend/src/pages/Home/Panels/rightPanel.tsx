
// import React from 'react'


// styles
import defaultStyles from './panel.module.css'
import styles from './rightPanel.module.css'

const RightPanel = () => {

	return (

		<div className={[defaultStyles.panel, styles.rightPanel].join(' ')}>
			Right Panel
		</div>

	)
}

export default RightPanel