import React, { useEffect, useRef, useState } from 'react';
import { Container, Col, Card, Form, Button } from 'react-bootstrap';
import styles from '../public/Home.module.css'
import SimpleBar from 'simplebar-react';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage } from '../features/messagesSlice';
import { socket } from '../socket';
import { FaArrowRight } from 'react-icons/fa';

export default function Chat(props) {
    const [message, setMessage] = useState('');
    const messages = useSelector(state => state.messages);
    const dispatch = useDispatch();
    const user = useSelector(state => state.users);
    const game = useSelector(state => state.game);
    const chatBodyRef = useRef(null);
    const audioRef = useRef(null);

    const playSound = () => {
        audioRef.current.play();
    };

    useEffect(() => {
        socket.on("sendMessage", () => {
            playSound();
            setTimeout(() => scrollToBottom(), 1)
        })
        scrollToBottom()
    }, [chatBodyRef])

    const scrollToBottom = () => {
        if (chatBodyRef.current) {
            chatBodyRef.current.getScrollElement().scrollTop = chatBodyRef.current.getScrollElement().scrollHeight;
        }
    };

    const handleSendMessage = () => {
        if (props.playing) {
            const msg = {
                sender: user.username,
                content: message,
            }
            dispatch(addMessage(msg))
            socket.emit("message", {
                gameId: game.gameId,
                ...msg,
            })
            setMessage('');
            setTimeout(() => scrollToBottom(), 1)
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <Container>
            <Col className="d-flex justify-content-center align-items-center mt-4">
                <Card className={styles.card + "  text-white"}>
                    <Card.Header className='text-secondary'>Chat</Card.Header>
                    <Card.Body style={{ maxHeight: '200px', overflow: 'hidden' }}>
                        <SimpleBar ref={chatBodyRef} style={{ maxHeight: '120px', overflowY: 'auto' }}>
                            {messages.length ? messages.map((message, index) => (
                                <div key={index}>
                                    <span className={message.sender === user.username ? 'text-success' : 'text-danger'}>
                                        {message.sender}: &nbsp;
                                    </span>
                                    {message.content}
                                </div>
                            )) : <div className='text-secondary'><em>No messages</em></div>}
                        </SimpleBar>
                    </Card.Body>
                    <Card.Footer>
                        <Form inline className="d-flex justify-content-between my-2">
                            <Form.Control
                                type="text"
                                placeholder="Message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={handleKeyPress}
                            />
                            <Button variant="primary" onClick={handleSendMessage} className='ml-5'>
                                <FaArrowRight />
                            </Button>
                        </Form>
                    </Card.Footer>
                </Card>
            </Col>
            <audio ref={audioRef} src={require("../public/message.mp3")} />
        </Container>
    );
};