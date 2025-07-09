import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
	uuid: { type: String, required: true, unique: true },     // UUID
	email: { type: String, required: true },                  // Email
	username: { type: String, required: true, unique: true }, // Username
	password: { type: String, required: true },               // Hashed Password
	name: { type: String, required: true },                   // Display Name

	createdAt: { type: Date, default: () => Date.now() },       // Account Creation Date
	bio: { type: String, default: "" },                       // Bio
	profilePicture: { type: String, default: "" },            // Profile Picture URL
	posts: { type: Array, default: [] },	                  // Array of post IDs

	followers: { type: Array, default: [] },                  // Array of followers UUIDs
	following: { type: Array, default: [] },                  // Array of following UUIDs

	likes: { type: Array, default: [] },                      // Array of liked Post IDs
	saves: { type: Array, default: [] },                      // Array of saved Post IDs

	deleted: { type: Boolean, default: false }                // Account Deletion
});


const User = mongoose.model("User", userSchema);

const create = async (uuid: String, email: String, username: String, password: String, name: String) => {
	const user = new User({
		uuid,
		email,
		username,
		password,
		name
	});
	await user.save();
	return user;
};

// Returns true if user exists and false if user does not exist
const find = async (username: String) => {
	return (await User.findOne({ username })) ? true : false;
};

const search = async (query: String) => {
	// Fuzzy search for users by username or name
	return await User.find(
		{$or: [
			{ username: { $regex: query, $options: 'i' } },
			{ name: { $regex: query, $options: 'i' } }
		]},
		{limit: 15},
		{select: 'username name profilePicture'}
	).lean();
}

const get = async (username: String) => {
	return (await User.findOne({ username }));
};

const details = async (username: String) => {
	return await User.findOne(
		{ username },
		{ password: 0, _id: 0, __v: 0, uuid: 0, deleted: 0, createdAt: 0, email: 0, saves: 0, likes: 0}
	);
}

const addPost = async (username: string, postId: string) => {
	const user = await User.findOne({ username });

	if (!user) {
		return;
	}

	user.posts.push(postId);
	user.save();
}

const findPost = async (username: string, postId: string): Promise<boolean> => {
	const user = await User.findOne({ username });

	if (!user) {
		return false;
	}

	return user.posts.includes(postId) ? true : false;
}

const getAllPosts = async (username: string): Promise<any> => {
	const user = await User.findOne({ username });

	if (!user) {
		return [];
	}

	return user.posts;
}

const followUser = async (follower: string, followee: string) => {
	// follower : username of the user who is following
	// followee : username of the user who is being followed

	const followerUser = await User.findOne({ username: follower });
	const followeeUser = await User.findOne({ username: followee });

	if (!followerUser || !followeeUser) {
		console.log(`DB ERROR: User '${follower}' or '${followee}' does not exist`);
		return false;
	}

	if (followerUser.following.includes(followee) || followeeUser.followers.includes(follower)) {
		console.log(`WARN: User '${follower}' already follows '${followee}'`);
		return false;
	}

	followerUser.following.push(followee);
	followeeUser.followers.push(follower);

	await followerUser.save();
	await followeeUser.save();

	return true;
}

const unfollowUser = async (unfollower: string, unfollowee: string) => {
	// unfollower : username of the user who is unfollowing
	// unfollowee : username of the user who is being unfollowed

	const unfollowerUser = await User.findOne({ username: unfollower });
	const unfolloweeUser = await User.findOne({ username: unfollowee });

	if (!unfollowerUser || !unfolloweeUser) {
		console.log(`DB ERROR: User '${unfollower}' or '${unfollowee}' does not exist`);
		return false;
	}

	if (!unfollowerUser.following.includes(unfollowee) || !unfolloweeUser.followers.includes(unfollower)) {
		console.log(`WARN: User '${unfollower}' is not following '${unfollowee}'`);
		return false;
	}

	unfollowerUser.following.splice(unfollowerUser.following.indexOf(unfollowee), 1);
	unfolloweeUser.followers.splice(unfolloweeUser.followers.indexOf(unfollower), 1);

	await unfollowerUser.save();
	await unfolloweeUser.save();

	return true;
}

const likePost = async (username: string, postId: string) => {
	const user = await User.findOne({ username });
	if (!user) {
		console.log(`ERROR: User '${username}' does not exist`);
		return false;
	}
	if (user.likes.includes(postId)) {
		console.log(`WARN: User '${username}' already liked post '${postId}'`);
		return false;
	}
	user.likes.push(postId);
	await user.save();
	return true;
}

const unlikePost = async (username: string, postId: string) => {
	const user = await User.findOne({ username });
	if (!user) {
		return false;
	}
	if (!user.likes.includes(postId)) {
		return false;
	}
	user.likes.splice(user.likes.indexOf(postId), 1);
	await user.save();
	return true;
}

// For debugging
const getAll = async () => {
	return (await User.find({}));
}


export default { User, create, find, search, get, details, getAll, addPost, findPost, getAllPosts, followUser, unfollowUser, likePost, unlikePost };
