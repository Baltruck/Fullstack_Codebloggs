// import React, { useEffect, useState } from "react";
// import { Card } from "react-bootstrap";
// import "./mainComponent.css"; 
// import { Post as HardCodedPosts } from './hardCoding';



// const Blogg = () => {
//     const [posts, setPosts] = useState([]);
  
//     useEffect(() => {
//       fetchPosts();
//     }, []);
  
//     const fetchPosts = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/get-posts");
//         const data = await response.json();
//         const sortedPosts = data.sort((a, b) => {
//           return new Date(b.time_stamp) - new Date(a.time_stamp);
//         });
//         setPosts(sortedPosts);
//       } catch (error) {
//         console.error("Error fetching posts:", error);
//         console.log("Using hard-coded data.");
//         setPosts(HardCodedPosts); 
//       }
//     };
  
//     const formatDate = (dateString) => {
//       if (!dateString) return "";
//       const date = new Date(dateString);
//       return date.toISOString().substring(0, 10);
//     };
  
//     return (
//       <div className="blogg-container">
//         {posts.map((post) => (
//           <Card key={post._id} className="post-card">
//             <Card.Body>
//               <div className="post-initials">
//                 {post.user_first_initial}
//                 {post.user_last_initial}
//               </div>
//               <Card.Text>{post.content}</Card.Text>
//               <Card.Text>Timestamp: {formatDate(post.time_stamp)}</Card.Text>
//               <Card.Text>
//                 Likes: {post.likes}{" "}
//                 <span role="img" aria-label="thumbs up">
//                   👍
//                 </span>
//               </Card.Text>
//               <Card.Text>Comments:</Card.Text>
//               <ul>
//                 {post.comments.map((comment, index) => (
//                   <li key={index}>{comment}</li>
//                 ))}
//               </ul>
//             </Card.Body>
//           </Card>
//         ))}
//       </div>
//     );
//   };
  
//   export default Blogg;
  
//Hard coding
import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import "./mainComponent.css"; 
import { Post as HardCodedPosts , users as HardCodedUsers } from './hardCoding';

const findUserById = (userId) => {
  const user = HardCodedUsers.find((user) => user.id === userId);
  return user;
};


const Blogg = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    setPosts(HardCodedPosts);
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().substring(0, 10);
  };

  return (
    <div className="blogg-container">
      {posts.map((post) => (
        <Card key={post.id || post._id} className="blogg-card status-card mainFromLogo animated-border">
          <Card.Body>
            <div style={{ display: "flex" }} >
              <div className="user-initials small-initials-container animated-border-initials-container">
                {post.user_first_initial}
                {post.user_last_initial}
              </div>
              <div className="inside-post-container">
                <Card.Text className="text-black">{post.content}</Card.Text>
                <Card.Text className="text-black">Post date: {formatDate(post.time_stamp)}</Card.Text>
              </div>
            </div>
            <Card.Text className="text-black">
              {post.likes}{" "}
              <span role="img" aria-label="thumbs up">
                👍
              </span>
            </Card.Text>
            <div className="inside-post-container">
              <Card.Text className="text-black">Comments:</Card.Text>
              <ul>
                {post.comments?.map((comment, index) => (
                  <li key={index}>{comment}</li>
                ))}
              </ul>
            </div>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default Blogg;