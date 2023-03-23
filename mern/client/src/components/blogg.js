import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import "./mainComponent.css";

const Blogg = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch("http://localhost:5000/get-posts");
      const data = await response.json();
      const sortedPosts = data.sort((a, b) => {
        return new Date(b.time_stamp) - new Date(a.time_stamp);
      });
      // Get user initials for each post
      for (const post of sortedPosts) {
        const initials = await getUserInitials(post.user_id);
        post.user_first_initial = initials.firstInitial;
        post.user_last_initial = initials.lastInitial;
      }
      setPosts(sortedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      console.log("Using hard-coded data.");
    }
  };

  const getUserInitials = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/userOfPost/${userId}`);
      const userData = await response.json();
      const firstInitial = userData.UserInfo.first_name.charAt(0);
      const lastInitial = userData.UserInfo.last_name.charAt(0);
      return { firstInitial, lastInitial };
    } catch (error) {
      console.error("Error fetching user data:", error);
      return { firstInitial: "", lastInitial: "" };
    }
  };
  

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
            <div style={{ display: "flex" }}>
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
                  <li key={index}>{comment.text}</li>
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
