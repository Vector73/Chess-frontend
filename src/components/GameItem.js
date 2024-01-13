import { Card, Col, Row } from "react-bootstrap";
import { FaMinus, FaPlus, FaSquare } from "react-icons/fa";

export default function GameItem({ game, username }) {
    return (
        <Card style={{ backgroundColor: '#292b2d', padding: '10px 20px', borderRadius: '10px', color: 'white', width: '100%', margin: '5px 2px' }}>
            <Row>
                <Col className="mx-2 text-left">
                    <Row className={game.status === 'd' ? "text-secondary" : "text-success"}>
                        {game.status === 'd' ? game.players.white.username : game.winner}
                    </Row>
                    <Row className={"justify-content-left " + game.status === 'd' ? "text-secondary" : "text-danger"} >
                        {game.status === 'd' ? game.players.black.username : game.loser}
                    </Row>
                </Col>
                <Col className="d-flex align-items-center mx-2 justify-content-center">
                    <Row>
                    {
                        game.winner === username ?
                            <FaPlus className="text-success" /> :
                            game.status === 'd' ?
                                <FaSquare className="text-secondary" /> :
                                <FaMinus className="text-danger" />
                    }
                    </Row>
                </Col>
                <Col className="mx-2 text-secondary" style={{ fontSize: 'smaller' }}>
                    <Row className="justify-content-end">
                        {new Date(game.timestamp).toLocaleTimeString()}
                    </Row>
                    <Row className="justify-content-end">
                        {new Date(game.timestamp).toLocaleDateString()}
                    </Row>
                </Col>
            </Row>
        </Card>
    )
}