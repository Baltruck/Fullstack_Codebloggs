import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import "./mainComponent.css";

const Network = () => {
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/get-all-users");
        if (response.ok) {
          const users = await response.json();
          setUserList(users);
        } else {
          console.error("Error fetching users");
        }
      } catch (error) {
        console.error("Error fetching users:", error.message);
      }
    };

    const findLatestPost = async (userId) => {
      const fetchUserPosts = async (userId) => {
        try {
          const response = await fetch("http://localhost:5000/get-articles", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId }),
          });

          if (response.ok) {
            const userPosts = await response.json();
            return userPosts;
          } else {
            console.error("Error fetching user posts");
            return [];
          }
        } catch (error) {
          console.error("Error fetching user posts:", error.message);
          return [];
        }
      };

      const userPosts = await fetchUserPosts(userId);

      if (userPosts.length > 0) {
        userPosts.sort(
          (a, b) => new Date(b.time_stamp) - new Date(a.time_stamp)
        );
        return userPosts[0];
      }

      return null;
    };

    const fetchAllData = async () => {
      setLoading(true);
      await fetchAllUsers();

      // Fetch the latest post for each user and store them in an array
      const latestPostsPromises = userList.map(async (user) => {
        const latestPost = await findLatestPost(user._id);
        return { ...user, latestPost };
      });

      // Wait for all promises to resolve and update the userList with the latest posts
      const usersWithLatestPosts = await Promise.all(latestPostsPromises);
      setUserList(usersWithLatestPosts);
      setLoading(false);
      setDataLoaded(true);
    };

    if (!dataLoaded) {
      fetchAllData();
    }
  }, [userList, dataLoaded]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="network-container page-container">
      {userList.map((user) => {
        return (
          <Card
            key={user._id}
            className="user-card status-card mainFromLogo animated-border blogg-card"
          >
            <Card.Body>
              <div className="user-details">
                <div className="user-initials small-initials-container net-user-initials animated-border-initials-container">
                  {user.first_name.charAt(0).toUpperCase()}
                  {user.last_name.charAt(0).toUpperCase()}
                </div>
                <div className="user-info inside-post-container">
                  <Card.Text className="text-black text-center">
                    {user.first_name} {user.last_name}
                  </Card.Text>
                  <Card.Text className="text-black text-center">
                    Birthday: {user.birthday}
                  </Card.Text>
                  <Card.Text className="text-black text-center">
                    Email: {user.email}
                  </Card.Text>
                  <Card.Text className="text-black text-center">
                    Location: {user.location}
                  </Card.Text>
                  <Card.Text className="text-black text-center">
                    Occupation: {user.occupation}
                  </Card.Text>
                </div>
              </div>
              <div className="user-status inside-post-container">
                <Card.Text className="text-black text-center">
                  {" "}
                  {user.status}
                </Card.Text>
              </div>
              {user.latestPost && (
                <div className="latest-post inside-post-container">
                  <Card.Text className="text-black text-center">
                    Last Post: {user.latestPost.content}
                  </Card.Text>
                </div>
              )}
            </Card.Body>
          </Card>
        );
      })}
    </div>
  );
};

export default Network;
