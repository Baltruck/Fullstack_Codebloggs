import React, { useState } from 'react';
import { Card, Form, Button, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './customStyle.css';
// import { format } from 'date-fns';
// import { DayPicker } from 'react-day-picker';
// import Calendar from 'react-calendar';

const Register = () => {
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('');
  const [occupation, setOccupation] = useState('');
//   const [status, setStatus] = useState('');
//   const [auth_level, setAuthLevel] = useState('');

    

  const handleSubmit = (e) => {
    e.preventDefault();
    
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className="register-card mainFromLogo animated-border">
        <Card.Body>
          <Card.Title className="text-center  card-title dusterA">Register</Card.Title>
          <Form onSubmit={handleSubmit}>
          <Row>
              <Col>
                <Form.Group controlId="first_name" className="form-field">
                    <Form.Control
                        required
                        type="first_name"
                        placeholder="First Name"
                        value={first_name}
                        onChange={(e) => setFirstName(e.target.value)}
                />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="last_name" className="form-field">
                    <Form.Control
                        required
                        type="last_name"
                        placeholder="Last Name"
                        value={last_name}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </Form.Group> 
                </Col>
          </Row>
          <Row>
            <Col>     
                <Form.Group controlId="email" className="form-field">
                    <Form.Control
                        required
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Form.Group>
            </Col>  
            <Col>
                <Form.Group controlId="birthday" className="form-field">
                    <Form.Control
                        required
                        type="birthday"
                        placeholder="Birthday"
                        value={birthday}
                        onChange={(e) => setBirthday(e.target.value)}
                    />
                </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
                <Form.Group controlId="password" className="form-field">
                    <Form.Control
                        required
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>
            </Col>
            <Col>
                <Form.Group controlId="occupation" className="form-field">
                    <Form.Control
                        required
                        type="occupation"
                        placeholder="Occupation"
                        value={occupation}
                        onChange={(e) => setOccupation(e.target.value)}
                    />
                </Form.Group>
            </Col>
          </Row>                                
          <Row>
            <Col> 
                <Form.Group controlId="location" className="form-field">
                    <Form.Control
                        required
                        type="location"
                        placeholder="Location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                </Form.Group>
            </Col>
          </Row>
            <div className="d-flex justify-content-center">
                <Button className="custom-submit-btn" type="submit">
                    Register
                </Button>
            </div>
          </Form>
          <div className="text-center mt-3">
            <Link className="custom-link" to="/register">Have an account? Login now!</Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Register;
