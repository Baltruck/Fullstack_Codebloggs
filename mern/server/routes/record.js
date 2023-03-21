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

recordRoutes.route("/status").patch( async (req, response ) => {
  let db_connect = dbo.getDb();
  const session_id = req.body.session_id;
  // const session_id = req.query.session_id; //token from the front end
  const statusUpdate = req.body.status;
  const user = await db_connect.collection("Session").findOne( {session_id: session_id});
  console.log(user.user.status);
  if (!user) {
    return response.status(400).json({ message: "No user found" });
  }else if (user) {
    // user.user.status = statusUpdate;
    await db_connect.collection("Session").updateOne(
      { session_id: session_id },
      { $set: { "user.status": statusUpdate } }
    );
    response.send( {message: "Status Updated"});
    }
  
});

recordRoutes.route("/new-article").post( async (req, response ) => {
  let db_connect = dbo.getDb();
  const session_id = req.body.session_id;
  // const session_id = req.query.session_id; //token from the front end
  const statusUpdate = req.body.status;
  const user = await db_connect.collection("Session").findOne( {session_id: session_id});
  console.log(user);
  const currentDate = new Date();
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  const seconds = currentDate.getSeconds();
  const timeString = `${hours}:${minutes}:${seconds}`;

  const article = new PostModel({
    content: req.body.content,
    user_id: user,
    time_stamp: timeString,
  });
  console.log(article)
  db_connect.collection("Post").insertOne(article, function (err, res) {
    if (err) throw err;
    response.send(res);
  });
});

recordRoutes.route("get-articles").get( async (req, res) => {
  let db_connect = dbo.getDb("CodeBlogg");
  db_connect
    .collection("Post")
    .find({}) //add the user _id
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
  
});

recordRoutes.route("/new-comment").patch( async (req, response ) => {

  let db_connect = dbo.getDb();
  const post_id = ObjectId(req.body.post_id);
  // const post_id = req.query.post_id; //token from the front end
  const session_id = req.body.session_id;
  // const session_id = req.query.session_id; //token from the front end
  const user = await db_connect.collection("Session").findOne( {session_id: session_id});
  console.log("USER");
  console.log(user);

  const post = await db_connect.collection("Post").findOne( {_id: post_id});
  console.log("POST content");
  console.log(post);

  if (!post || !user) {
    return response.status(400).json({ message: "Invalid request" });
  }

  const userId = user; //devrait être la personne qui publie le commentaire
  const postId = post;
  // console.log("UserId");
  // console.log(userId);
  // console.log("PostId");
  // console.log(postId);

  const currentDate = new Date();
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  const seconds = currentDate.getSeconds();
  const timeString = `${hours}:${minutes}:${seconds}`;

  const comment = new CommentModel({
    content: req.body.content,
    user_id: userId,
    post_id: postId,
    time_stamp: timeString,
  });

  console.log(comment);

  await db_connect.collection("Post").updateOne(
    { _id: post_id}, //post._id not userid
    { $push: { comments: comment } }
    );
  response.send( {message: "Comment  Posted"});
  

});

recordRoutes.route("/get-comments").get( async (req, res) => {
  let db_connect = dbo.getDb("CodeBlogg");
  db_connect
    .collection("Comment")
    .find({}) //add the user _id and the post _id {user._id: ..., post._id: ...}
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
  
});

//fetch userobject, postobject for now
recordRoutes.route("/userInfo").post(async (req, response) => {
  let db_connect = dbo.getDb();
  const session_id = req.body.session_id;
  const postCursor = await db_connect.collection("Post").find({ ["user_id.session_id"]: session_id });
  const postArray = await postCursor.toArray();
  if (postArray.length === 0) {
    return response.status(400).json({ message: "Invalid session" });
  }
  response.send({ UserInfo: postArray });
});

recordRoutes.route("/like").patch( async (req, response) => {
  
    let db_connect = dbo.getDb();
    const post_id = ObjectId(req.body.post_id);
    // const session_id = req.query.session_id; //token from the front end
    const post = await db_connect.collection("Post").find( {_id: post_id}); 

    if (!post) {
      return response.status(400).json({ message: "Invalid Post" });
    }

    await db_connect.collection("Post").updateOne(
      { _id: post_id},
      { $inc: { likes: 1 } }
      );
    response.send( {message: "Comment  Liked"});
      

  

})

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
