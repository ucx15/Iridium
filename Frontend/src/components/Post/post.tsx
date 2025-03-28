// import React from 'react'

// Styles
import styles from './post.module.css';


interface Props {
	user: string;
	caption: string;
	images: string[];
}

const Post = (props: Props) => {
	return (
		<div className={styles.post}>
			<div className={styles.user}>{props.user}</div>
			<div className={styles.caption}>{props.caption}</div>

			{/* What to do to render images if props.images has length > 0  */}

			{props.images.length > 0 && (
				<div className={styles.images}>
					{props.images.map((image, index) => (
						<img
							key={index}
							src={image}
							loading='lazy'
							alt={`Post by ${props.user}`}
						/>
					))}
				</div>
			)}
			<div className={styles.reactions}>
				<div className={styles.reaction}>
					<button className={styles.likeButton}>Like</button>
					<div className={styles.likeCount}>0</div>
				</div>

				<div className={styles.reaction}>
					<button className={styles.commentButton}>Comment</button>
					<div className={styles.likeCount}>0</div>
				</div>

				<div className={styles.reaction}>
					<button className={styles.shareButton}>Share</button>
					<div className={styles.likeCount}>0</div>
				</div>

			</div>

		</div>
	)
}

export default Post
