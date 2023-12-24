import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { setOnlineUsers } from "../features/onlineUsersSlice";
import { Button, Card, Col, Container, Nav, Navbar, Row } from "react-bootstrap";
import { FaChess, FaCogs, FaGamepad, FaUserCog } from 'react-icons/fa';
import { SideMenu } from "../components/Navbar";
import GameItem from "../components/GameItem";
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import styles from '../public/Home.module.css';
import { setGame } from "../features/gameSlice";

export default function UserHomePage() {
    const [games, setGames] = useState([]);
    const user = useSelector(state => state.users);
    const [playing, setPlaying] = useState(false);
    const dispatch = useDispatch();
    const game = useSelector(state => state.game);

    useEffect(() => {
        fetchGame();
        fetchCompletedGames();
    }, [])

    async function fetchCompletedGames() {
        const apiUrl = process.env.REACT_APP_API_URL;
        const response = await fetch(`${apiUrl}/game/completedGames`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username: user.username }),
        });

        const completedGames = await response.json();
        if (!completedGames.failed) {
            completedGames.map(game => {
                if (game.status === 'w') {
                    game.loser = game.players.black.username;
                } else if (game.status === 'b') {
                    game.loser = game.players.white.username;
                }
                return game;
            })
            setGames(completedGames.reverse());
        }
    }

    const fetchGame = async () => {
        const apiUrl = process.env.REACT_APP_API_URL;
        const response = await fetch(`${apiUrl}/game/games`, {
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
        <Container fluid className={styles.container}>
            <Row className={styles.row}>
                <SideMenu playing={playing}/>
            </Row>
            <Row className={styles.row + " mt-5"}>
                <Col sm={6} className={styles.col + " mt-5"}>
                    <Card className={styles.cardContainer}>
                        <h1>PLAY</h1>
                        <p>Play chess with your friends.</p>
                        <div className="d-flex justify-content-center m-4">
                            <Link to={{ pathname: '/chess/play', state: playing }} style={{ width: '550px' }}>
                                <Button variant="success" size="lg" style={{ width: '70%', marginTop: '20px' }}>
                                    <FaChess style={{ marginRight: '10px', marginBottom: '8px' }} /> Play
                                </Button>
                            </Link>
                        </div>
                    </Card>
                </Col>
                <Col sm={6} className={styles.pastGamesContainer + " mt-5"}>
                    <Card className={styles.pastGamesCard}>
                        <Card.Title> Past Games </Card.Title>
                        <SimpleBar style={{ padding: "5px" }}>
                            <Card className={styles.pastGames}>
                                <Card.Body>
                                    {
                                        games.length ?
                                            games.map(game =>
                                                <GameItem key={game.timestamp} game={game} username={user.username} />
                                            )
                                            : <h3 className="text-secondary">No games to show</h3>
                                    }
                                </Card.Body>
                            </Card>
                        </SimpleBar>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}
