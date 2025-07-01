
// import React from 'react'


// styles
import defaultStyles from './panel.module.css'
import styles from './rightPanel.module.css'

// components
import Search from '../../../components/Search/Search'


const RightPanel = () => {

	return (

		<div className={[defaultStyles.panel, styles.rightPanel].join(' ')}>

			<Search/>

		</div>

	)
}

export default RightPanel