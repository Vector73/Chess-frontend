import { useEffect, useState } from "react";
import "./App.css";
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { Link, Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { socket } from "./socket";
import { useDispatch, useSelector } from "react-redux";
import { setOnlineUsers } from "./features/onlineUsersSlice";
import { setGame } from './features/gameSlice';
import Home from "./screens/Home";
import Banner from "./components/Notifications";
import { addChallenge, removeChallenge } from "./features/challengeSlice";
import StyledLink from "./components/StyledLink";
import Loading from "./components/Loading";
import { addMessage, clearChat } from "./features/messagesSlice";


function App() {
    const [userData, setUserData] = useState({ authenticated: -1 });
    const user = useSelector((state) => state.users);
    const game = useSelector((state) => state.game);
    const dispatch = useDispatch();
    const location = useLocation();

    useEffect(() => {
        socket.on("onlineUsers", (onlineUsers) => {
            dispatch(setOnlineUsers(parseUsers(onlineUsers.online)))
        })

        const apiUrl = process.env.REACT_APP_API_URL;
        fetch(`${apiUrl}/home`, { method: "POST" })
            .then((res) => res.json())
            .then((res) => {
                setUserData(res);
            });

        socket.on("pushChallenge", ({ challenger, handshake, time }) => {
            if (!handshake) {
                socket.emit("challenge", { challenger: user.username, player: challenger, handshake: 1, time })
            }
            dispatch(addChallenge({
                opponent: challenger,
                status: "pending",
                handshake: handshake,
                time,
            }))
        })

        socket.on("joinGame", ({ opponent, gameId, color, time }) => {
            dispatch(removeChallenge({ opponent }))
            dispatch(clearChat());
            dispatch(setGame({
                opponent,
                gameId,
                color: color,
                status: "pending",
                time,
            }))
            window.location.href = `/chess/${gameId}`;
        })

        socket.on("sendMessage", ({ sender, content, key }) => {
            dispatch(addMessage({
                key,
                sender,
                content,
            }))
        })

        socket.on("clearChat", () => { dispatch(clearChat()); });

        socket.on("gameOver", ({ winner, reason, draw }) => {
            dispatch(setGame({ color: game.color }));
        })

        return () => {
            socket.off("sendMessage");
            socket.off("clearChat");
        };
    }, []);

    function parseUsers(users) {
        if (!user) return [];
        return users
            .filter((username) => username !== user.username);
    }

    if (userData.authenticated === 0 || userData.authenticated === 1) {
        return (
            <div>

                {
                    location.pathname === "/"
                        ?
                        <>
                            <div className="body">
                                <Container
                                    className="d-flex align-items-center justify-content-center"
                                    style={{ minHeight: '100vh' }}
                                >
                                    <Card style={{ width: '300px', backgroundColor: '#242424' }}>
                                        <Card.Body className="d-flex align-items-center justify-content-center flex-column">
                                            <StyledLink to="/sign-up">SIGN UP</StyledLink>
                                            <StyledLink to="/sign-in">SIGN IN</StyledLink>
                                        </Card.Body>
                                    </Card>
                                </Container>
                            </div>

                        </> : <Outlet />
                }
            </div>
        );
    } else {
        return (
            <div className="body">
                <Loading />
            </div>
        );
    }
}

export default App;
