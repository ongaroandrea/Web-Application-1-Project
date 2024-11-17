
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export function LoginButton() {
    const navigate = useNavigate();
    return (
        <Button variant="outline-light" onClick={() => navigate('/login')}>Login</Button>
    )
}

