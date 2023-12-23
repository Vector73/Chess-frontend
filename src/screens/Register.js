import { useState } from "react";
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { useDispatch } from "react-redux";
import { setUser } from "../features/userSlice";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [emailError, setEmailError] = useState("");

    const onEmailChange = e => setEmail(e.target.value);
    const onPasswordChange = e => setPassword(e.target.value);
    const onUsernameChange = e => setUsername(e.target.value);
    const dispatch = useDispatch();

    const checkCredentials = () => {
        setUsernameError("");
        setPasswordError("");
        setEmailError("");
        if (username.length < 1) {
            setUsernameError("Invalid Username");
            return false;
        }
        else if (email === "") {
            setEmailError("Invalid Email");
            return false;
        }
        else if (password.length < 1) {
            setPasswordError("Invalid Password");
            return false;
        }
        return true;
    }


    const onRegister = async () => {
        if (!checkCredentials()) return;
        const userData = {
            email: email,
            password: password,
            username: username,
        }
        const apiUrl = process.env.REACT_APP_BASE_URL;
        const response = await fetch(apiUrl+"/login/sign-up", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        const status = await response.json();
        if (status.success) {
            dispatch(setUser({
                username,
                email,
                authenticated: 1,
            }))
            window.location.href = '/home'
        }
        if (!status.success) {
            if (status.emailExists) {
                setEmailError('This account already exists');
            }
            else if (status.usernameExists) {
                setUsernameError('This username already exists');
            }
            else if (status.emailNotValid) {
                setEmailError('Email not valid');
            }
            alert('Registration Failed');
        }
    }

    return (
        <div className="body">
            <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
                <Card className="login" style={{ width: '400px', backgroundColor: '#242424' }}>
                    <Card.Body>
                        <Card.Title className="text-center text-white">Register</Card.Title>
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

                            <Form.Group className="m-4" controlId="formEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="text"
                                    className="text-light bg-dark"
                                    placeholder="Email"
                                    value={email}
                                    onChange={onEmailChange}
                                    isInvalid={!!emailError}
                                />
                                <Form.Control.Feedback type="invalid">{emailError}</Form.Control.Feedback>
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
                                <Button variant="success" style={{ width: '100%' }} onClick={onRegister}>
                                    Sign up
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    )
}
