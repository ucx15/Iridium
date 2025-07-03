import React from 'react'
import { useParams, useNavigate } from 'react-router-dom';

// Components
import Post from '../../components/Post/post';

// Utils
import * as LS from '../../utils/LocalStorage';
import { refreshAccessToken } from '../../utils/JWT';
import BACKEND_URI from '../../config';

// Styles
import styles from './user.module.css';

type PostData = {
	by: string;
	username: string;  // creator name

	description: string;

	createdAt?: Date;
	media?: string[];

	likes?: string[];
	comments?: string[];
	saves?: string[];
}

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
	// const user: string = userID as string;
	const [userData, setUserData] = React.useState<UserDataStruct | undefined>(undefined); // user data from API
	const [posts, setPosts] = React.useState<PostData[]>([]); // user posts from API

	const fetchUserData = async (whichUser : string) => {

		// console.log(whichUser);
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
			// console.log('User data fetched successfully');
			// Handle user data here
			setUserData(data.userData);
		}
		else {
			console.error('Failed to fetch user data:', data.message);
		}
	}

	// Function to populate user page with posts
	const handlePopulateFeed = React.useCallback(async () => {
		const postIDs = userData?.posts || [];
		const postsLocal = [];

		for (const postID of postIDs) {
			const res = await fetch(`${BACKEND_URI}/post/${postID}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${LS.getAccessToken()}`
				}
			});

			const data = await res.json();
			// console.log('Response:', data);
			// console.log(`handlePopulateFeed() -> '${data.status}' : ${data.message}`);

			if (res.status === 403) {
				if (await refreshAccessToken()) {
					handlePopulateFeed();
				}
				return;
			}

			else if (res.ok && data.status === 'success') {
				const post = data.post;
				const user = data.user;

				postsLocal.push({
					by: post.by,
					username: user.name,

					description: post.description,
					createdAt: post.createdAt,

					media: post.media,

					likes: post.likes,
					comments: post.comments,
					saves: post.saves,
				});
			}
		}

		setPosts(postsLocal);
	}, [userData]);


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

	// fetch user posts
	React.useEffect(() => {
		if (userID && userData) {
			handlePopulateFeed();
		}
	}, [handlePopulateFeed, userData, userID]);

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

				{posts.map((post, index) => (
					<Post key = {index}
					by = {post.by}
					username = {post.username}
					description = {post.description}
					media = {post.media}
					createdAt = {post.createdAt}
					likes = {post.likes}
					comments = {post.comments}
					saves = {post.saves} />
				))}

				{/* <Post by={user} username={userData.name} description="Lorem ipsum dolor, sit amet consectetur adipisicing elit" media={[]} />
				<Post by={user} username={userData.name} description="Lorem ipsum dolor, sit amet consectetur adipisicing elit" media={[]} />
				<Post by={user} username={userData.name} description="Lorem ipsum dolor, sit amet consectetur adipisicing elit" media={[]} /> */}

				{/* TODO: Fetch user posts from API and render them here */}
			</div>
		</div>
	)
}

export default UserPage

// TODO: fetch user posts from API
// TODO: fetch usable data from API
