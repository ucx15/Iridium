import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
	uuid: { type: String, required: true, unique: true },     // UUID
	by: { type: String, required: true },       // Username
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
const find = async (uuid : String) => {
	return (await Post.findOne({ uuid })) ? true : false;
};

const get = async (uuid : String) => {
	return (await Post.findOne({ uuid }));
};


export default { Post,  create, find, get };
