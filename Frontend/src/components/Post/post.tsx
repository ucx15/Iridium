import React from 'react'

// Styles
import styles from './post.module.css';

// Config
import BACKEND_URI from '../../config.js';

// Utils
import * as LS from '../../utils/LocalStorage.js';
import { refreshAccessToken } from '../../utils/JWT.js';


interface Props {
	_id: string;         // post id
	uuid: string;        // post uuid

	by: string;        // creator id
	username: string;  // creator name

	description: string;

	createdAt?: Date;
	media?: string[];

	likes?: string[];
	comments?: string[];
	saves?: string[];

	showDelete?: boolean; // if the post can be deleted by the user
}

const Post = (props: Props) => {
	const [isSaved, setIsSaved] = React.useState(false);
	const [isLiked, setIsLiked] = React.useState(false);

	const [likeCount, setLikeCount] = React.useState(0);
	const [commentCount, setCommentCount] = React.useState(0);

	// Boilerplate for likes and comments
	React.useEffect(() => {
		setIsSaved(false);
		setCommentCount(0);
	}, []);


	const handleLikeClick = () => {
		setIsLiked(!isLiked);
		if (isLiked) {
			setLikeCount(likeCount - 1);
		} else {
			setLikeCount(likeCount + 1);
		}
	};

	const handleDeletePost = async () => {
		if (props.by !== LS.getUsername()) {
			return;
		}

		try {
			const resp = await fetch(
				`${BACKEND_URI}/post/delete`,
				{
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${LS.getAccessToken()}`
					},
					body: JSON.stringify({
						uuid: props.uuid,
						username: LS.getUsername()
					})
				}
			);

			const data = await resp.json();
			console.log(data)

			if (resp.status === 403) {
				if (await refreshAccessToken()) {
					handleDeletePost();
				}
				return;
			}

			else if (resp.status === 400) {
				console.error('Failed to delete post:', data.message);
				return;
			}

			else if (resp.ok && data.status === 'success') {
				console.log('Post deleted successfully:', props.uuid);
			}
		}

		catch (err) {
			console.error('Error deleting post:', props.uuid, err);
		}
	};

	return (
		<div className={styles.post}>
			<div className={styles.user}> {props.username} <a href={`/u/${props.by}`}> {props.by}</a></div>

			{/* What to do to render images if props.media has length > 0  */}

			{props.media && props.media.length > 0 && (
				<div className={styles.images}>
					{props.media.map((image, index) => (
						<img
							key={index}
							src={image}
							loading='lazy'
							alt={`Post by ${props.by}`}
						/>
					))}
				</div>
			)}
			<div className={styles.caption}>{props.description}</div>

			<div className={styles.reactions}>
				<div className={styles.reaction}>

					<button className={[styles.likeButton, styles.reactionButton].join(' ')}
						onClick={handleLikeClick} >
						<img src="/Assets/Icons/heart.png" alt="like button icon" className={styles.iconImage} />
					</button>

					<div className={styles.likeCount}>{likeCount}</div>
				</div>

				<div className={styles.reaction}>
					<button className={[styles.commentButton, styles.reactionButton].join(' ')}>
						<img src="/Assets/Icons/message.png" alt="comment button icon" className={styles.iconImage} />
					</button>
					<div className={styles.likeCount}>{commentCount}</div>
				</div>

				<div className={styles.reaction}>
					<button className={[styles.shareButton, styles.reactionButton].join(' ')}>
						<img src="/Assets/Icons/paper-plane.png" alt="share button icon" className={styles.iconImage} />
					</button>
					<div className={styles.likeCount}>{isSaved}</div>
				</div>

				{/* TODO: Show confirmation dialog upon clicking this button */}
				{props.showDelete && (props.by === LS.getUsername()) && (
					<div className={styles.reaction}>
						<button className={[styles.deleteButton, styles.reactionButton].join(' ')}
							onClick={handleDeletePost}
						>
							<img src="/Assets/Icons/dustbin.png" alt="delete button icon" className={styles.iconImage} />
						</button>
					</div>
				)}
			</div>

		</div>
	)
}

export default Post
