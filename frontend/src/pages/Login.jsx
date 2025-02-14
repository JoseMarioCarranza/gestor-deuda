import { useState } from 'react';
import { Form, Button, Container, Alert, Card, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); // Limpia cualquier error previo
        try {
            const response = await api.post('/auth/login', { username, password });
            localStorage.setItem('token', response.data.token); // Guarda el token en localStorage

            // Decodifica el token para determinar si el usuario es admin o no
            const user = JSON.parse(atob(response.data.token.split('.')[1]));
            if (user.esAdmin) {
                navigate('/admin'); // Redirige al panel de administración
            } else {
                navigate('/user'); // Redirige al panel de usuario
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            setError('Usuario o contraseña incorrectos');
        }
    };

    return (
        <Container fluid className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <Row className="w-100">
                <Col md={{ span: 4, offset: 4 }}>
                    <Card className="shadow">
                        <Card.Header className="bg-primary text-white text-center">
                            <h3>Iniciar Sesión</h3>
                        </Card.Header>
                        <Card.Body>
                            {error && <Alert variant="danger">{error}</Alert>}
                            <Form onSubmit={handleLogin}>
                                <Form.Group className="mb-3" controlId="formUsername">
                                    <Form.Label>Usuario</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ingresa tu usuario"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formPassword">
                                    <Form.Label>Contraseña</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Ingresa tu contraseña"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </Form.Group>

                                <Button variant="primary" type="submit" className="w-100">
                                    Entrar
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Login;
