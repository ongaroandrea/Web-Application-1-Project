import { useState } from 'react';
import { Alert, Button, Col, Form, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import PropTypes from "prop-types";


export default function LoginForm(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [show, setShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const credentials = { username, password };

    props.login(credentials)
      .then ( () => navigate( "/" ) )
      .catch( (err) => {
        if(err.message === "Unauthorized")
          setErrorMessage("Username o password errati. Riprova.");
        else
          setErrorMessage(err.message);
        setShow(true);
      });
  };

  return (
    <Row className="mt-3 vh-100 justify-content-md-center">
      <Col md={4} >
        <h1 className="pb-3">Login</h1>
        <Form onSubmit={handleSubmit}>
          <Alert
                dismissible
                show={show}
                onClose={() => setShow(false)}
                variant="danger">
                {errorMessage}
          </Alert>
          <Form.Group className="mb-3" controlId="username">
            <Form.Label>username</Form.Label>
            <Form.Control
              type="text"
              value={username} placeholder="Example: mario_rossi"
              onChange={(ev) => setUsername(ev.target.value)}
              required={true}
            />
          </Form.Group>
            <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password} placeholder="Enter the password."
              onChange={(ev) => setPassword(ev.target.value)}
              required={true} minLength={4}
              />
          </Form.Group>
          <Button className="mt-3" type="submit">Login</Button>
        </Form>
      </Col>
    </Row>
  )
}

LoginForm.propTypes = {
  login: PropTypes.func,
}

