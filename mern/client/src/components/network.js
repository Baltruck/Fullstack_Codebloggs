import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import "./mainComponent.css"; 
import { users as HardCodedUsers, Post as HardCodedPosts } from "./hardCoding";

const Network = () => {
    const [userList, setUserList] = useState([]);
  
    useEffect(() => {
      // remplacer cette ligne par un appel à l'API /get-all/users
      setUserList(HardCodedUsers);
    }, []);
  
    const findLatestPost = (userId) => {
      const userPosts = HardCodedPosts.filter((post) => post.user_id === userId);
      if (userPosts.length > 0) {
        userPosts.sort((a, b) => new Date(b.time_stamp) - new Date(a.time_stamp));
        return userPosts[0];
      }
      return null;
    };

    return (
        <div className="network-container">
          {userList.map((user) => {
            const latestPost = findLatestPost(user.id);
            return (
              <Card key={user.id} className="user-card status-card mainFromLogo animated-border">
                <Card.Body>
                    <div style={{ display: "flex" }} >
              <div className="user-initials small-initials-container animated-border-initials-container">
                {user.first_name.charAt(0).toUpperCase()}
                {user.last_name.charAt(0).toUpperCase()}
              </div>
              <div className="user-info inside-post-container">
                <Card.Text className="text-black text-center">{user.first_name} {user.last_name}</Card.Text>
                <Card.Text className="text-black text-center">Birthday: {user.birthday}</Card.Text>
                <Card.Text className="text-black text-center">Email: {user.email}</Card.Text>
                <Card.Text className="text-black text-center">Location: {user.location}</Card.Text>
                <Card.Text className="text-black text-center">Occupation: {user.occupation}</Card.Text>
              </div>
              </div>
              <div className="user-status inside-post-container">
                <Card.Text className="text-black text-center"> {user.status}</Card.Text>
              </div>
              {latestPost && (
                <div className="latest-post inside-post-container">
                  <Card.Text className="text-black text-center">Last Post: {latestPost.content}</Card.Text>
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


