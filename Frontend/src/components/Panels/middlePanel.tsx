
import React from 'react';
import { useNavigate } from 'react-router-dom';

// components
import Post from '../../components/Post/post';

// styles
import defaultStyles from './panel.module.css';
import styles from './middlePanel.module.css';

// // utils
// import * as LS from '../../utils/localStorage';


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
			<div className={styles.posts}>
				< Post user='uc' caption='hola esta es mi uno poste!' images={['https://images.unsplash.com/photo-1742800233278-5cb49547377b']}/>
				< Post user='cu' caption='hola jo soy una hombre.'  images={['https://images.unsplash.com/photo-1741850826386-9cb8e5543c73']}/>

				< Post user='uc' caption='Esta Bien.' images={[]} />
				< Post user='cu' caption='Uno pan con carne, por favor?' images={['https://images.unsplash.com/photo-1742943679521-f4736500a471']} />
				< Post user='uc' caption='slkngwpgib pijfbpij pirnj pij.' images={[]} />
				< Post user='Poniv' caption='This is my 1st post.' images={[]} />
				< Post user='Poniv' caption='This is my 2nd post.' images={[]} />
				< Post user='Poniv' caption='This is my 3rd post.' images={[]} />
				< Post user='Poniv' caption='This is my 4th post.' images={[]} />
				< Post user='Poniv' caption='This is my 5th post.' images={[]} />
				< Post user='Poniv' caption='This is my 6th post.' images={[]} />
				< Post user='Poniv' caption='This is my 7th post.' images={[]} />
				< Post user='Poniv' caption='This is my 8th post.' images={[]} />
				< Post user='Poniv' caption='This is my 9th post.' images={[]} />
			</div>
		</div>

	)
}

export default MiddlePanel
