import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

const GameOver = ({ show, close, gameState }) => {
    return (
        <Modal show={show} onHide={close} centered>
            <Modal.Header closeButton>
                {gameState.draw ?
                    <Modal.Title style={{ margin: '0 auto', marginLeft: '43%' }}>Draw</Modal.Title>
                    : gameState.win ?
                        <Modal.Title style={{ margin: '0 auto', marginLeft: '35%' }} className='text-success'>
                            You win
                        </Modal.Title>
                        : <Modal.Title style={{ margin: '0 auto', marginLeft: '35%' }} className='text-danger'>
                            You Lose
                        </Modal.Title>
                }
            </Modal.Header>

            <Modal.Body>
                {gameState.draw ?
                    <p style={{ textAlign: 'center' }}>Draw by {gameState.reason}</p>
                    : <p style={{ textAlign: 'center' }}>{gameState.winner} won by {gameState.reason}</p>
                }
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary">
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default GameOver;