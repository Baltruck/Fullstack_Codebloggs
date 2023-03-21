const { ObjectId, Int32 } = require('mongodb');
const mongoose = require('mongoose');
const { use } = require('../routes/record');

const userSchema = new mongoose.Schema({
//   _id: {type: ObjectId, require: true},
  first_name: {type: String, required: true, maxlength: 60},
  last_name: {type: String, required: true, maxlength: 60},
  birthday: {type: String, required: true}, //type date
  email: {type: String, required: true},
  password: {type: String, required: true},
  status: {type: String, required: true},
  location: {type: String, required: true, maxlength: 60},
  occupation: {type: String, required: true, maxlength: 60},
  auth_level: {type: String, required: true, default: "user"},
});

const postSchema = new mongoose.Schema({
    content: {type: String, required: true},
    user_id: {type: String, require: true}, //type user?
    likes: {type: Number, required: true, default: 0},
    time_stamp: {type: String, required: true},
    comments: {type: String, required: true, default: null},
})

const commentSchema = new mongoose.Schema({
    content: {type: String, require: true},
    post_id: {type: String},
    user_id: {type: String, require: true},
    likes: {type: Number, require: true, default: 0},
    times_stamp: {type: String, require: true},
})

// const sessionSchema = new mongoose.Schema({
//     _id: {type: ObjectId, require: true},
//     session_id: {type: String},
//     session_date: {type: Date, require: true},
//     user: { require: true},
// })

const UserModel = mongoose.model('User', userSchema);
const PostModel = mongoose.model('Post', postSchema);
const CommentModel = mongoose.model('Comment', commentSchema);
// const SessionModel = mongoose.model('Session', sessionSchema);

module.exports = {UserModel, PostModel, CommentModel};


