import React, { useState } from 'react';
import { Card, Form, Button, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './login.css';

const Connection = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
  };

  return (
    <Container className="d-flex justify-content-center align-items-center">
      <Card className="connection-card mainFromLogo animated-border">
        <Card.Body>
          <Card.Title className="text-center  card-title">Login</Card.Title>
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
            <Link className="custom-link" to="/register">Not a member? Register now!</Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Connection;
