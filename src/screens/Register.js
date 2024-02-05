import { useState } from "react";
import { Container, Form, Button, Card, AlertLink } from 'react-bootstrap';
import { useDispatch } from "react-redux";
import { setUser } from "../features/userSlice";
import OTP from "../components/OTP";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [otpError, setOtpError] = useState("");
    const [emailFound, setEmailFound] = useState(false);
    const [otp, setOtp] = useState("");

    const onEmailChange = e => setEmail(e.target.value);
    const onPasswordChange = e => setPassword(e.target.value);
    const onUsernameChange = e => {
        if (/^[a-zA-Z0-9]+$/.test(e.target.value) || e.target.value === "") {
            setUsername(e.target.value)
        }
    };
    const dispatch = useDispatch();

    const checkCredentials = () => {
        setUsernameError("");
        setPasswordError("");
        setEmailError("");
        if (username.length < 4 || username.length > 10) {
            setUsernameError("Username should be of length 4-10");
            return false;
        }
        else if (email === "") {
            setEmailError("Invalid Email");
            return false;
        }
        else if (password.length < 8) {
            setPasswordError("Password must be greater than 7 characters");
            return false;
        }
        return true;
    }

    const Register = async () => {
        const userData = {
            email,
            otp,
        }
        const apiUrl = process.env.REACT_APP_API_URL;
        const response = await fetch(`${apiUrl}/login/verify-otp`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });
        const status = await response.json();
        console.log(status)
        if (status.success) {
            dispatch(setUser({
                username,
                email,
                authenticated: 1,
            }))
            window.location.href = '/home'
        } else if (status.otpInvalid) {
            setOtpError("Invalid OTP.");
        }
    }

    const onRegister = async () => {
        if (!checkCredentials()) return;
        const userData = {
            email: email,
            password: password,
            username: username,
        }
        const apiUrl = process.env.REACT_APP_API_URL;
        const response = await fetch(`${apiUrl}/login/sign-up`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        const status = await response.json();
        if (status.success) {
            setEmailFound(true);
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
        }
    }

    return (
        <div className="body">
            <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
                <Card className="login" style={{ width: '400px', backgroundColor: '#242424' }}>
                    <Card.Body>
                        <Card.Title className="text-center text-white">Register</Card.Title>
                        <hr style={{ color: 'white' }} />
                        {emailFound ? <OTP otp={otp} setOtp={setOtp} Register={Register} error={otpError} email={email} /> : 
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
                                        Get OTP
                                    </Button>
                                </div>
                            </Form>
                        }
                        {emailFound &&
                            <div className="d-flex justify-content-center">
                                <AlertLink className="text-info" onClick={()=>setEmailFound(false)}>Back</AlertLink>
                            </div>
                        }
                    </Card.Body>
                </Card>
            </Container>
        </div>
    )
}
