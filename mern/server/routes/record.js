const express = require("express");
const { UserModel, PostModel, CommentModel } = require("../db/schemas");
const validator = require("validator");
const { v4: uuidv4 } = require("uuid");

const recordRoutes = express.Router();

const dbo = require("../db/conn");
const { response } = require("express");
const e = require("express");

const ObjectId = require("mongodb").ObjectId;

// Middlewares Definitions
const emailValidator = (req, res, next) => {
  const email = req.body.email;
  if (validator.isEmail(email)) {
    next();
  } else {
    return res.send({ message: "Invalid email" });
  }
};

// Middleware CAll
recordRoutes.use("/signup", emailValidator);

// User creation and login /********************** *//********************** *//********************** */
recordRoutes.route("/signup").post(async (req, response) => {
  let db_connect = dbo.getDb();
  const user = new UserModel({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    birthday: req.body.birthday,
    email: req.body.email,
    password: req.body.password,
    location: req.body.location,
    occupation: req.body.occupation,
  });

  const notANewUser = await db_connect
    .collection("User")
    .findOne({ email: user.email });

  if (!notANewUser) {
    await db_connect.collection("User").insertOne(user, function (err, res) {
      if (err) throw err;
      response.json(user);
    });
  } else {
    response.send("User already exist");
  }
});

recordRoutes.route("/login").post(async (req, response) => {
  let db_connect = dbo.getDb();
  const { email, password } = req.body;
  const user = await db_connect.collection("User").findOne({ email });
  if (!user) {
    return response.status(400).json({ message: "No user found" });
  } else if (user && password !== user.password) {
    return response.status(400).json({ message: "Wrong password" });
  }
  await db_connect
    .collection("Session")
    .deleteMany({ ["user.email"]: user.email });
  const session_token = uuidv4();
  const session = {
    session_id: session_token,
    user: {
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      birthday: user.birthday,
      email: user.email,
      password: user.password,
      status: user.status,
      location: user.location,
      occupation: user.occupation,
      auth_level: user.auth_level,
    },
    session_date: new Date(),
  };
  await db_connect.collection("Session").insertOne(session);
  return response.send({ message: "Login Successful", User: session });
});

// User creation and login /********************** *//********************** *//********************** */

recordRoutes.route("/status").patch(async (req, response) => {
  let db_connect = dbo.getDb();

  if (!ObjectId.isValid(req.body.userId)) {
    console.log("Invalid userId");
    return response.status(400).json({ message: "Invalid userId" });
  }

  const userId = ObjectId(req.body.userId);
  const statusUpdate = req.body.status;

  const user = await db_connect.collection("User").findOne({ _id: userId });

  if (!user) {
    return response.status(400).json({ message: "No user found" });
  } else {
    await db_connect
      .collection("User")
      .updateOne({ _id: userId }, { $set: { status: statusUpdate } });
    response.send({ message: "Status Updated", newStatus: statusUpdate });
  }
});
// Article (Blog Post) Section /********************** *//********************** *//********************** */
recordRoutes.route("/new-article").post(async (req, response) => {
  let db_connect = dbo.getDb();
  const userEmail = req.body.email;
  const content = req.body.content;
  const user = await db_connect
    .collection("User")
    .findOne({ email: userEmail });
  const currentDate = new Date();

  const article = new PostModel({
    content: content,
    user_id: user._id,
    time_stamp: currentDate,
  });
  console.log(article);
  db_connect.collection("Post").insertOne(article, function (err, res) {
    if (err) throw err;
    response.send(article);
  });
});

recordRoutes.route("/get-articles").post(async (req, response) => {
  let db_connect = dbo.getDb("CodeBlogg");
  if (!ObjectId.isValid(req.body.userId)) {
    console.log("Invalid userId");
    return response.status(400).json({ message: "Invalid userId" });
  }
  const userId = ObjectId(req.body.userId);

  const user = await db_connect.collection("User").findOne({ _id: userId });

  if (!user) {
    response.status(404).json({ message: "User not found" });
  } else {
    const userPosts = await db_connect
      .collection("Post")
      .find({ user_id: user._id })
      .toArray();

    if (userPosts) {
      response.json(userPosts);
    } else {
      response.status(500).json({ message: "Error fetching user posts" });
    }
  }
});

recordRoutes.route("/get-posts").get((req, response) => {
  let db_connect = dbo.getDb("CodeBlogg");
  db_connect
    .collection("Post")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      response.json(result);
    });
});
// Comment Section /********************** *//********************** *//********************** */
recordRoutes.route("/new-comment").post(async (req, response) => {
  let db_connect = dbo.getDb();

  const post_id = ObjectId(req.body.post_id);
  const userEmail = req.body.email;

  const user = await db_connect
    .collection("User")
    .findOne({ email: userEmail });
  console.log("USER");
  console.log(user);

  const post = await db_connect.collection("Post").findOne({ _id: post_id });
  console.log("POST content");
  console.log(post);

  if (!post || !user) {
    return response.status(400).json({ message: "Invalid request" });
  }

  const userId = user._id;
  const postId = post._id;

  const currentDate = new Date();

  const comment = new CommentModel({
    content: req.body.content,
    user_id: userId,
    post_id: postId,
    times_stamp: currentDate,
  });

  console.log(comment);
  await db_connect
    .collection("Post")
    .updateOne({ _id: post_id }, { $push: { comments: comment } });
  await db_connect
    .collection("Comment")
    .insertOne(comment, function (err, res) {
      if (err) throw err;
      response.send({ comment });
    });
});
recordRoutes.route("/userInfo").post(async (req, response) => {
  let db_connect = dbo.getDb();

  if (!ObjectId.isValid(req.body.userId)) {
    console.log("Invalid userId");
    return response.status(400).json({ message: "Invalid userId" });
  }
  console.log("You PASSED THE TEST");
  const userId = ObjectId(req.body.userId);
  const user = await db_connect.collection("User").findOne({ _id: userId });
  if (!user) {
    console.log("User not found");
    return response.status(404).json({ message: "User not found" });
  }
  response.send({ UserInfo: user });
});

recordRoutes.route("/userOfPost/:userId").get(async (req, response) => {
  let db_connect = dbo.getDb();
  const userId = ObjectId(req.params.userId);
  const user = await db_connect.collection("User").findOne({ _id: userId });
  if (!user) {
    console.log("User not found");
    return response.status(404).json({ message: "User not found" });
  }
  response.send({ UserInfo: user });
});

recordRoutes.route("/findUserId").post(async (req, response) => {
  let db_connect = dbo.getDb();
  if (!ObjectId.isValid(req.body.userId)) {
    console.log("Invalid userId");
    return response.status(400).json({ message: "Invalid userId" });
  }
  const userId = ObjectId(req.body.userId);
  const user = await db_connect.collection("User").findOne({ _id: userId });
  if (!user) {
    console.log("User not found");
    return response.status(404).json({ message: "User not found" });
  }
  response.send({ UserInfo: user });
});

recordRoutes.route("/get-all-users").get(async (req, response) => {
  let db_connect = dbo.getDb("CodeBlogg");
  db_connect
    .collection("User")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      response.json(result);
    });
});

recordRoutes.route("/like").patch(async (req, response) => {
  let db_connect = dbo.getDb();
  const post_id = ObjectId(req.body.post_id);

  const post = await db_connect.collection("Post").find({ _id: post_id });
  if (!post) {
    return response.status(400).json({ message: "Invalid Post" });
  }

  await db_connect
    .collection("Post")
    .updateOne({ _id: post_id }, { $inc: { likes: 1 } });

  response.send({ message: "Post Liked" });
});

recordRoutes.route("/like-comment").patch(async (req, response) => {
  let db_connect = dbo.getDb();
  const post_id = ObjectId(req.body.post_id);
  const comment_id = ObjectId(req.body.comment_id);
  const post = await db_connect.collection("Post").findOne({ _id: post_id });
  if (!post) {
    return response.status(400).json({ message: "Invalid Post" });
  }

  await db_connect
    .collection("Comment")
    .updateOne({ _id: comment_id }, { $inc: { likes: 1 } });

  const updatedComment = await db_connect
    .collection("Comment")
    .findOne({ _id: comment_id });

  await db_connect
    .collection("Post")
    .updateOne(
      { _id: post_id, "comments._id": comment_id },
      { $set: { "comments.$.likes": updatedComment.likes } }
    );

  return response.send({ message: "Comment Liked" });
});

recordRoutes.route("/update-user").patch(function (req, response) {
  let db_connect = dbo.getDb();
  const userID = ObjectId(req.body._id);

  let newvalues = {
    $set: {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      birthday: req.body.birthday,
      email: req.body.email,
      password: req.body.password,
      location: req.body.location,
      occupation: req.body.occupation,
      status: req.body.status,
      auth_level: req.body.auth_level,
    },
  };
  db_connect
    .collection("User")
    .updateOne({ _id: userID }, newvalues, function (err, res) {
      if (err) throw err;
      console.log("1 document updated");
      response.json(res);
    });
});

recordRoutes.route("/delete-user").delete((req, response) => {
  let db_connect = dbo.getDb();
  const userID = ObjectId(req.body.user_id);
  console.log(userID);
  db_connect.collection("User").deleteOne({ _id: userID }, function (err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
    response.json(obj);
  });
});

recordRoutes.route("/delete-post").delete((req, response) => {
  let db_connect = dbo.getDb();
  const postID = ObjectId(req.body.post_id);
  console.log(postID);
  db_connect.collection("Post").deleteOne({ _id: postID }, function (err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
    response.json(obj);
  });
});

module.exports = recordRoutes;
