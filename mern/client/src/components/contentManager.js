import React, { useEffect, useState } from "react";
import { Card, Button } from "react-bootstrap";
import "./mainComponent.css";
// import DateRangePicker from "react-bootstrap-daterangepicker";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'


const ContentManager = () => {
  const [posts, setPosts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });
  const [dateFrom, setDateFrom] = useState("1970-01-01");
  const [dateTo, setDateTo] = useState(new Date().toISOString().slice(0, 10));

  useEffect(() => {
    fetchPosts();
  }, []);

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

  // Delete post
  const handleDeletePost = async (postId) => {
    try {
      const response = await fetch("http://localhost:5000/delete-post", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ post_id: postId }),
      });
      const data = await response.json();
      console.log("Post deleted:", data);
      // Refresh posts
      fetchPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleDateFromChange = (event) => {
    setDateFrom(event.target.value);
  };

  const handleDateToChange = (event) => {
    setDateTo(event.target.value);
  };

  const showAll = (event) => {
    setDateFrom("1970-01-01");
    setDateTo(new Date().toISOString().slice(0, 10));
  };

  return (
    <div className="blogg-container page-container">
      <div className="date">
        <input
          id="dateFrom"
          type="date"
          value={dateFrom}
          onChange={handleDateFromChange}
        />
        <input
          id="dateTo"
          type="date"
          value={dateTo}
          onChange={handleDateToChange}
        />
        <button onClick={showAll}>Show All</button>
      </div>
      <Skeleton count={posts.length} />
      {posts
        .filter((post) => {
          const postDate = new Date(post.time_stamp);
          const fromDate = new Date(dateFrom);
          const toDate = new Date(dateTo);
          return (postDate >= fromDate && postDate <= toDate);
        })
        .map((post) => (
          <Card
            key={post.id || post._id}
            className="blogg-card status-card mainFromLogo animated-border"
          >
            <Card.Body>
              <div style={{ display: "flex" }}>
                <div className="user-initials small-initials-container animated-border-initials-container">
                  {post.user_first_initial}
                  {post.user_last_initial}
                </div>
                <div className="inside-post-container">
                  <Card.Text className="text-black">{post.content}</Card.Text>
                  <Card.Text className="text-black">
                    Post date: {formatDate(post.time_stamp)}
                  </Card.Text>
                </div>
                <div style={{ marginLeft: "auto" }}>
                  <Button
                    variant="danger"
                    onClick={() => handleDeletePost(post._id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
              <Card.Text className="text-black">
                {post.likes}{" "}
                <span
                  role="img"
                  aria-label="thumbs up"
                  // onClick={() => handleLikeClick(post._id)}
                  style={{ cursor: "pointer" }}
                >
                  👍
                </span>
              </Card.Text>
              <div className="inside-post-container">
                <Card.Text className="text-black">Comments:</Card.Text>
                <div className="post-comments">
                  {post.comments.map((comment) => (
                    <Card.Text key={comment._id} className="text-black">
                      {comment.content}
                      <br />
                      {formatDate(comment.times_stamp)}
                      <Button
                        variant="link"
                        // onClick={() => handleCommentLikeClick(comment._id)}
                      >
                        👍
                      </Button>
                      {comment.likes}
                    </Card.Text>
                  ))}
                </div>
              </div>
            </Card.Body>
            <button>Delete</button>
          </Card>
        ))}
    </div>
  );
};

export default ContentManager;
