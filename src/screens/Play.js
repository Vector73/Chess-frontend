import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "../socket";
import { Outlet } from "react-router-dom";
import { Badge, Button, Card, Col, Container, Form, InputGroup, Modal, Row } from "react-bootstrap";
import { FaBolt, FaCheck, FaClock, FaFire, FaHandPaper, FaPencilRuler, FaTimes, FaUserSlash } from "react-icons/fa";
import styles from "../public/Home.module.css";
import Select from 'react-select';
import "../public/Login.css";
import { SideMenu } from "../components/Navbar";
import { setGame } from "../features/gameSlice";
import Chat from "../components/Chat";

export default function Play() {
    const [playing, setPlaying] = useState(false);
    const [time, setTime] = useState(0);
    const [abortTime, setAbortTime] = useState(15);
    const user = useSelector((state) => state.users);
    const game = useSelector((state) => state.game);
    const [drawRequested, setDrawRequested] = useState(false);
    const [requestDraw, setRequestDraw] = useState(false);
    const onlineUsers = useSelector((state) => state.onlineUsers);
    const [opponent, setOpponent] = useState(onlineUsers && onlineUsers.length ? onlineUsers[0] : "");
    const dispatch = useDispatch();

    useEffect(() => {
        socket.on("drawRequested", ({ color }) => {
            if (color === game.color) {
                setRequestDraw("Draw Requested");
            } else {
                setDrawRequested(true);
            }
        })

        socket.on("gameState", ({ abortTime }) => {
            setAbortTime(abortTime);
        })

        socket.on("drawRejected", () => {
            setRequestDraw("Draw Rejected");
            setTimeout(() => { setRequestDraw(false) }, 2000);
        })

        fetchGame();
    }, [])

    function play() {
        if (opponent && time && !playing) {
            socket.emit("challenge", { challenger: user.username, player: opponent, time: time, handshake: 0 })
        }
    }

    const timeOptions = [
        { value: 1, label: '1 minute', icon: <FaFire /> },
        { value: 3, label: '3 minutes', icon: <FaBolt /> },
        { value: 5, label: '5 minutes', icon: <FaBolt /> },
        { value: 10, label: '10 minutes', icon: <FaClock /> },
    ];

    const customStyles = {
        option: (provided, state) => ({
            ...provided,
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#242424',
            boxSizing: 'border-box',
        }),
    };

    function handleResign() {
        socket.emit("resign", { color: game.color, gameId: game.gameId });
    }

    function handleDraw() {
        socket.emit("requestDraw", { gameId: game.gameId, color: game.color });
    }

    function onAccept() {
        setDrawRequested(false);
        socket.emit("draw", { gameId: game.gameId });
    }

    function onReject() {
        setDrawRequested(false);
        socket.emit("rejectDraw", { gameId: game.gameId, color: game.color });
    }

    const fetchGame = async () => {
        const response = await fetch("/game/games", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username: user.username, gameId: game.gameId }),
        });

        const activeGame = await response.json();
        if (activeGame.found) {
            setPlaying(true);
        }
        else {
            setPlaying(false);
            dispatch(setGame({}));
        }
    }

    return (
        <Container fluid className={styles.container + " h-100"}>
            <Row className={styles.row}>
                <SideMenu playing={playing} />
            </Row>
            <Row className="align-items-center justify-content-center" style={{ marginTop: '70px' }}>
                <Outlet />
                <Col className="justify-content-center align-items-center">
                    <Row className="d-flex justify-content-center align-items-center">
                        <Card bg="dark" text="white" className={"p-4 d-flex " + styles.card}>
                            {onlineUsers.length ? (
                                <Form>
                                    <Form.Group controlId="opponentSelect">
                                        <Form.Label>Play online</Form.Label>
                                        <Form.Control
                                            as="select"
                                            size="sm"
                                            className="mx-auto text-light bg-dark"
                                            onChange={(e) => { setOpponent(e.target.value) }}
                                            placeholder="Select"
                                        >
                                            {onlineUsers && onlineUsers.map((name, index) => <option key={index} value={name}>{name}</option>)}
                                        </Form.Control>
                                    </Form.Group>
                                    <Form.Group controlId="timeSelect">
                                        <Form.Label>Time</Form.Label>
                                        <Select
                                            onChange={(opt) => setTime(opt.value)}
                                            options={timeOptions.map((option) => ({
                                                value: option.value,
                                                label: (
                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                        {option.icon}
                                                        <span style={{ marginLeft: '5px' }}>{option.label}</span>
                                                    </div>
                                                ),
                                            }))}
                                            styles={customStyles}
                                        />
                                    </Form.Group>
                                    <InputGroup className="mt-3">
                                        <Button variant="success" style={{ width: '100%' }} onClick={play} disabled={(playing && game.opponent)}>
                                            Play
                                        </Button>
                                    </InputGroup>
                                </Form>
                            ) :
                                <Col className="text-primary d-flex justify-content-center align-items-center">
                                    <Row className="p-2"><FaUserSlash /></Row>
                                    <Row className="p-2">No one online right now</Row>
                                </Col>
                            }
                            {(playing || game.opponent) && (
                                <Row className="mt-3 d-flex justify-content-start">
                                    <Button
                                        className={styles.button + " mx-2"}
                                        size="sm"
                                        onClick={handleResign}
                                        disabled={!(playing || game.opponent)}
                                    >
                                        <FaHandPaper className="mr-5" /> Resign
                                    </Button>
                                    {drawRequested ? (
                                        <Modal show={drawRequested} onHide={() => setDrawRequested(false)} centered>
                                            <Modal.Header closeButton>
                                                {game.opponent} has requested a draw.
                                            </Modal.Header>

                                            <Modal.Body>
                                                <Button
                                                    className={styles.button}
                                                    onClick={onAccept}
                                                >
                                                    <FaCheck className="mr-1" /> Accept
                                                </Button>
                                                <Button
                                                    className={styles.button}
                                                    onClick={onReject}
                                                >
                                                    <FaTimes className="mr-1" /> Reject
                                                </Button>
                                            </Modal.Body>
                                        </Modal>
                                    )
                                        : requestDraw ? (
                                            <Button className={styles.button}
                                                size="sm"
                                                disabled={true}
                                            >
                                                <FaPencilRuler className="mr-1" /> {requestDraw}
                                            </Button>
                                        )
                                            : (
                                                <Button className={styles.button}
                                                    size="sm"
                                                    onClick={handleDraw}
                                                    disabled={!(playing || game.opponent)}
                                                >
                                                    <FaPencilRuler className="mr-1" /> Request Draw
                                                </Button>
                                            )
                                    }
                                    {abortTime <= 10 && (
                                        <Badge bg="warning" style={{ width: '80px', marginRight: '10px' }} className="ms-auto">
                                            Aborting in <br /> {abortTime}s
                                        </Badge>
                                    )}
                                </Row>
                            )}
                        </Card>
                    </Row>
                    <Row className="d-flex justify-content-center align-items-center">
                        <Chat playing={playing || game.opponent} />
                    </Row>
                </Col>
            </Row>
        </Container >

    );
}
