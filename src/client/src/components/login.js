import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const result = await axios.post('http://localhost:3000/login', {
                email,
                password,
            })

            if (result.status === 200) {
                localStorage.setItem('_id', result.data.user._id);
                console.log(result.data.user._id);
                if (result.data.user.blocked) {
                    alert('You are blocked.')
                    navigate('/login')
                    return;
                }
                localStorage.setItem('user', JSON.stringify(result.data.user));	
                navigate('/');
            }
        } catch (err) {
            if (err.response.status === 404) {
                alert('There is no such user')
                navigate('/login')
            }
        }
    }
    return (
        <Row className='justify-content-md-center align-middle' lg={4}>
            <Col className="" md={4}>
                <Form>
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
                        <Form.Check type="checkbox" label="Remember me" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Button variant="primary" type="Sign in" onClick={handleSubmit}>
                            Sign in
                        </Button>
                        <a href="#!">Forgot password?</a>
                    </Form.Group>
                </Form>
            </Col>
        </Row>
    );
}

export default Login;