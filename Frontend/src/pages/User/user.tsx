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
	_id: string;         // post id
	uuid: string;        // post uuid

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

	const { userID } = useParams<{ userID: string }>() as { userID: string }; // get userID from URL params
	// const user: string = userID as string;

	// --- States ---
	const [userData, setUserData] = React.useState<UserDataStruct | undefined>(undefined); // user data from API
	const [posts, setPosts] = React.useState<PostData[]>([]); // user posts from API

	const [followerCount, setFollowerCount] = React.useState<number>(0); // number of followers
	const [followingCount, setFollowingCount] = React.useState<number>(0); // number of following
	const [isFollowing, setIsFollowing] = React.useState<boolean>(false); // is user following the user in URL


	// --- Handler functions ---
	// Function to fetch user data from API
	const fetchUserData = async (whichUser: string) => {

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

		if (postIDs.length === 0) {
			setPosts([]); // No posts to display
			return;
		}

		// TODO: implement large post array fetching using block of 10 or reasonable number

		// if (postIDs.length > 10) {
		// }
		// else {
		// }

		const res = await fetch(`${BACKEND_URI}/posts/batch-fetch`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${LS.getAccessToken()}`
			},
			body: JSON.stringify({
				postIDs
			})
		});

		const data = await res.json();
		// console.log(data);

		if (res.status === 403) {
			if (await refreshAccessToken()) {
				handlePopulateFeed();
			}
			return;
		}

		else if (res.ok && data.status === 'success') {
			setPosts(data.posts);
		}

	}, [userData]);

	// Function to handle follow action
	const handleFollowUser = async (followee: string) => {

		const response = await fetch(`${BACKEND_URI}/follow`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${LS.getAccessToken()}`,
			},
			body: JSON.stringify({
				follower: username,
				followee
			}),
		});

		if (!response.ok) {
			throw new Error('Failed to follow user');
		}

		const data = await response.json();

		if (data.status === 'success') {
			setIsFollowing(true);
		} else {
			console.error('Failed to follow user:', data.message);
		}
	}

	// Function to handle unfollow action
	const handleUnfollowUser = async (unfollowee: string) => {

		const response = await fetch(`${BACKEND_URI}/unfollow`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${LS.getAccessToken()}`,
			},

			body: JSON.stringify({
				unfollower: username,
				unfollowee
			}),
		});

		if (!response.ok) {
			throw new Error('Failed to unfollow user');
		}

		const data = await response.json();

		if (data.status === 'success') {
			setIsFollowing(false);
		} else {
			console.error('Failed to unfollow user:', data.message);
		}
	}

	const handleFollowButtonClick = async () => {
		if (userID === username) {
			console.error('ERROR: handleFollowButtonClick() -> Cannot follow/unfollow yourself');
			return;
		}

		if (isFollowing) {
			await handleUnfollowUser(userID);
			setFollowerCount(followerCount - 1);
			setIsFollowing(false);
		}

		else {
			await handleFollowUser(userID);
			setFollowerCount(followerCount + 1);
			setIsFollowing(true);
		}
	}

	// --- useEffect Hooks ---

	// fetch user data when userID changes
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

	// UPDATE states when userData changes
	React.useEffect(() => {
		if (userID && userData) {
			handlePopulateFeed();

			if (userData.followers.includes(username as string)) {
				setIsFollowing(true);
			}
			else {
				setIsFollowing(false);
			}

			setFollowerCount(userData.followers.length);
			setFollowingCount(userData.following.length);

		}
	}, [handlePopulateFeed, userData, userID, username]);


	// Redirect to auth page if access token is expired
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
						<p>Followers: {followerCount} [{userData.followers}]</p>
						<p>Following: {followingCount} [{userData.following}]</p>
					</div>
				</div>

				<div className={styles.userActions}>
					<button className={styles.followButton} onClick={handleFollowButtonClick}> {isFollowing ? 'Unfollow' : 'Follow'} </button>
					{/* <button className={styles.messageButton}>Message</button> */}
				</div>
			</div>

			<div className={styles.userFeed}>

				{posts.map((post, index) => (
					<Post key={index}
						uuid={post.uuid}
						_id={post._id}
						by={post.by}
						username={userData.name}
						description={post.description}
						media={post.media}
						createdAt={post.createdAt}
						likes={post.likes}
						comments={post.comments}
						saves={post.saves}
						showDelete={true} // Show delete button only if the post is created by the user
						/>
				))}

			</div>
		</div>
	)
}

export default UserPage

// TODO: fetch usable data from API
