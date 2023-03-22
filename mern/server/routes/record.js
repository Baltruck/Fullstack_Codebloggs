const express = require("express");
const {UserModel, PostModel, CommentModel} = require("../db/schemas") //import schemas
const validator = require('validator');
const { v4: uuidv4 } = require('uuid');

// const { ObjectId, Int32 } = require('mongodb');

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
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
  console.log("EMAIL")
  console.log(email)

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

// Our routes
recordRoutes.route("/signup").post( async (req, response) => {
  let db_connect = dbo.getDb();
  const user = new UserModel({
    // _id: req.body._id,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    birthday: req.body.birthday,
    email: req.body.email,
    password: req.body.password,
    status: req.body.status,
    location: req.body.location,
    occupation: req.body.occupation,
    auth_level: req.body.auth_level,
  });
  console.log(user)
  db_connect.collection("User").insertOne(user, function (err, res) {
    if (err) throw err;
    response.json(res);
  });
});

recordRoutes.route("/login").post( async (req, res) => {
  let db_connect = dbo.getDb();
  const {email, password} = req.body;
  const user = await db_connect.collection("User").findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "No user found" });
  } else if ( user && password !== user.password) {
    return res.status(400).json({ message: "Wrong password" });
  }
  await db_connect.collection("Session").deleteMany({ ["user.email"]: user.email });
  const session_token = uuidv4();
  const session = { session_id: session_token,
     user: {first_name: user.first_name, last_name: user.last_name, birthday: user.birthday, email: user.email, password: user.password, status: user.status, location: user.location, occupation: user.occupation, auth_level: user.auth_level},
      session_date: new Date() };
  await db_connect.collection("Session").insertOne(session);
  return res.send({message: "Login Successful", User: session});
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

// });
//OLD
// recordRoutes.route("/status").patch( async (req, response ) => {
//   let db_connect = dbo.getDb();
//   const session_id = req.body.session_id;
//   // const session_id = req.query.session_id; //token from the front end
//   const statusUpdate = req.body.status;
//   const user = await db_connect.collection("Session").findOne( {session_id: session_id});
//   console.log(user.user.status);
//   if (!user) {
//     return response.status(400).json({ message: "No user found" });
//   }else if (user) {
//     // user.user.status = statusUpdate;
//     await db_connect.collection("Session").updateOne(
//       { session_id: session_id },
//       { $set: { "user.status": statusUpdate } }
//     );
//     response.send( {message: "Status Updated"});
//     }
  
// });

recordRoutes.route("/status").patch(async (req, response) => {
  let db_connect = dbo.getDb();
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const statusUpdate = req.body.status;

  const user = await db_connect.collection("User").findOne({ first_name: first_name, last_name: last_name });
  // console.log(user.status);

  if (!user) {
    return response.status(400).json({ message: "No user found" });
  } else {
    await db_connect.collection("User").updateOne(
      { first_name: first_name, last_name: last_name },
      { $set: { "status": statusUpdate } }
    );
    response.send({ message: "Status Updated" });
  }
});

recordRoutes.route("/new-article").post( async (req, response ) => {
  let db_connect = dbo.getDb();
  const userEmail = req.body.email;
  const content = req.body.content;
  const user = await db_connect.collection("User").findOne({ email: userEmail });
  // console.log(user.user);
  const currentDate = new Date();
  // const hours = currentDate.getHours();
  // const minutes = currentDate.getMinutes();
  // const seconds = currentDate.getSeconds();
  // const timeString = `${hours}:${minutes}:${seconds}`;

  const article = new PostModel({
    content: content,
    user_id: user,
    time_stamp: currentDate,
  });
  // console.log(article)
  db_connect.collection("Post").insertOne(article, function (err, res) {
    if (err) throw err;
    response.send(res);
  });
});

recordRoutes.route("/get-articles").get( async (req, response) => {//returns user's post
  let db_connect = dbo.getDb("CodeBlogg");
  // const user_id = ObjectId(req.body.user_id);
  const userEmail = req.body.email;
  const usersPost = await db_connect
  .collection("Post")
  .find({ ["user_id.email"]: userEmail })
  .toArray(function (err, result)
   {if (err) throw err;
    response.json(result);});
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

recordRoutes.route("/new-comment").post( async (req, response ) => {

  let db_connect = dbo.getDb();

  //Post commented on
  const post_id = ObjectId(req.body.post_id);
  // const post_id = req.query.post_id; //token from the front end
  //User making the comment
  const userEmail = req.body.email;
  // const session_id = req.query.session_id; //token from the front end

  const user = await db_connect.collection("User").findOne( {email: userEmail});
  console.log("USER");
  console.log(user);

  const post = await db_connect.collection("Post").findOne( {_id: post_id});
  console.log("POST content");
  console.log(post);

  if (!post || !user) {
    return response.status(400).json({ message: "Invalid request" });
  }

  const userId = user;
  const postId = post;
  // console.log("UserId");
  // console.log(userId);
  // console.log("PostId");
  // console.log(postId);

  const currentDate = new Date();
  // const hours = currentDate.getHours();
  // const minutes = currentDate.getMinutes();
  // const seconds = currentDate.getSeconds();
  // const timeString = `${hours}:${minutes}:${seconds}`;

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
  //add the comment to the db
  await db_connect.collection("Comment").insertOne(comment, function (err, res) {
      if (err) throw err;
      response.send( {res});
    });
    

});

// recordRoutes.route("/get-comments").get( async (req, res) => { //in the posts
//   let db_connect = dbo.getDb("CodeBlogg");
//   db_connect
//     .collection("Comment")
//     .find({}) //add the user _id and the post _id {user._id: ..., post._id: ...}
//     .toArray(function (err, result) {
//       if (err) throw err;
//       res.json(result);
//     });
  
// });

//fetch userobject, postobject for now
//OLD
// recordRoutes.route("/userInfo").post(async (req, response) => {
//   let db_connect = dbo.getDb();
//   const session_id = req.body.session_id;
//   const sessionCursor = await db_connect.collection("Session").find({ session_id: session_id });
//   const sessionArray = await sessionCursor.toArray();
//   if (sessionArray.length === 0) {
//     return response.status(400).json({ message: "Invalid session" });
//   }
//   response.send({ UserInfo: sessionArray[0].user });
// });

//NEW
recordRoutes.route("/userInfo").get(async (req, response) => {//change to get
  let db_connect = dbo.getDb();
  const userEmail = req.body.email;
  const user = await db_connect.collection("User").findOne({ email: userEmail });
  if (!user) {
    console.log('User not found'); // Log user not found
    return response.status(404).json({ message: "User not found" });
  }
  response.send({ UserInfo: user });
});

recordRoutes.route("/like").patch( async (req, response) => {

    let db_connect = dbo.getDb();
    const post_id = ObjectId(req.body.post_id);
    const comment_id = ObjectId(req.body.comment_id);

    // const likes = req.body.likes;
    const post = await db_connect.collection("Post").find( {_id: post_id}); 
    if (!post) {
      return response.status(400).json({ message: "Invalid Post" });
    }
    await db_connect.collection("Post").updateOne(
      { _id: post_id},
      { $inc: { likes: 1 } }
      );

    const updatedPost = await db_connect.collection("Post").findOne({_id: post_id});

    //update the comment collection with the new likes
    await db_connect.collection("Comment").updateOne(
      {_id: comment_id, "post_id._id": post_id._id},
      {$set: {"post_id.likes": updatedPost.likes}}
    );
    
    response.send( {message: "Post  Liked"});
      
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

  // console.log(post.comments[0]._id)
  // console.log(post.comments.length); //5

  // for (let i = 0; i < post.comments.length; i++) {
  //   if (comment_id.equals(post.comments[i]._id)) {
  //     // console.log("Comment found!!!");
  //     // console.log("DB COMMENT");
  //     // console.log(post.comments[i]._id);
  //     await db_connect.collection("Post").updateOne(
  //       {},
  //       { $inc: { likes: 1 } });
  //     return response.send({ message: "Comment Liked" });
  //   }
  // }
  
  return response.send({ message: "Comment not liked" });
  });


// recordRoutes.route("/userInfo").post( async (req, response) => {//change to get
//   let db_connect = dbo.getDb();
//   const session_id = req.body.session_id;
//   // const session_id = req.query.session_id; //token from the front end
//   // const user = await db_connect.collection("Session").findOne( {session_id: session_id});
//   // console.log(user);
//   const post = await db_connect.collection("Post").find( {["user_id.session_id"]: session_id}); //already includes the user
//   // console.log("POST content")
//   // console.log(post.content);
//   if (!post) {
//     return response.status(400).json({ message: "Invalid session" });
//   }
//   response.send({UserInfo: post});
// });


// // This section will help you get a list of all the records.
// recordRoutes.route("/record").get(function (req, res) {
//   let db_connect = dbo.getDb("employees");
//   db_connect
//     .collection("records")
//     .find({})
//     .toArray(function (err, result) {
//       if (err) throw err;
//       res.json(result);
//     });
// });

// // This section will help you get a single record by id
// recordRoutes.route("/record/:id").get(function (req, res) {
//   let db_connect = dbo.getDb();
//   let myquery = { _id: ObjectId( req.params.id )};
//   db_connect
//       .collection("records")
//       .findOne(myquery, function (err, result) {
//         if (err) throw err;
//         res.json(result);
//       });
// });

// // This section will help you create a new record.
// recordRoutes.route("/record/add").post(function (req, response) {
//   let db_connect = dbo.getDb();
//   let myobj = {
//     name: req.body.name,
//     position: req.body.position,
//     level: req.body.level,
//   };
//   db_connect.collection("records").insertOne(myobj, function (err, res) {
//     if (err) throw err;
//     response.json(res);
//   });
// });

// // This section will help you update a record by id.
// recordRoutes.route("/update/:id").post(function (req, response) {
//   let db_connect = dbo.getDb();
//   let myquery = { _id: ObjectId( req.params.id )};
//   let newvalues = {
//     $set: {
//       name: req.body.name,
//       position: req.body.position,
//       level: req.body.level,
//     },
//   };
//   db_connect
//     .collection("records")
//     .updateOne(myquery, newvalues, function (err, res) {
//       if (err) throw err;
//       console.log("1 document updated");
//       response.json(res);
//     });
// });

// // This section will help you delete a record
// recordRoutes.route("/:id").delete((req, response) => {
//   let db_connect = dbo.getDb();
//   let myquery = { _id: ObjectId( req.params.id )};
//   db_connect.collection("records").deleteOne(myquery, function (err, obj) {
//     if (err) throw err;
//     console.log("1 document deleted");
//     response.json(obj);
//   });
// });

module.exports = recordRoutes;
