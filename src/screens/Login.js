import { useState } from "react";
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import '../public/Login.css';
import { useDispatch } from "react-redux";
import { setUser } from "../features/userSlice";

export default function Login() {
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const onPasswordChange = e => setPassword(e.target.value);
    const onUsernameChange = e => setUsername(e.target.value);
    const dispatch = useDispatch();

    const checkCredentials = () => {
        setUsernameError("");
        setPasswordError("");
        if (username.length < 1) {
            setUsernameError("Invalid Username");
            return false;
        }
        else if (password.length < 1) {
            setPasswordError("Invalid Password");
            return false;
        }
        return true;
    }


    const onLogin = async () => {
        if (!checkCredentials()) return;
        const userData = {
            password: password,
            username: username,
        }
        const apiUrl = process.env.REACT_APP_API_BASE_URL;
        const response = await fetch(apiUrl+"/login/sign-in", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        const status = await response.json();
        if (status.success) {
            dispatch(setUser({
                username: username,
                email: status.email,
                authenticated: 1,
            }))
            window.location.href = '/home'
        }
        if (!status.success) {
            if (status.incorrectPassword) {
                setPasswordError('Incorrect password');
            }
            else if (status.noUserFound) {
                setUsernameError('No user found');
            }
        }
    }

    return (
        <div className="body">
            <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
                <Card className="login" style={{ width: '300px', backgroundColor: '#242424' }}>
                    <Card.Body>
                        <Card.Title className="text-center text-white">Login</Card.Title>
                        <hr style={{ color: 'white' }} />
                        <Form className="text-white">
                            <Form.Group className="m-4" controlId="formUsername">
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    type="text"
                                    className="text-light bg-dark"
                                    placeholder="Username"
                                    value={username}
                                    onChange={onUsernameChange}
                                    isInvalid={!!usernameError}
                                />
                                <Form.Control.Feedback type="invalid">{usernameError}</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="m-4" controlId="formPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    className="text-light bg-dark"
                                    placeholder="Password"
                                    value={password}
                                    onChange={onPasswordChange}
                                    isInvalid={!!passwordError}
                                />
                                <Form.Control.Feedback type="invalid">{passwordError}</Form.Control.Feedback>
                            </Form.Group>

                            <div className="d-flex justify-content-center m-4">
                                <Button variant="success" style={{ width: '100%' }} onClick={onLogin}>
                                    Sign in
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    )
}