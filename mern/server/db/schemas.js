const { ObjectId, Int32 } = require('mongodb');
const mongoose = require('mongoose');
const { use } = require('../routes/record');
// mongoose.connect('mongodb://localhost/myDatabase', { useNewUrlParser: true });



const userSchema = new mongoose.Schema({
//   _id: {type: ObjectId, require: true},
  first_name: {type: String, require: true, maxlength: 60},
  last_name: {type: String, require: true,maxlength: 60},
  birthday: {type: String, require: true}, //type date
  email: {type: String, require: true},
  password: {type: String, require: true},
  status: {type: String, require: true, maxlength: 20},
  location: {type: String, require: true, maxlength: 40},
  occupation: {type: String, require: true, maxlength: 20},
  auth_level: {type: String, require: true, default: "user", maxlength: 10},
});

// const sessionSchema = new mongoose.Schema({
//     _id: {type: ObjectId, require: true},
//     session_id: {type: String},
//     session_date: {type: Date, require: true},
//     user: { require: true},
// })

// const postSchema = new mongoose.Schema({
//     content: {type: String, require: true},
//     // user_id: {type: User, require: true}, //type user?
//     likes: {type: Int32, require: true, default: 0},
//     time_stamp: {type: String, require: true},
//     comments: {type: Comment, require: true},
// })

// const commentSchema = new mongoose.Schema({
//     // _id: {type: ObjectId, require: true},
//     content: {type: String, require: true},
//     post_id: {type: String},
//     user_id: {type: User, require: true},
//     likes: {type: Int32, require: true, default: 0},
//     times_stamp: {type: String, require: true},
// })

const UserModel = mongoose.model('User', userSchema);
// const SessionModel = mongoose.model('Session', schema);
// const PostModel = mongoose.model('Post', schema);
// const CommentModel = mongoose.model('Comment', schema);

module.exports = {UserModel};


