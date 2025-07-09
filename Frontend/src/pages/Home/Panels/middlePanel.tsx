
import React from 'react';

// components
import Post from '../../../components/Post/post'; // Custom Component
import PostCreator from '../../../components/PostCreator/postCreator'; // Custom Component

// styles
import defaultStyles from './panel.module.css';
import styles from './middlePanel.module.css';

// utils
import * as LS from '../../../utils/LocalStorage';
import { refreshAccessToken } from '../../../utils/JWT';
import BACKEND_URI from '../../../config';

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

type UserData = {
	username: string;  // creator name
	name: string;      // creator name
}


const MiddlePanel = () => {
	const username = LS.getUsername(); // get username from local storage

	const [posts, setPosts] = React.useState<PostData[]>([]); // state to hold posts
	const [postIDs, setPostIDs] = React.useState<string[]>([]); // state to hold posts

	// redirect to auth page if not logged in

	// inital feed loading
	const handleFetchPosts = React.useCallback(async () => {
		const reqBody = {
			username,
		};

		try {
			const res = await fetch(`${BACKEND_URI}/my-feed`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${LS.getAccessToken()}`
				},
				body: JSON.stringify(reqBody)
			})

			const data = await res.json();
			// console.log('Response:', data);
			// console.log(`handlePost() -> '${data.status}' : ${data.message}`);

			// Handle token expiration
			if (res.status === 403) {
				if (await refreshAccessToken()) {
					handleFetchPosts();
				}
				return;
			}

			else if (res.ok && data.status === 'success') {
				setPostIDs(data.feed);
			}
		}

		catch (error) {
			console.error(`ERROR: 'handleFetchPosts()' -> ${error}`);
		};
	}, [username]);

	const handlePopulateFeed = React.useCallback(async () => {
		const posts: PostData[] = [];

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
				const post: PostData = data.post as PostData;
				const user : UserData = data.user as UserData;

				posts.push({
					_id: post._id,
					uuid: post.uuid,
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

		setPosts(posts);
	}, [postIDs]);


	React.useEffect(() => {
		if (username) {
			handleFetchPosts();
		}
	}, [handleFetchPosts, username]);


	React.useEffect(() => {
		if (postIDs.length > 0) {
			handlePopulateFeed();
		}
	}
		, [handlePopulateFeed, postIDs]);


	return (

		<div className={[defaultStyles.panel, styles.middlePanel].join(' ')}>
			<div className={styles.posts}>

				<PostCreator />

				{posts.map((post, index) => (
					<Post key = {index}
					_id = {post._id}
					uuid = {post.uuid}
					by = {post.by}
					username = {post.username}
					description = {post.description}
					media = {post.media}
					createdAt = {post.createdAt}
					likes = {post.likes}
					comments = {post.comments}
					saves = {post.saves} />
				))}

			</div>
		</div>

	)
}

export default MiddlePanel
