import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useSelector } from 'react-redux';

export default function Profile({ show, handleClose }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const user = useSelector(state => state.users);
    const [error, setError] = useState('');

    useEffect(() => {
        const apiUrl = process.env.REACT_APP_API_URL;
        fetch(`${apiUrl}/home/profile`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username: user.username })
            },)
            .then(response => response.json())
            .then((data) => {
                if (data.success) {
                    setUsername(data.profile.username);
                    setEmail(data.profile.email);
                    setPassword(data.profile.password);
                } else {
                    alert("Failed to load user profile");
                }
            });
    }, [])

    const handleSave = () => {
        if (password === oldPassword) {
            setPassword(newPassword);
            setError('');
            const args = {
                username: username,
                oldPassword: oldPassword,
                newPassword: newPassword,
            }
            const apiUrl = process.env.REACT_APP_API_URL;
            fetch(`${apiUrl}/home/changePassword`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(args)
                },)
                .then(response => response.json())
                .then((data) => {
                    if (data.success) {
                        handleClose();
                    } else {
                        setError("Invalid Password");
                    }
                });
        } else {
            setError("Invalid Password")
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header className="text-light" style={{ backgroundColor: '#242424' }} closeButton>
                <Modal.Title style={{ margin: '0 auto', marginLeft: '43%' }}>Profile</Modal.Title>
            </Modal.Header>
            <Modal.Body className="bg-dark text-light">
                <Form>
                    <Form.Group controlId="formUsername" className='mb-4 mx-3'>
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled
                            className='bg-dark text-white'
                        />
                    </Form.Group>

                    <Form.Group controlId="formEmail" className='my-4 mx-3'>
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className='bg-dark text-white'
                            disabled
                        />
                    </Form.Group>

                    <Form.Group controlId="formOldPassword" className='my-4 mx-3'>
                        <Form.Label>Old Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter old password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            className='bg-dark text-white'
                            isInvalid={!!error}
                        />
                        <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="formNewPassword" className='my-4 mx-3'>
                        <Form.Label>New Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className='bg-dark text-white'
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer className="text-light" style={{ backgroundColor: '#242424' }}>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="success" onClick={handleSave} disabled={oldPassword === '' || newPassword === ''}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
