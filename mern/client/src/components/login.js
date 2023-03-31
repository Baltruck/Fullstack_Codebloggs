import React, { useState } from "react";
import { Card, Form, Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./customStyle.css";
import Cookies from "js-cookie";
import { v4 as uuidv4 } from "uuid";
import { users } from "./hardCoding"; // Import temp data for testing

const Connection = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:5000/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const { message, User: userData } = await response.json();

        // Set the user's name in a cookie
        if (userData && userData.user.first_name && userData.user.last_name) {
          const userName = `${userData.user.first_name} ${userData.user.last_name}`;
          Cookies.set("userName", userName);

          // Set the user's information in cookies
          Cookies.set("userToken", userData.session_id);
          Cookies.set("auth_level", userData.user.auth_level);
          Cookies.set("first_name", userData.user.first_name);
          Cookies.set("last_name", userData.user.last_name);
          Cookies.set("email", userData.user.email);
          Cookies.set("userId", userData.user._id);

          // Redirect the user to the home page
          window.location.replace(`/home/${userData.user._id}`);
        } else {
          alert("User info not found or incorrect");
        }
      } else {
        alert("User info not found or incorrect");
      }
    } catch (error) {
      alert("Error occurred in login process please try again");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100 login-container">
      <Card className="connection-card mainFromLogo animated-border">
        <Card.Body>
          <Card.Title className="text-center  card-title dusterA">
            Login
          </Card.Title>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="email" className="form-field">
              {/* <Form.Label>Email</Form.Label> */}
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="password" className="form-field">
              {/* <Form.Label>Password</Form.Label> */}
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <div className="d-flex justify-content-center">
              <Button className="custom-submit-btn" type="submit">
                Submit
              </Button>
            </div>
          </Form>
          <div className="text-center mt-3">
            <Link className="custom-link" to="/register">
              Not a member? Register now!
            </Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Connection;
