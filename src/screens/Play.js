import { useEffect, useState } from "react";
import { setOnlineUsers } from "../features/onlineUsersSlice";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "../socket";
import { Outlet, useLocation } from "react-router-dom";
import { Button, Card, Col, Container, Form, InputGroup, Modal, Row } from "react-bootstrap";
import { FaBolt, FaCheck, FaClock, FaFire, FaHandPaper, FaPencilRuler, FaTimes, FaUserSlash } from "react-icons/fa";
import styles from "../public/Home.module.css";
import Select from 'react-select';
import "../public/Login.css";
import { SideMenu } from "../components/Navbar";
import { setGame } from "../features/gameSlice";

export default function Play() {
    const [playing, setPlaying] = useState(false);
    const [time, setTime] = useState(0);
    const user = useSelector((state) => state.users);
    const game = useSelector((state) => state.game);
    const [drawRequested, setDrawRequested] = useState(false);
    const [requestDraw, setRequestDraw] = useState(false);
    const onlineUsers = useSelector((state) => state.onlineUsers);
    const [opponent, setOpponent] = useState(onlineUsers && onlineUsers.length ? onlineUsers[0] : "");
    const dispatch = useDispatch();
    console.log("Is socket connected?", socket.connected);

    useEffect(() => {
        socket.on("drawRequested", ({ color }) => {
            if (color === game.color) {
                setRequestDraw("Draw Requested");
            } else {
                setDrawRequested(true);
            }
        })

        socket.on("drawRejected", () => {
            setRequestDraw("Draw Rejected");
            setTimeout(() => { setRequestDraw(false) }, 2000);
        })

        fetchGame();
    }, [])

    function play() {
        console.log(opponent)
        if (opponent && opponent !== "Select user" && time && !playing) {
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
                <SideMenu playing={playing}/>
            </Row>
            <Row className="align-items-center justify-content-center" style={{marginTop: '70px'}}>
                <Outlet />
                <Col className="d-flex justify-content-center align-items-center">
                    <Card bg="dark" text="white" className="p-4 d-flex" style={{ width: '500px', backgroundColor: '#242424' }}>
                        {true ? (
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
                                        onChange={(val) => {console.log(val);setTime(val.value)}}
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
                                    <Button variant="success" style={{ width: '100%' }} onClick={play} disabled={playing}>
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
                        {playing &&
                            <Row className="mt-3 d-flex justify-content-start">
                                <Button className="mx-2"
                                    style={{ width: '20%', backgroundColor: '#343a40', border: 'none' }}
                                    size="sm"
                                    onClick={handleResign}
                                    disabled={!playing}
                                >
                                    <FaHandPaper className="mr-5" /> Resign
                                </Button>
                                {drawRequested ?
                                    <Modal show={drawRequested} onHide={() => setDrawRequested(false)} centered>
                                        <Modal.Header closeButton>
                                            {game.opponent} has requested a draw.
                                        </Modal.Header>

                                        <Modal.Body>
                                            <Button
                                                style={{ width: '20%', backgroundColor: '#343a40', border: 'none' }}
                                                onClick={onAccept}
                                            >
                                                <FaCheck className="mr-1" /> Accept
                                            </Button>
                                            <Button
                                                style={{ width: '20%', backgroundColor: '#343a40', border: 'none' }}
                                                onClick={onReject}
                                            >
                                                <FaTimes className="mr-1" /> Reject
                                            </Button>
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Button variant="secondary">
                                                Close
                                            </Button>
                                        </Modal.Footer>
                                    </Modal>
                                    : requestDraw ?
                                        <Button style={{ width: '30%', backgroundColor: '#343a40', border: 'none' }}
                                            size="sm"
                                            disabled={true}
                                        >
                                            <FaPencilRuler className="mr-1" /> {requestDraw}
                                        </Button>
                                        : <Button style={{ width: '30%', backgroundColor: '#343a40', border: 'none' }}
                                            size="sm"
                                            onClick={handleDraw}
                                            disabled={!playing}
                                        >
                                            <FaPencilRuler className="mr-1" /> Request Draw
                                        </Button>
                                }
                            </Row>
                        }
                    </Card>
                </Col>
            </Row>
        </Container>

    );
}
