import React, { useState } from "react";
import { Modal, Button, Form, Card } from "react-bootstrap";
import "./mainComponent.css"; 
import Cookies from 'js-cookie';

const NewPost = ({ show, handleClose, handleSubmit }) => {
    const [postContent, setPostContent] = useState('');
  
    const handlePostSubmit = async () => {
      const userEmail = Cookies.get('email');
  
      try {
        const response = await fetch('http://localhost:5000/new-article', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: userEmail,
            content: postContent,
          }),
        });
  
        if (response.ok) {
          console.log('Post submitted successfully');
          setPostContent('');
          handleClose();
        } else {
          console.log('Error submitting post');
        }
      } catch (error) {
        console.error('Error submitting post:', error);
      }
    };

    if (!show) {
        return null;
      }
  

      return (
        <div className="new-post-container">
          <Card className="main-card status-card mainFromLogo animated-border">
            <Card.Header>
              <Card.Title className="modal-text-title">Blogg Something!</Card.Title>
            </Card.Header>
            <Card.Body>
              <Form>
                <Form.Group className="inside-post-container">
                  <Form.Label className="text-black">Content</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                  />
                </Form.Group>
              </Form>
              <div className="new-post-buttons">
                <Button variant="secondary" onClick={handleClose} className="custom-close-btn">
                  Close
                </Button>
                <Button variant="primary" onClick={handlePostSubmit} className="custom-submit-btn">
                  Submit
                </Button>
              </div>
            </Card.Body>
          </Card>
        </div>
      );
    };
    
    export default NewPost;