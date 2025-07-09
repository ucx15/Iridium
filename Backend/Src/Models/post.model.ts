import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
	uuid: { type: String, required: true, unique: true },     // UUID
	by: { type: String, required: true },       			  // Username
	description: { type: String, required: true },            // Display Name

	createdAt: { type: Date, default: () => Date.now() },     // Account Creation Date
	media: { type: Array, default: [] },	                  // Array of image URLs

	likes: { type: Array, default: [] },                      // Array of uuids of Users
	comments: { type: Array, default: [] },                   // Array of uuids of Users
	saves: { type: Array, default: [] },                      // Array of uuids of Users

	deleted: { type: Boolean, default: false }                // Account Deletion
});

const Post = mongoose.model("Post", postSchema);

const create = async (uuid: String, by: String, description: String, media?: string[]) => {

	const post = new Post({
		uuid,
		by,
		description,
		media
	});

	await post.save();
	return post;
}

// Returns true if user exists and false if user does not exist
const find = async (uuid: String) => {
	return (await Post.findOne({
		uuid, deleted:false
	})) ? true : false;
};

const get = async (uuid: String) => {
	return (await Post.findOne({
		uuid, deleted:false
	}));
};

const getBatch = async (postIDs: string[]) => {
	const posts = await Post.find({
		uuid: { $in: postIDs },
		deleted: false
	})
	// TODO: return posts sorted by createdAt in descending order
	// .sort({ createdAt: -1 });

	if (!posts || posts.length === 0) {
		return [];
	}

	return posts;
};

const deletePost = async (uuid: String) => {
	const post = await Post.findOne({ uuid });

	if (!post) {
		return false;
	}

	// await Post.deleteOne({ uuid });
	post.deleted = true; // Soft delete the post

	await post.save();
	return true;
}

export default { Post, create, find, get, getBatch, deletePost };

// NOTE: deleted logic here is just a soft delete -> Archive the post
// TODO: implement Archiving the post and deletion SEPARATELY !!!

// NOTE: deleted posts should still be accessible for the user who created them
// TODO: move deleted logic to post controller for better control
