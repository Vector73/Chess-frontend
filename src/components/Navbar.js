import { Accordion, Button, Card, Nav, Navbar } from "react-bootstrap";
import { FaBell, FaChess, FaChessKing, FaChessKnight, FaCogs, FaDoorOpen, FaUserCog } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from 'react';
import styles from '../public/Home.module.css'
import Banner from "./Notifications";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "../socket";
import { removeChallenge } from "../features/challengeSlice";
import { setUser } from "../features/userSlice";

export function SideMenu({playing}) {
    const challenges = useSelector(state => state.challenges);
    const user = useSelector(state => state.users);
    const game = useSelector(state => state.game);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    function startGame(opponent) {
        if (playing || game.opponent) return;
        socket.emit("acceptChallenge",
            {
                opponent: opponent,
                user: user.username,
                time: challenges[opponent]?.time,
            })
    }

    function reject(opponent) {
        dispatch(removeChallenge({ opponent }));
    }

    function onLogout() {
        dispatch(setUser({authenticated: 0}));
        navigate("/");
    }

    return (
        <Navbar bg="dark" variant="dark" expand="sm" className={styles.navbarHeight}>
            <Navbar.Brand className="text-success">
                <h3>
                    <FaChessKnight style={{ marginLeft: '20px', marginRight: '10px', width: '15px', marginBottom: '5px' }} />
                    CHESS
                </h3>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav" style={{ justifyContent: 'flex-end' }}>
                <Nav className="" style={{ marginLeft: '20px', marginRight: '30px' }}>
                    <Nav.Item>
                        <Nav.Link className="text-light">
                            <Banner challenges={challenges} startGame={startGame} reject={reject} />
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link className="text-light mt-1" as={Link} to="/play">
                            <FaChess style={{ marginLeft: '20px', marginRight: '10px' }} /> Play
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link className="text-light mt-1" as={Link} to="/profile">
                            <FaUserCog style={{ marginLeft: '20px', marginRight: '10px' }} /> Profile
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link className="text-light mt-1" as={Link} to="/settings">
                            <FaCogs style={{ marginLeft: '20px', marginRight: '10px' }} /> Settings
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link className="text-light mt-1" onClick={onLogout}>
                            <FaDoorOpen style={{ marginLeft: '20px', marginRight: '10px' }} /> Logout
                        </Nav.Link>
                    </Nav.Item>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};