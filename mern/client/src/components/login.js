import React, { useState } from 'react';
import { Card, Form, Button, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './customStyle.css';
import Cookies from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';
import { users } from './hardCoding'; // Import temporaire pour tests


const Connection = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await fetch(`http://localhost:5000/login?email=${email}&password=${password}`);
        
        if (response.ok) {
          const userData = await response.json();
    
          if (userData && userData.first_name && userData.last_name) {
            const userName = `${userData.first_name} ${userData.last_name}`;
            Cookies.set('userName', userName);

            // Generate and set a unique token for the user
          const userToken = uuidv4();
          Cookies.set('userToken', userToken);
          Cookies.set('auth_level', userData.auth_level);
    
            // Redirigez l'utilisateur vers la page d'accueil ou la page souhaitée
            // window.location.replace('/');
          } else {
            // Gérer le cas où l'utilisateur n'a pas été trouvé ou les données sont incorrectes
          }
        } else {
          // Gérer les erreurs HTTP (par exemple, le statut 404, 500, etc.)
        }
      } catch (error) {
        // Gérer les erreurs de réseau ou les erreurs de connexion au serveur
      }
    };
    
  

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className="connection-card mainFromLogo animated-border">
        <Card.Body>
          <Card.Title className="text-center  card-title dusterA">Login</Card.Title>
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
