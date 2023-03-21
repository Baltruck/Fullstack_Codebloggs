import React, { useState } from 'react';
import { Card, Form, Button, Container, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import './customStyle.css';

const Register = () => {
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('');
  const [occupation, setOccupation] = useState('');
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);


    

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        first_name: first_name,
        last_name: last_name,
        email: email,
        password: password,
        location: location,
        occupation: occupation,
        birthday: birthday
      })
    };
    
    const response = await fetch('http://localhost:5000/signup', requestOptions);
    const data = await response.json();
    console.log(data);
  
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
      navigate('/login');
    }, 5000);
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className="register-card mainFromLogo animated-border">
        <Card.Body>
        {showAlert && (
  <div className="alert alert-success alert-text-centered" role="alert">
    Registration completed! Redirecting to login now...
  </div>
)}

          <Card.Title className="text-center  card-title dusterA">Register</Card.Title>
          <Form onSubmit={handleSubmit}>
          <Row>
              <Col>
                <Form.Group controlId="first_name" className="form-field">
                    <Form.Control
                        required
                        maxLength="30"
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
                        maxLength="30"
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
                        pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                    />
                </Form.Group>
            </Col>  
            <Col>
                <Form.Group controlId="location" className="form-field">
                    <Form.Control
                        required
                        maxLength="50"
                        type="location"
                        placeholder="Location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
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
                        maxLength="50"
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
            <Form.Group controlId="birthday" className="form-field">
                  <DatePicker
                    selected={birthday}
                    onChange={(date) => setBirthday(date)}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Choose your birthday"
                    className="date-picker-control"
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
            <Link className="custom-link" to="/login">Have an account? Login now!</Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Register;
