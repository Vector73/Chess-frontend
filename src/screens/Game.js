import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { useEffect, useState } from 'react';
import { socket } from '../socket';
import { useDispatch, useSelector } from 'react-redux';
import { setGame } from '../features/gameSlice';
import { useNavigate } from 'react-router-dom';
import { Card, Col, Row } from 'react-bootstrap';
import '../public/Login.css';
import { FaUser } from 'react-icons/fa';
import GameOver from '../components/GameOver';

export default function Game() {
    const [fen, setFen] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    const [boardWidth, setBoardWidth] = useState(window.innerWidth > 576 ? 470 : window.innerWidth - 20);
    const [selectedSquare, setSelectedSquare] = useState(null);
    const [boardStyle, setBoardStyle] = useState({});
    const [gameOver, setGameOver] = useState(false);
    const [key, setKey] = useState(Date.now());
    const [moveState, setMoveState] = useState({});
    const [playing, setPlaying] = useState(false);
    const [gameOverModal, setGameOverModal] = useState(false);
    const [gameState, setGameState] = useState({});
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const game = useSelector(state => state.game);
    const user = useSelector(state => state.users);
    const [blackTime, setBlackTime] = useState(game.time);
    const [whiteTime, setWhiteTime] = useState(game.time);

    const handleResize = () => {
        setBoardWidth(window.innerWidth > 576 ? 470 : window.innerWidth - 20);
    };

    const handleSquareClick = (square) => {
        if (gameOver) return;
        const board = new Chess(fen);
        let piece = board.get(square);
        let color = -1;

        if (square === selectedSquare) {
            setBoardStyle({});
            setSelectedSquare(null);
            return;
        }
        if (piece) {
            color = piece.color === 'w' ? 1 : 0;
        }
        if (selectedSquare && color !== game.color) {
            try {
                movePiece(board, selectedSquare, square);
                setSelectedSquare(null);
                setBoardStyle({});
            } catch (e) {
                console.log(e)
            }

        } else {
            if (piece && piece.color === board.turn() && game.color === color) {
                setSelectedSquare(square);

                const legalMoves = board.moves({ square: square, verbose: true });
                let highlightStyles = {};
                legalMoves.forEach((move) => {
                    highlightStyles[move.to] = {
                        backgroundColor: 'rgba(50, 223, 150, 0.4)',
                    };
                });
                setBoardStyle(highlightStyles);
            }
        }
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);

        socket.emit("username", { username: user.username, reconnect: true });
        socket.emit("joinRoom", { gameId: game.gameId });
        fetchGame();
        socket.on("pushMove", ({ fen, gameId, move }) => {
            setSelectedSquare(null);
            setFen(fen);

            let highlightStyle = {};
            highlightStyle[move.from] = {
                backgroundColor: 'rgba(255, 223, 77, 0.5)',
            };
            highlightStyle[move.to] = {
                backgroundColor: 'rgba(255, 223, 77, 0.5)',
            };

            setBoardStyle(highlightStyle)
        })

        socket.on("gameState", (gameState) => {
            console.log("gameState");
            setWhiteTime(gameState.time.white);
            setBlackTime(gameState.time.black);
        })

        socket.on('gameOver', ({ winner, reason, draw }) => {
            setGameOver(true);
            setGameOverModal(true);
            if (!draw) {
                setGameState({
                    color: winner ? 'w' : 'b',
                    winner: !!game.color === winner ? user.username : game.opponent,
                    reason: reason,
                    win: !!game.color === winner,
                })
            } else {
                setGameState({
                    draw: true,
                    reason: reason,
                })
            }
        })

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [])

    const onDrop = (sourceSquare, targetSquare) => {
        if (gameOver) return;
        const board = new Chess(fen);
        try {
            movePiece(board, sourceSquare, targetSquare);
        } catch (e) { console.log(e) }
    };

    const movePiece = (board, from, to, promotion) => {
        const move = board.move({ from: from, to: to, promotion: promotion });
        const isWhiteMove = move.color === 'w';
        if ((game.color && isWhiteMove) || (!game.color && !isWhiteMove)) {
            setFen(board.fen());
            socket.emit("move", { fen: board.fen(), opponent: game.opponent, gameId: game.gameId, move });

            let highlightStyle = {};
            highlightStyle[move.from] = {
                backgroundColor: 'rgba(255, 223, 77, 0.5)',
            };
            highlightStyle[move.to] = {
                backgroundColor: 'rgba(255, 223, 77, 0.5)',
            };
            setBoardStyle(highlightStyle)
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
        console.log(activeGame)
        if (activeGame.found) {
            setFen(activeGame.fen);
            setKey(Date.now());
            dispatch(setGame({
                opponent: activeGame.opponent,
                gameId: activeGame.gameId,
                color: activeGame.color,
                status: "pending",
            }))
            setPlaying(true);
        }
        else {
            setFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
            setPlaying(false);
        }
    }

    function msToTimer(ms) {
        var seconds = ms ? Math.floor((ms / 1000) % 60).toString().padStart(2, '0') : '00';
        var minutes = ms ? Math.floor((ms / 60000)).toString() : '0';
        return minutes + ' : ' + seconds;
    }

    function checkPromotion(from, to, piece) {
        if (piece && piece[1].toLowerCase() === 'p') {
            const color = piece[0];
            if (color === 'w' && from[1] === '7' && to[1] === '8') {
                setMoveState({ from: from, to: to });
                return true;
            }
            else if (color === 'b' && from[1] === '2' && to[1] === '1') {
                setMoveState({ from: from, to: to });
                return true;
            }
            return false;
        }
        return false;
    }

    function promote(piece) {
        if (!piece) return;
        movePiece(new Chess(fen), moveState.from, moveState.to, piece[1].toLowerCase())
        console.log(piece);
        return true;
    }

    return (
        <>
            <Col className='col-chess'>
                <Row>
                    <Col className='d-flex align-items-center' style={{ color: '#ae79ff' }}>
                        {<FaUser style={{ marginRight: '5px', color: !game.color ? 'white' : 'gray' }} />} {playing && game.opponent}
                    </Col>
                    <Col xs={3} className='row-chess my-3 justify-content-end'>
                        <Card className='bg-dark text-white justify-content-end' style={{ width: '80px' }}>
                            <Card.Body className='p-2'>
                                <div className='text-info'>{msToTimer(!game.color ? whiteTime : blackTime)}</div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Row sm={6} className='chess'>
                    <div style={{ width: '100%' }} className='justify-content-center'>
                        <Chessboard
                            id="chessBoard"
                            key={key}
                            position={fen}
                            boardWidth={boardWidth}
                            onPieceDrop={onDrop}
                            onSquareClick={handleSquareClick}
                            onPromotionCheck={checkPromotion}
                            onPromotionPieceSelect={promote}
                            customSquareStyles={boardStyle}
                            boardOrientation={game.color ? 'white' : 'black'}
                        />
                    </div>
                </Row>

                <Row>
                    <Col className='d-flex align-items-center' style={{ color: '#ae79ff' }}>
                        {<FaUser style={{ marginRight: '5px', color: game.color ? 'white' : 'gray' }} />} {user.username}
                    </Col>
                    <Col xs={3} className='row-chess my-3 justify-content-end'>
                        <Card className='bg-dark text-white justify-content-center' style={{ width: '80px' }}>
                            <Card.Body className='p-2'>
                                <div className='text-info'>{msToTimer(game.color ? whiteTime : blackTime)}</div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Col>
            {gameOverModal && <GameOver show={gameOver} close={() => setGameOverModal(false)} gameState={gameState}/>}
        </>
    );
}