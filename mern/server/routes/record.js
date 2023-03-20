const express = require("express");
const {UserModel} = require("../db/schemas") //import schemas
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
  
}

const createSession = async (req, res, next) => {
  let db_connect = dbo.getDb();
  const {email, password} = req.body;
  const user = await db_connect.collection("User").findOne({ email });

  // await db_connect.collection("Session").deleteMany({ user: user.email });

  const session_token = uuidv4();
  const session = { session_id: session_token,
     user: {first_name: user.first_name, last_name: user.last_name, birthday: user.birthday, email: user.email, password: user.password, status: user.status, location: user.location, occupation: user.occupation, auth_level: user.auth_level},
      session_date: new Date() };

  await db_connect.collection("Session").insertOne(session);
  
  next();
}

// Middleware Uses
recordRoutes.use("/signup", emailValidator);
recordRoutes.use("/login", createSession);

// Our routes
recordRoutes.route("/signup").post(async (req, response) => {
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
  console.log(user)

  if (!user) {
    return res.status(400).json({ message: "No user found" });
  } else if ( user && password !== user.password) {
    return res.status(400).json({ message: "Wrong password" });
  }
  return res.send({message: "Login Successful"})

});

recordRoutes.route("/logout").get( async (res, req) => {
  
});

// recordRoutes.route("/new-article").post( async (req, res ) => {
//   let db_connect = dbo.getDb();
//   const userId = "caca";
//   const article = new PostModel({
//     content: req.body.content,
//     user_id: userId,
//     likes: req.body.likes,
//     time_stamp: req.body.time_stamp,
//     comments: req.body.comments,
//   });
//   console.log(user)
//   db_connect.collection("Post").insertOne(article, function (err, res) {
//     if (err) throw err;
//     response.json(res);
//   });

// })

// recordRoutes.route("/new-comment").post( async (req, res ) => {
//   let db_connect = dbo.getDb();
//   const userId = "caca";
//   const postId = 1;
//   const comment = new CommentModel({
//     content: req.body.content,
//     user_id: userId,
//     post_id: postId,
//     time_stamp: req.body.time_stamp,
//   });
//   console.log(user)
//   db_connect.collection("Comment").insertOne(comment, function (err, res) {
//     if (err) throw err;
//     response.json(res);
//   });

// })

// recordRoutes.route("/session").post( async (req, res ) => {
//     let db_connect = dbo.getDb();
//   let myobj = {
//     name: req.body.name,
//     position: req.body.position,
//     level: req.body.level,
//   };
//   db_connect.collection("Session").insertOne(myobj, function (err, res) {
//     if (err) throw err;
//     response.json(res);
//   });
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
