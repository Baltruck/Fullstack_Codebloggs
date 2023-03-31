import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Card, Button, Modal, Form } from "react-bootstrap";
import "./mainComponent.css";
import {
  Route,
  Routes,
  useLocation,
  Navigate,
  useNavigate,
} from "react-router-dom";

// Main component
const Main = () => {
  const [initials, setInitials] = useState("");
  const [userInfo, setUserInfo] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const firstName = Cookies.get("first_name");
  const lastName = Cookies.get("last_name");
  const email = Cookies.get("email");
  const [userPosts, setUserPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [totalPosts, setTotalPosts] = useState(0);
  const [lastPostDate, setLastPostDate] = useState("");
  const [likedPosts, setLikedPosts] = useState([]);
  const location = useLocation();
  const userId = location.pathname.split("/")[2];

  const loadUserArticles = async () => {
    console.log("email in loadUserArticles:", email);
    try {
      const response = await fetch("http://localhost:5000/get-articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
        }),
      });
      console.log("Response:", response);
      if (response.ok) {
        const posts = await response.json();
        console.log("Fetched user posts:", posts);
        setUserPosts(posts);
        console.log("posts", posts);
        setTotalPosts(posts.length);
        console.log("totalPosts", totalPosts);

        if (posts.length > 0) {
          const latestPost = posts.reduce((latest, post) => {
            return new Date(post.time_stamp) > new Date(latest.time_stamp)
              ? post
              : latest;
          });

          setLastPostDate(formatDate(latestPost.time_stamp));
        } else {
          setLastPostDate("N/A");
        }
      } else {
        console.error("Error fetching user posts");
      }
    } catch (error) {
      console.error("Error fetching user posts:", error.message);
    }
  };

  // Convert Date to ISO String
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().substring(0, 10);
  };

  //status update
  const handleUpdateStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/status", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          status: newStatus,
        }),
      });

      setLoading(false);
      setShowModal(false);
      setNewStatus("");

      if (response.ok) {
        // update userinfo with new status
        setUserInfo((prevUserInfo) => {
          return {
            ...prevUserInfo,
            status: newStatus,
          };
        });
      } else {
        throw new Error("Error updating status");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error updating status:", error);
    }
  };

  // each post over
  const handlePostClick = (post) => {
    setSelectedPost(post);
    setShowPostModal(true);
  };

  const closeModal = () => {
    setShowPostModal(false);
    setSelectedPost(null);
  };

  // like button
  const handleLikeClick = async (postId) => {
    // Check if user has already liked the post
    if (likedPosts.includes(postId)) {
      return;
    }

    // update the number of likes in the UI
    setUserPosts((prevUserPosts) => {
      const newPosts = prevUserPosts.map((post) => {
        if (post._id === postId) {
          return { ...post, likes: post.likes + 1 };
        }
        return post;
      });
      return newPosts;
    });

    // Add the post to the list of liked posts
    setLikedPosts((prevLikedPosts) => [...prevLikedPosts, postId]);

    // update the number of likes in the database
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

  useEffect(() => {
    fetch("http://localhost:5000/userInfo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
      }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Error fetching user info");
        }
      })
      .then((data) => {
        console.log("data.UserInfo");

        setUserInfo(data.UserInfo);

        if (data.UserInfo._id) {
          const fullName =
            data.UserInfo.first_name + " " + data.UserInfo.last_name;
          const nameParts = fullName.split(" ");

          if (nameParts.length === 2) {
            const firstInitial = nameParts[0].charAt(0).toUpperCase();
            const secondInitial = nameParts[1].charAt(0).toUpperCase();
            const userInitials = `${firstInitial}${secondInitial}`;
            setInitials(userInitials);
            console.log("User initials:", userInitials);
          }

          loadUserArticles();
        }
      })
      .catch((error) => {
        console.error("Error fetching user info:", error);
      });
  }, []);

  useEffect(() => {
    loadUserArticles();
  }, []);

  return (
    <div className="main-container page-container">
      <div className="left-column">
        <div className="initials-container animated-border-initials-container">
          {initials}
        </div>
        <Card className="status-card main-card mainFromLogo animated-border">
          <Card.Body>
            <p className="text-black">Your Status: {userInfo.status}</p>
            <Button
              className="custom-submit-btn"
              onClick={() => setShowModal(true)}
            >
              Update it
            </Button>
          </Card.Body>
        </Card>
        <Modal
          show={showModal}
          onHide={() => setShowModal(false)}
          contentClassName="status-card main-card mainFromLogo animated-border new-status-modal"
        >
          <Modal.Header>
            <Modal.Title>Update Status</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="inside-post-container" controlId="status">
                <Form.Label className="text-black">New Status</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="custom-close-btn"
              variant="secondary"
              onClick={() => setShowModal(false)}
            >
              Close
            </Button>
            <Button
              className="custom-submit-btn"
              variant="primary"
              onClick={handleUpdateStatus}
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Status"}
            </Button>
          </Modal.Footer>
        </Modal>

        <Card className="info-card main-card mainFromLogo animated-border">
          <Card.Body>
            <p className="text-black">First Name: {userInfo.first_name}</p>
            <p className="text-black">Last Name: {userInfo.last_name}</p>
            <p className="text-black">
              Birthday: {formatDate(userInfo.birthday)}
            </p>
            <p className="text-black">Email: {userInfo.email}</p>
            <p className="text-black">Location: {userInfo.location}</p>
            <p className="text-black">Occupation: {userInfo.occupation}</p>
            <p className="text-black">Total posts: {totalPosts}</p>
            <p className="text-black">
              Last post:{" "}
              {lastPostDate === "N/A" ||
              lastPostDate === null ||
              lastPostDate === undefined ||
              lastPostDate === 0 ||
              userPosts.length === 0
                ? "Never posted"
                : lastPostDate}
            </p>
          </Card.Body>
        </Card>
      </div>
      <div className="right-column">
        <Card className="posts-container-card main-card status-card mainFromLogo animated-border">
          <Card.Body>
            {userPosts.map((post) => (
              <Card key={post._id} className="post-card">
                <Card.Body>
                  <Card.Text className="text-black">{post.content}</Card.Text>
                  <Card.Text className="text-black">
                    {formatDate(post.time_stamp)}
                  </Card.Text>
                  <Card.Text className="text-black">
                    <Button
                      variant="link"
                      onClick={() => handleLikeClick(post._id)}
                    >
                      👍
                    </Button>
                    {post.likes}{" "}
                  </Card.Text>
                  <Card.Text className="text-black">Comments:</Card.Text>
                  <div className="post-comments">
                    {post.comments.map((comment) => (
                      <Card.Text key={comment._id} className="text-black">
                        {comment.content} - {formatDate(comment.times_stamp)}
                        <Button variant="link">👍</Button>
                        {comment.likes}
                      </Card.Text>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            ))}
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Main;
