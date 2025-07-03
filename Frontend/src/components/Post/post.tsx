import React from 'react'

// Styles
import styles from './post.module.css';


interface Props {
	by: string;        // creator id
	username: string;  // creator name

	description: string;

	createdAt?: Date;
	media?: string[];

	likes?: string[];
	comments?: string[];
	saves?: string[];
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
						<img src="/Assets/Icons/heart.png" alt="like button icon" className={styles.iconImage}/>
					</button>

					<div className={styles.likeCount}>{likeCount}</div>
				</div>

				<div className={styles.reaction}>
					<button className={[styles.commentButton, styles.reactionButton].join(' ')}>
						<img src="/Assets/Icons/message.png" alt="comment button icon" className={styles.iconImage}/>
					</button>
					<div className={styles.likeCount}>{commentCount}</div>
				</div>

				<div className={styles.reaction}>
					<button className={[styles.shareButton, styles.reactionButton].join(' ')}>
					<img src="/Assets/Icons/paper-plane.png" alt="share button icon" className={styles.iconImage}/>
					</button>
					<div className={styles.likeCount}>{isSaved}</div>
				</div>

			</div>

		</div>
	)
}

export default Post
