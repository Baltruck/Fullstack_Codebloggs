import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Card, Button, Modal, Form } from "react-bootstrap";
import "./mainComponent.css";

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

  //Get all Post by user
  console.log("Calling loadUserArticles");
  const loadUserArticles = async () => {
    console.log("email in loadUserArticles:", email); 
    try {
      const response = await fetch("http://localhost:5000/get-articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      });
      console.log("Response:", response);
      if (response.ok) {
        const posts = await response.json();
        console.log("Fetched user posts:", posts);
        setUserPosts(posts);
        console.log("posts", posts);
        setTotalPosts(posts.length);
        console.log("totalPosts", totalPosts)

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
          email: email,
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
        // put error message here
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
  const handleLikeClick = async () => {
    // Check if user has already liked the post
    if (likedPosts.includes(selectedPost._id)) {
      return;
    }

    // update the number of likes in the UI
    setSelectedPost((prevSelectedPost) => {
      return { ...prevSelectedPost, likes: prevSelectedPost.likes + 1 };
    });

    // Add the post to the list of liked posts
    setLikedPosts((prevLikedPosts) => [...prevLikedPosts, selectedPost._id]);

    // update the number of likes in the database
    // Check avec backend pour savoir comment mettre à jour les likes
    const updateLikesURL = `http://localhost:5000/like/${selectedPost._id}`;
    try {
      const response = await fetch(updateLikesURL, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ likes: selectedPost.likes + 1 }),
      });

      if (!response.ok) {
        throw new Error("Error updating likes");
      }
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  useEffect(() => {
    const userName = Cookies.get("userName");
    if (userName) {
      const nameParts = userName.split(" ");

      if (nameParts.length === 2) {
        const firstInitial = nameParts[0].charAt(0).toUpperCase();
        const secondInitial = nameParts[1].charAt(0).toUpperCase();
        const userInitials = `${firstInitial}${secondInitial}`;
        setInitials(userInitials);
        console.log("User initials:", userInitials);
      }
    }
    console.log("firstName:", firstName);
console.log("lastName:", lastName);
console.log("email:", email);

    if (firstName && lastName) {
      fetch("http://localhost:5000/userInfo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
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
          setUserInfo(data.UserInfo);

          if (data.UserInfo.user_id) {
            loadUserArticles();
          }
        })
        .catch((error) => {
          console.error("Error fetching user info:", error);
        });
    }
  }, []);

  useEffect(() => {
    loadUserArticles();
  }, []);

  return (
    <div className="main-container">
      <div className="left-column">
        <div className="initials-container animated-border-initials-container">
          {initials}
        </div>
        <Card className="status-card mainFromLogo animated-border">
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
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Update Status</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="status">
                <Form.Label>New Status</Form.Label>
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
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={handleUpdateStatus}
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Status"}
            </Button>
          </Modal.Footer>
        </Modal>

        <Card className="info-card mainFromLogo animated-border">
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
        <Card className="posts-container-card status-card mainFromLogo animated-border">
          <Card.Body>
            {userPosts.map((post) => (
              <Card
                key={post._id}
                className="post-card"
                // onClick={() => handlePostClick(post)}
              >
                <Card.Body>
                <pre>{JSON.stringify(post.content, null, 2)}</pre>
                  </Card.Body>
              </Card>
            ))}
          </Card.Body>
        </Card>
      </div>
      {selectedPost && (
        <Modal show={showPostModal} onHide={closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>Post Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Card className="post-details-card mainFromLogo animated-border">
              <Card.Body>
              <Card.Text>{selectedPost.content.text}</Card.Text>

                <Card.Text>
                  Timestamp: {formatDate(selectedPost.time_stamp)}
                </Card.Text>
                <Card.Text>
                  Likes: {selectedPost.likes}{" "}
                  <span
                    role="img"
                    aria-label="thumbs up"
                    onClick={handleLikeClick}
                    style={{ cursor: "pointer" }}
                  >
                    👍
                  </span>
                </Card.Text>
                <Card.Text>Comments:</Card.Text>
                <ul>
                  {selectedPost.comments.map((comment, index) => (
                    <li key={index}>{comment}</li>
                  ))}
                </ul>
              </Card.Body>
            </Card>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default Main;
