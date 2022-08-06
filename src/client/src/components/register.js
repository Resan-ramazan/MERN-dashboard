import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router';

function Register() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await axios.post('http://localhost:3000/register', {
      email,
      password,
      name,
    })
    if (result.status === 201) {
      localStorage.setItem('_id', result.data.user._id);
      navigate('/');
    }
  }

  return (
    <Row className='justify-content-md-center align-middle' lg={4}>
      <Col className="" md={4}>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control onChange={(e) => { setName(e.target.value) }} type="text" placeholder="Enter your name" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control onChange={(e) => { setEmail(e.target.value) }} type="email" placeholder="Enter email" />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control onChange={(e) => { setPassword(e.target.value) }} type="password" placeholder="Password" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check onChange={(e) => { setKeepLoggedIn(e.target.value) }} type="checkbox" label="Check me out" />
          </Form.Group>
          <Button variant="primary" type="submit" onClick={handleSubmit}>
            Submit
          </Button>
        </Form>
        <div className='mb-3'>
          <p>Already have an account? <a href="/login">Login</a></p>
        </div>
      </Col>
    </Row>
  );
}

export default Register;