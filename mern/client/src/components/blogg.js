import React, { useEffect, useState } from "react";
import { Card, Button } from "react-bootstrap";
import "./mainComponent.css";

const Blogg = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    fetchPosts();
  }, []);

  // Update "likes" in the UI and db
  const handleLikeClick = async (postId) => {
    setPosts((prevPosts) => {
      const newPosts = prevPosts.map((post) => {
        if (post._id === postId) {
          return { ...post, likes: post.likes + 1 };
        }
        return post;
      });
      return newPosts;
    });

    // Update "likes" in db
    const updateLikesURL = `http://localhost:5000/like`;
    try {
      const response = await fetch(updateLikesURL, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ post_id: postId }),
      });

      if (!response.ok) {
        throw new Error("Error updating likes");
      }
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  // Fetch posts from db
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
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
      console.log("Using hard-coded data.");
    }
  };

  // Get user initials for each post
  const getUserInitials = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/userOfPost/${userId}`
      );
      const userData = await response.json();
      const firstInitial = userData.UserInfo.first_name.charAt(0).toUpperCase();
      const lastInitial = userData.UserInfo.last_name.charAt(0).toUpperCase();
      return { firstInitial, lastInitial };
    } catch (error) {
      console.error("Error fetching user data:", error);
      return { firstInitial: "", lastInitial: "" };
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().substring(0, 10);
  };

  return (
    <div className="blogg-container page-container">
      {posts.map((post) => (
        <Card
          key={post.id || post._id}
          className="blogg-card status-card mainFromLogo animated-border blogg-card-mobile"
        >
          <Card.Body>
            <div
              style={{
                display: "flex",
                flexDirection: window.innerWidth <= 767 ? "column" : "row",
              }}
            >
              <div
                className={`user-initials small-initials-container animated-border-initials-container ${
                  window.innerWidth <= 767
                    ? "user-initials-container-mobile"
                    : ""
                }`}
              >
                {post.user_first_initial}

                {post.user_last_initial}
              </div>
              <div className="inside-post-container">
                <Card.Text className="text-black">{post.content}</Card.Text>
                <Card.Text className="text-black post-date">
                  Post date: {formatDate(post.time_stamp)}
                </Card.Text>
              </div>
            </div>
            <Card.Text className="text-black">
              {post.likes}{" "}
              <span
                role="img"
                aria-label="thumbs up"
                onClick={() => handleLikeClick(post._id)}
                style={{ cursor: "pointer" }}
              >
                👍
              </span>
            </Card.Text>
            <div className="inside-post-container blogg-comments">
              <Card.Text className="text-black post-comments">
                Comments:
              </Card.Text>
              <div className="post-comments">
                {post.comments.map((comment) => (
                  <Card.Text
                    key={comment._id}
                    className="text-black post-comments"
                  >
                    {comment.content}
                    <br />
                    {formatDate(comment.times_stamp)}
                    <Button variant="link">👍</Button>
                    {comment.likes}
                  </Card.Text>
                ))}
              </div>
            </div>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default Blogg;
