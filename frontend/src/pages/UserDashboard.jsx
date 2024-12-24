import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Table, Alert, Spinner, Card, Modal } from 'react-bootstrap';
import api from '../services/api';

function AdminDashboard() {
    const [empleados, setEmpleados] = useState([]);
    const [transacciones, setTransacciones] = useState([]);
    const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [saldo, setSaldo] = useState(0);
    const [saldoTotal, setSaldoTotal] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [empleadoAEliminar, setEmpleadoAEliminar] = useState(null);
    const [nombreConfirmacion, setNombreConfirmacion] = useState('');

    useEffect(() => {
        if (error || success) {
            const timer = setTimeout(() => {
                setError('');
                setSuccess('');
            }, 30000);
            return () => clearTimeout(timer);
        }
    }, [error, success]);

    const fetchEmpleados = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/empleados');
            setEmpleados(response.data);

            let total = 0;
            for (const empleado of response.data) {
                const transaccionesEmpleado = await api.get(`/transacciones/${empleado._id}`);
                total += transaccionesEmpleado.data.reduce((acc, transaccion) => acc + transaccion.monto, 0);
            }
            setSaldoTotal(total);
        } catch (error) {
            console.error('Error al obtener empleados:', error);
            setError('No se pudo cargar la lista de empleados.');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchTransacciones = async (empleadoId) => {
        setIsLoading(true);
        try {
            const response = await api.get(`/transacciones/${empleadoId}`);
            const transaccionesOrdenadas = response.data.sort(
                (a, b) => new Date(b.fecha) - new Date(a.fecha)
            );
            setTransacciones(transaccionesOrdenadas);

            const total = transaccionesOrdenadas.reduce((acc, transaccion) => acc + transaccion.monto, 0);
            setSaldo(total);
        } catch (error) {
            console.error('Error al obtener transacciones:', error);
            setError('No se pudieron cargar las transacciones.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectEmpleado = (empleado) => {
        setEmpleadoSeleccionado(empleado);
        fetchTransacciones(empleado._id);
    };

    const formatNumber = (num) => new Intl.NumberFormat('es-MX', { minimumFractionDigits: 2 }).format(num);

    useEffect(() => {
        fetchEmpleados();
    }, []);

    return (
        <Container fluid className="mt-5">
            <Row className="mb-4">
                <Col className="text-center">
                    <h3>Deuda Total: <strong>${formatNumber(saldoTotal)}</strong></h3>
                </Col>
            </Row>

            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            {isLoading && (
                <div className="d-flex justify-content-center my-4">
                    <Spinner animation="border" variant="primary" />
                </div>
            )}

            {!isLoading && (
                <Row>
                    <Col sm={12} md={6} className="mb-4">
                        <Card>
                            <Card.Header>Empleados</Card.Header>
                            <Card.Body>
                                <Table striped bordered hover responsive>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Nombre</th>
                                            <th>Apellido</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {empleados.map((empleado, index) => (
                                            <tr key={empleado._id}>
                                                <td>{index + 1}</td>
                                                <td>{empleado.nombre}</td>
                                                <td>{empleado.apellido}</td>
                                                <td>
                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        onClick={() => handleSelectEmpleado(empleado)}
                                                        className="w-100"
                                                    >
                                                        Ver
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col sm={12} md={6}>
                        <Card>
                            <Card.Header>
                                {empleadoSeleccionado
                                    ? `${empleadoSeleccionado.nombre} ${empleadoSeleccionado.apellido}`
                                    : 'Selecciona un empleado'}
                                {empleadoSeleccionado && (
                                    <div className="mt-2">
                                        Saldo Total: <strong>${formatNumber(saldo)}</strong>
                                    </div>
                                )}
                            </Card.Header>
                            <Card.Body>
                                {empleadoSeleccionado ? (
                                    <>
                                        <Table striped bordered hover responsive>
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Tipo</th>
                                                    <th>Descripción</th>
                                                    <th>Monto</th>
                                                    <th>Fecha</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {transacciones.map((transaccion, index) => (
                                                    <tr key={transaccion._id}>
                                                        <td>{index + 1}</td>
                                                        <td>{transaccion.tipo}</td>
                                                        <td>{transaccion.descripcion}</td>
                                                        <td>${formatNumber(transaccion.monto)}</td>
                                                        <td>{new Date(transaccion.fecha).toLocaleDateString()}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </>
                                ) : (
                                    <p className="text-muted">Selecciona un empleado para ver sus transacciones.</p>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Eliminar Empleado</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        Escribe el nombre completo del empleado para confirmar la eliminación: <strong>{empleadoAEliminar?.nombre} {empleadoAEliminar?.apellido}</strong>
                    </p>
                    <Form.Group controlId="formNombreConfirmacion" className="mb-3">
                        <Form.Control
                            type="text"
                            placeholder="Nombre completo"
                            value={nombreConfirmacion}
                            onChange={(e) => setNombreConfirmacion(e.target.value)}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancelar
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default AdminDashboard;
