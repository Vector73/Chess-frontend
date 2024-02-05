import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const GameOver = ({ show, close, gameState }) => {
    return (
        <Modal show={show} onHide={close} centered>
            <Modal.Header closeButton>
                {gameState.abort ?
                    <Modal.Title style={{ margin: '0 auto', marginLeft: '43%' }} className='text-secondary'>
                        Aborted
                    </Modal.Title>
                    : gameState.draw ?
                        <Modal.Title style={{ margin: '0 auto', marginLeft: '43%' }}>Draw</Modal.Title>
                        : gameState.win ?
                            <Modal.Title style={{ margin: '0 auto', marginLeft: '35%' }} className='text-success'>
                                You won
                            </Modal.Title>
                            : <Modal.Title style={{ margin: '0 auto', marginLeft: '35%' }} className='text-danger'>
                                You lost
                            </Modal.Title>
                }
            </Modal.Header>

            <Modal.Body>
                {gameState.abort ?
                    <p style={{ textAlign: 'center' }}>Aborted because of abandonment</p>
                    : gameState.draw ?
                        <p style={{ textAlign: 'center' }}>Draw by {gameState.reason}</p>
                        : <p style={{ textAlign: 'center' }}>{gameState.winner} won by {gameState.reason}</p>
                }
            </Modal.Body>
        </Modal>
    );
};

export default GameOver;