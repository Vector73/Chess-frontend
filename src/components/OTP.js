import { useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";

export default function OTP({ otp, setOtp, Register, error, email }) {
    const onChange = (e) => {
        setOtp(e.target.value)
    }

    return (
        <Form className="text-white">
            <Form.Group className="m-4" controlId="formUsername">
                <Form.Label>OTP</Form.Label>
                <Form.Control
                    type="text"
                    className="text-light bg-dark"
                    placeholder="Username"
                    value={otp}
                    onChange={onChange}
                    isInvalid={!!error}
                />
                <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
            </Form.Group>

            <div className="d-flex justify-content-center m-4">
                <Button variant="success" style={{ width: '100%' }} onClick={Register}>
                    Sign in
                </Button>
            </div>
            <Alert variant="info" className="mx-4" style={{ width: "320px" }}> OTP sent to <em>{email}</em></Alert>
        </Form>
    )
}
