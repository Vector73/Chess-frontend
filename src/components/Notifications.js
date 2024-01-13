import { useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap";
import { FaBell, FaCheck, FaTimes } from "react-icons/fa";

export default function Banner(props) {
    const [color, setColor] = useState("white");

    useEffect(() => {
        let notification = false;
        Object.entries(props.challenges).forEach((challenge, index) => {
            if (challenge[1].status === 'pending' && challenge[1].handshake === 0) {
                setColor('warning')
                notification = true;
            }
        })
        if (!notification) setColor('white');
    }, [props.challenges])

    return (
        <>
            <Dropdown>
                <Dropdown.Toggle variant={color} id="notification-dropdown">
                    <FaBell size={16} color="white" className="mb-1" />
                </Dropdown.Toggle>

                <Dropdown.Menu align="left" style={{ backgroundColor: '#343a40', color: 'white', width: '100px' }}>
                    <Dropdown.Header>Notifications</Dropdown.Header>
                    {Object.entries(props.challenges).map((challenge, index) => (
                        challenge[1].status === 'pending' && challenge[1].handshake === 0 && (
                            <Dropdown.Item key={index}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ color: 'white' }}>{challenge[0]}</div>
                                    <div className="text-info">{challenge[1].time}m</div>
                                    <div>
                                        <FaCheck
                                            className="mx-2"
                                            size={20}
                                            color="green"
                                            style={{ border: '1px solid green', borderRadius: '50%', padding: '3px', marginBottom: '3px' }}
                                            onClick={() => props.startGame(challenge[0])}
                                        />
                                        <FaTimes
                                            size={20}
                                            color="red"
                                            style={{ border: '1px solid red', borderRadius: '50%', padding: '3px', marginBottom: '3px' }}
                                            onClick={() => props.reject(challenge[0])}
                                        />
                                    </div>
                                </div>
                            </Dropdown.Item>
                        )
                    ))}
                </Dropdown.Menu>
            </Dropdown>

        </>
    );
}
