import React from 'react'
import { useParams, useNavigate } from 'react-router-dom';

// Components
import Post from '../../components/Post/post';

// Utils
import * as LS from '../../utils/LocalStorage';

// Styles
import styles from './user.module.css';
import BACKEND_URI from '../../config';


interface UserDataStruct {
	username: string;
	name: string;
	bio: string;
	posts: Array<string>;
	followers: Array<string>;
	following: Array<string>;
}

const UserPage = () => {
	const navigate = useNavigate();

	const username = LS.getUsername(); // get username from local storage

	const { userID } = useParams<{ userID: string }>();
	const user: string = userID as string;
	const [userData, setUserData] = React.useState<UserDataStruct | undefined>(undefined); // user data from API


	const fetchUserData = async (whichUser : string) => {

		console.log(whichUser);
		const response = await fetch(`${BACKEND_URI}/user/${whichUser}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${LS.getAccessToken()}`,
			},
		});

		if (!response.ok) {
			throw new Error('Failed to fetch user data');
		};

		const data = await response.json();
		// console.log(data);

		if (data.status === 'success') {
			console.log('User data fetched successfully');
			// Handle user data here
			setUserData(data.userData);
		}
		else {
			console.error('Failed to fetch user data:', data.message);
		}
	}

	React.useEffect(() => {
		if (userID) {
			fetchUserData(userID);
		}
	}, [userID]);


	// redirect to auth page if not logged in
	React.useEffect(() => {
		if (!username || !LS.getAccessToken()) {
			navigate('/auth');
		}
	}
		, [navigate, username]);

	// redirect to home page if user is not provided in URL
	React.useEffect(() => {
		if (!userID) {
			navigate('/');
		}
	}, [navigate, userID]);


	if (!userData) {
		return (
		<div className={styles.userPage}>
			<h1>'{userID}'</h1>
			<h3 style={{ color: 'darkred' }}>User doesn't exist!</h3>
		</div>)
	}

	return (
		<div className={styles.userPage}>

			<div className={styles.hero}>
				<img className={styles.userImage} src="/Assets/Images/userProfile.png" alt="User" />
				<h1> @{userID} </h1>
			</div>

			<div className={styles.about}>

				<div className={styles.userInfo}>
					<h2>{userData.name}</h2>
					<div className={styles.userBio}>
						<p>{userData.bio}</p>
					</div>

					<div className={styles.userStats}>
						<p>Followers: {userData.followers.length}</p>
						<p>Following: {userData.following.length}</p>
					</div>
				</div>

				<div className={styles.userActions}>
					<button className={styles.followButton}>Follow</button>
					{/* <button className={styles.messageButton}>Message</button> */}
				</div>
			</div>

			<div className={styles.userFeed}>

				<Post user={user} caption="Lorem ipsum dolor, sit amet consectetur adipisicing elit" images={[]} />
				<Post user={user} caption="Lorem ipsum dolor, sit amet consectetur adipisicing elit" images={[]} />
				<Post user={user} caption="Lorem ipsum dolor, sit amet consectetur adipisicing elit" images={[]} />

			</div>
		</div>
	)
}

export default UserPage

// TODO: fetch user posts from API
// TODO: fetch usable data from API
