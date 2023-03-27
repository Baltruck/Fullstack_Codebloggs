const express = require("express");
const {UserModel, PostModel, CommentModel} = require("../db/schemas") //import schemas
const validator = require('validator');
const { v4: uuidv4 } = require('uuid');

const recordRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");
const { response } = require("express");
const e = require("express");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

// Middlewares Definitions
const emailValidator = (req, res, next) => {
  const email = req.body.email;
  if (validator.isEmail(email)) {
    // console.log('Email is valid!');
    next();
  } else {
    // console.log('Email is not valid.');
    return res.send({message: "Invalid email"})
  }
  
};

// Middleware CAll
recordRoutes.use("/signup", emailValidator);

// User creation and login /********************** *//********************** *//********************** */
recordRoutes.route("/signup").post( async (req, response) => {
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

  const notANewUser = await db_connect.collection("User").findOne( {"email": user.email});

  if (!notANewUser) {
    await db_connect.collection("User").insertOne(user, function (err, res) {
      if (err) throw err;
      response.json(user);
    });
  } else {
    response.send("User already exist");
  }
});

recordRoutes.route("/login").post( async (req, response) => {
  let db_connect = dbo.getDb();
  const {email, password} = req.body;
  const user = await db_connect.collection("User").findOne({ email });
  if (!user) {
    return response.status(400).json({ message: "No user found" });
  } else if ( user && password !== user.password) {
    return response.status(400).json({ message: "Wrong password" });
  }
  await db_connect.collection("Session").deleteMany({ ["user.email"]: user.email });
  const session_token = uuidv4();
  const session = { session_id: session_token,
     user: {first_name: user.first_name, last_name: user.last_name, birthday: user.birthday, email: user.email, password: user.password, status: user.status, location: user.location, occupation: user.occupation, auth_level: user.auth_level},
      session_date: new Date() };
  await db_connect.collection("Session").insertOne(session);
  return response.send({message: "Login Successful", User: session});
});

// recordRoutes.route("/logout").get( async (req, res) => {

//   let db_connect = dbo.getDb();
//   let cacheToken = req.query.token; //grabs the token from the browser
//   console.log("TOKEN")
//   console.log(cacheToken);
//   db_connect
//   .collection("Session")
//   .deleteOne({session_id: cacheToken}, function (err, result) {
//     if (err) {
//       res.status(500).json({ status: "error", message: "Failed to delete token" });
//     } else if (!result) {
//       res.json({status: "ok", data: {valid: false, user: null, message: "Invalid token"}});
//     } else {
//       res.json({status: "ok", data: { message: "Session deleted"}});
//     }
// });


//   await db_connect.collection("Session").deleteMany({ ["user.email"]: user.email });

// User creation and login /********************** *//********************** *//********************** */

recordRoutes.route("/status").patch(async (req, response) => {
  let db_connect = dbo.getDb();
  const userEmail = req.body.email;
  const statusUpdate = req.body.status;

  const user = await db_connect.collection("User").findOne({ email: userEmail});

  if (!user) {
    return response.status(400).json({ message: "No user found" });
  } else {
    await db_connect.collection("User").updateOne(
      { email: userEmail },
      { $set: { "status": statusUpdate } }
    );
    response.send({ message: "Status Updated", newStatus: statusUpdate });
  }
});
// Article (Blog Post) Section /********************** *//********************** *//********************** */
recordRoutes.route("/new-article").post( async (req, response ) => {
  let db_connect = dbo.getDb();
  const userEmail = req.body.email;
  const content = req.body.content;
  const user = await db_connect.collection("User").findOne({ email: userEmail });
  const currentDate = new Date();

  const article = new PostModel({
    content: content,
    user_id: user._id,
    time_stamp: currentDate,
  });
  console.log(article)
  db_connect.collection("Post").insertOne(article, function (err, res) {
    if (err) throw err;
    response.send(article);
  });
});

recordRoutes.route("/get-articles").post(async (req, response) => {
  let db_connect = dbo.getDb("CodeBlogg");
  const userEmail = req.body.email;
  console.log("reqbody", req.body);

  const user = await db_connect.collection("User").findOne({ email: userEmail });

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

recordRoutes.route("/get-posts").get( (req, response) => {//returns all posts
  let db_connect = dbo.getDb("CodeBlogg");
  db_connect
  .collection("Post")
  .find({})
  .toArray(function (err, result) {
    if (err) throw err;
    response.json(result);
  });

})
// Comment Section /********************** *//********************** *//********************** */
recordRoutes.route("/new-comment").post( async (req, response ) => {

  let db_connect = dbo.getDb();

  //Post commented on
  const post_id = ObjectId(req.body.post_id);
  //User making the comment
  const userEmail = req.body.email;

  const user = await db_connect.collection("User").findOne( {email: userEmail});
  console.log("USER");
  console.log(user);

  const post = await db_connect.collection("Post").findOne( {_id: post_id});
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
  //append the comment to the post comment list
  await db_connect.collection("Post").updateOne(
    { _id: post_id}, //post._id not userid
    { $push: { comments: comment } }
    );
  //add the comment to the Comment conllection
  await db_connect.collection("Comment").insertOne(comment, function (err, res) {
      if (err) throw err;
      response.send( {comment});
    });
});
//Get user informations
recordRoutes.route("/userInfo").post(async (req, response) => {//change to get
  let db_connect = dbo.getDb();
  const userEmail = req.body.email;
  const user = await db_connect.collection("User").findOne({ email: userEmail });
  if (!user) {
    console.log('User not found'); // Log user not found
    return response.status(404).json({ message: "User not found" });
  }
  response.send({ UserInfo: user });
});

recordRoutes.route("/userOfPost/:userId").get(async (req, response) => {
  let db_connect = dbo.getDb();
  const userId = ObjectId(req.params.userId);
  const user = await db_connect.collection("User").findOne({ _id: userId });
  if (!user) {
    console.log('User not found'); // Log user not found
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

// Likes Section /********************** *//********************** *//********************** */
//     //update the comment collection with the new likes
//     await db_connect.collection("Comment").updateOne(
//       {_id: comment_id, "post_id._id": post_id._id},
//       {$set: {"post_id.likes": updatedPost.likes}}
//     );
    
//     response.send( {message: "Post  Liked"});
      
// });


recordRoutes.route("/like").patch(async (req, response) => {
  let db_connect = dbo.getDb();
  const post_id = ObjectId(req.body.post_id);

  // Rechercher le post correspondant à post_id dans la collection "Post" de la base de données
  const post = await db_connect.collection("Post").find({ _id: post_id });
  if (!post) {
    return response.status(400).json({ message: "Invalid Post" });
  }

  // Mettre à jour le post en augmentant le nombre de likes (`likes`) de 1
  await db_connect.collection("Post").updateOne(
    { _id: post_id },
    { $inc: { likes: 1 } }
  );

  response.send({ message: "Post Liked" });
});

recordRoutes.route("/like-comment").patch( async (req, response) => {

  let db_connect = dbo.getDb();
  const post_id = ObjectId(req.body.post_id);
  const comment_id = ObjectId(req.body.comment_id);
  const post = await db_connect.collection("Post").findOne( {_id: post_id}); 
  if (!post) {
    return response.status(400).json({ message: "Invalid Post" });
  }

  await db_connect.collection("Comment").updateOne(
    { _id: comment_id},
    { $inc: { likes: 1 } }
    );

  const updatedComment = await db_connect.collection("Comment").findOne({_id: comment_id});

  await db_connect.collection("Post").updateOne(
    {_id: post_id, "comments._id": comment_id},
    {$set: {"comments.$.likes": updatedComment.likes}}
  );

  return response.send( {message: "Comment Liked"}); //updater la collection post avec le nouveau like
});

recordRoutes.route("/update-user").patch(function (req, response) {
  let db_connect = dbo.getDb();
  // let myquery = { _id: ObjectId(req.params.id) };
  const userID = ObjectId(req.body.user_id);

  let newvalues = {
    $set: {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      birthday: req.body.birthday,
      email: req.body.email,
      password: req.body.password,
      location: req.body.location,
      occupation: req.body.occupation,
      },
  };
  db_connect
    .collection("User")
    .updateOne({_id: userID}, newvalues, function (err, res) {
      if (err) throw err;
      console.log("1 document updated");
      response.json(res);
    });
 });

recordRoutes.route("/delete-user").delete((req, response) => {
  let db_connect = dbo.getDb();
  // let myquery = { _id: ObjectId(req.params.id) };
  const userID = ObjectId(req.body.user_id);
  console.log(userID);
  db_connect.collection("User").deleteOne( {_id: userID}, function (err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
    response.json(obj);
  });
 });

 recordRoutes.route("/delete-post").delete((req, response) => {
  let db_connect = dbo.getDb();
  // let myquery = { _id: ObjectId(req.params.id) };
  const postID = ObjectId(req.body.post_id);
  console.log(postID);
  db_connect.collection("Post").deleteOne( {_id: postID}, function (err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
    response.json(obj);
  });
 });

module.exports = recordRoutes;
