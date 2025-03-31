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

const create = async (uuid : String, email : String, username : String, password : String, name : String) => {
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
const find = async (username : String) => {
	return (await User.findOne({ username })) ? true : false;
};

const get = async (username : String) => {
	return (await User.findOne({ username }));
};


export default { User,  create, find, get };
