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
			<div className={styles.caption}>{props.caption}</div>

			<div className={styles.reactions}>
				<div className={styles.reaction}>

					<button className={[styles.likeButton, styles.reactionButton].join(' ')}>
						<img src="./Assets/Icons/heart.png" alt="like button icon" className={styles.iconImage}/>
					</button>

					<div className={styles.likeCount}>0</div>
				</div>

				<div className={styles.reaction}>
					<button className={[styles.commentButton, styles.reactionButton].join(' ')}>
						<img src="./Assets/Icons/message.png" alt="comment button icon" className={styles.iconImage}/>
					</button>
					<div className={styles.likeCount}>0</div>
				</div>

				<div className={styles.reaction}>
					<button className={[styles.shareButton, styles.reactionButton].join(' ')}>
					<img src="./Assets/Icons/paper-plane.png" alt="share button icon" className={styles.iconImage}/>
					</button>
					<div className={styles.likeCount}>0</div>
				</div>

			</div>

		</div>
	)
}

export default Post
