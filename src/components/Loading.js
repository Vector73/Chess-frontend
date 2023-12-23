import { Container } from 'react-bootstrap';
import '../public/Login.css';
import ReactLoading from 'react-loading';

export default function Loading({ children }) {
    return (
        <div className='body'>
            <Container
                className="d-flex align-items-center justify-content-center"
                style={{ minHeight: '100vh' }}
            >
                <ReactLoading type="spin" color="#0000FF"
                height={100} width={50} />
            </Container>
        </div>
    )
}