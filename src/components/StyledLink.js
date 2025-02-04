import { Link } from "react-router-dom";

export default function StyledLink({ to, children }) {
    return (
        <Link
            to={to}
            style={{
                textDecoration: 'none',
                display: 'inline-block',
                margin: '10px',
            }}
        >
            <div className="text-center"
                style={{
                    width: '200px',
                    padding: '16px',
                    borderRadius: '4px',
                    border: 'solid 2px #28a745',
                    backgroundColor: '#28a745',
                    color: 'white',
                    fontWeight:'bold',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s',
                }}
                onMouseOver={(e) => {
                    e.target.style.backgroundColor = 'white';
                    e.target.style.color = 'black';
                }}
                onMouseOut={(e) => {
                    e.target.style.backgroundColor = '#28a745'
                    e.target.style.color = 'white'
                }}
            >
                {children}
            </div>
        </Link>
    )
};
