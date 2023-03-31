import React, { useEffect, useState } from "react";
import { Card, Button, Modal } from "react-bootstrap";
import "./mainComponent.css";
import Skeleton from "react-loading-skeleton";
import "./Skeleton.css";


const ContentManager = () => {
  const [posts, setPosts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const [postPerPage] = useState(10);
  const [dateFrom, setDateFrom] = useState("1970-01-01");
  const [dateTo, setDateTo] = useState(new Date().toISOString().slice(0, 10));
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);


  //calculate index of last post and first post
  const indexOfLastPost = (currentPage + 1) * resultsPerPage;
  const indexOfFirstPost = indexOfLastPost - resultsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  //generate page number
  const generatePageNumbers = () => {
    const totalPages = Math.ceil(posts.length / resultsPerPage);
    const pageNumbers = [];
    for (let i = 0; i < totalPages; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  //change number of results per page
  const handleResultsPerPageChange = (event) => {
    setResultsPerPage(parseInt(event.target.value));
    setCurrentPage(0);
  };

  //change page
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  //Show button for pages
  const pageNumbers = [];
  for (let i = 0; i < Math.ceil(posts.length / postPerPage); i++) {
    pageNumbers.push(i);
  }

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

  const confirmDelete = () => {
    handleDeletePost(postToDelete._id);
    setShowDeleteModal(false);
    setPostToDelete(null);
  };
  
  const closeModal = () => {
    setShowDeleteModal(false);
    setPostToDelete(null);
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

  const PostSkeleton = () => (
    <Card className="mainFromLogo animated-border cm-card flex-container">
      <Card.Body>
        <div style={{ display: "flex" }}>
          <div className="user-initials small-initials-container animated-border-initials-container">
          <Skeleton className="skeleton-circle" circle={true} height={80} width={80} />
          </div>
          <div className="cm-inside-post-container">
            <Card.Text className="text-black">
              <Skeleton className="skeleton-text" />
            </Card.Text>
            <Card.Text className="text-black">
              <Skeleton className="skeleton-text" />
            </Card.Text>
            <Card.Text className="text-black">
              <Skeleton className="skeleton-text" />
            </Card.Text>
            <Card.Text className="text-black">
              <Skeleton className="skeleton-text" width={"60%"} />
            </Card.Text>
          </div>
        </div>
        <div className="button-container">
          <Card.Text className="text-black cm-likes">
            <Skeleton className="skeleton-text" width={"10%"} />
          </Card.Text>
          <Button variant="danger" className="custom-delete-btn um-bot-btn cm-bot-btn">
            <Skeleton width={"100%"} height={"100%"} />
          </Button>
        </div>
        <div className="inside-post-container">
          <Card.Text className="text-black">Comments:</Card.Text>
          <div className="post-comments">
            <Card.Text className="text-black">
              <Skeleton className="skeleton-text" />
            </Card.Text>
            <Card.Text className="text-black">
              <Skeleton className="skeleton-text" />
            </Card.Text>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
  
  
  

  return (
    <div className="cont-man-container">
      <div className="date-bar blogg-card status-card mainFromLogo animated-border blogg-card-mobile">
        <a className="text-date">FROM:</a>
        <input
          id="dateFrom"
          type="date"
          value={dateFrom}
          className="date-input"
          onChange={handleDateFromChange}
        />
        <a className="text-date">TO:</a>
        <input
          id="dateTo"
          type="date"
          value={dateTo}
          className="date-input"
          onChange={handleDateToChange}
        />
        <a className="text-date">OR:</a>
        <button className="date-picker-btn" onClick={showAll}>
          All
        </button>
        <a className="text-date2">Posts per page:</a>
        <select
          value={resultsPerPage}
          onChange={handleResultsPerPageChange}
          className="results-per-page-dropdown"
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="30">30</option>
        </select>
      </div>


      {isLoading ? (
  <PostSkeleton />
) : (
      currentPosts
        .filter((post) => {
          const postDate = new Date(post.time_stamp);
          const fromDate = new Date(dateFrom);
          fromDate.setDate(fromDate.getDate() + 1);
          const toDate = new Date(dateTo);
          toDate.setDate(toDate.getDate() + 1);

          return postDate >= fromDate && postDate <= toDate;
        })
        .map((post) => (
          <Card
            key={post.id || post._id}
            className="mainFromLogo animated-border cm-card flex-container"
          >
            <Card.Body>
              <div style={{ display: "flex" }}>
                <div className="user-initials small-initials-container animated-border-initials-container">
                  {post.user_first_initial}
                  {post.user_last_initial}
                </div>
                <div className="cm-inside-post-container">
                  <Card.Text className="text-black">{post.content}</Card.Text>
                  <Card.Text className="text-black">
                    Post date: {formatDate(post.time_stamp)}
                  </Card.Text>
                </div>
              </div>
              <div className="button-container">
              <Card.Text className="text-black cm-likes">
                {post.likes}{" "}
                <span
                  role="img"
                  aria-label="thumbs up"
                  style={{ cursor: "pointer" }}
                >
                  👍
                </span>
              </Card.Text>           
              <Button
  variant="danger"
  className="custom-delete-btn um-bot-btn cm-bot-btn"
  onClick={() => {
    setShowDeleteModal(true);
    setPostToDelete(post);
  }}
>
  Delete
</Button>

                </div>
              <div className="inside-post-container">
                <Card.Text className="text-black">Comments:</Card.Text>
                <div className="post-comments">
                  {post.comments.map((comment) => (
                    <Card.Text key={comment._id} className="text-black">
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
        ))
      )}
      {/* Pagination */}
      <div className="pagination-container">
        {generatePageNumbers().map((pageNumber) => (
          <button
            key={pageNumber}
            className="pagination-btn"
            onClick={() => handlePageChange(pageNumber)}
          >
            {pageNumber + 1}
          </button>
        ))}
      </div>
      <Modal
  show={showDeleteModal}
  onHide={closeModal}
  contentClassName="status-card main-card mainFromLogo animated-border"
  centered
>
  <Modal.Header style={{ border: "0", padding: "1rem 1rem" }}>
    <Modal.Title className="modal-text-title">Confirm delete</Modal.Title>
  </Modal.Header>
  <div className="inside-post-container">
    <Modal.Body
      style={{ border: "0", padding: "1rem 1rem" }}
      className="text-black"
    >
      Are you sure you want to delete this post?
    </Modal.Body>
  </div>
  <Modal.Footer style={{ border: "0", padding: "1rem 1rem" }}>
    <Button
      variant="secondary"
      onClick={closeModal}
      className="custom-close-btn"
    >
      Cancel
    </Button>
    <Button
      variant="danger"
      onClick={confirmDelete}
      className="custom-submit-btn"
    >
      Delete
    </Button>
  </Modal.Footer>
</Modal>

    </div>
  );
};

export default ContentManager;
