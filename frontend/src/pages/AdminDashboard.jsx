import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Table, Alert, Spinner, Card, Modal } from 'react-bootstrap';
import api from '../services/api'; // Configuración de Axios para peticiones al backend

function AdminDashboard() {
    const [empleados, setEmpleados] = useState([]);
    const [transacciones, setTransacciones] = useState([]);
    const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [tipo, setTipo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [monto, setMonto] = useState('');
    const [fecha, setFecha] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [saldo, setSaldo] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [empleadoAEliminar, setEmpleadoAEliminar] = useState(null);
    const [nombreConfirmacion, setNombreConfirmacion] = useState('');

    const fetchEmpleados = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/empleados');
            setEmpleados(response.data);
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
        setTransacciones([]);
        fetchTransacciones(empleado._id);
    };

    const handleAddEmpleado = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (!nombre || !apellido) {
            setError('Por favor, completa todos los campos.');
            return;
        }

        try {
            await api.post('/empleados', { nombre, apellido });
            setSuccess('Empleado agregado correctamente.');
            fetchEmpleados();
            setNombre('');
            setApellido('');
            clearNotification();
        } catch (error) {
            console.error('Error al agregar empleado:', error);
            setError('No se pudo agregar el empleado.');
            clearNotification();
        }
    };

    const handleDeleteEmpleado = async () => {
        if (nombreConfirmacion !== `${empleadoAEliminar.nombre} ${empleadoAEliminar.apellido}`) {
            setError('El nombre ingresado no coincide.');
            clearNotification();
            return;
        }

        try {
            await api.delete(`/empleados/${empleadoAEliminar._id}`);
            setSuccess(`Empleado ${empleadoAEliminar.nombre} eliminado correctamente.`);
            setShowModal(false);
            fetchEmpleados();
            setEmpleadoAEliminar(null);
            setNombreConfirmacion('');
            clearNotification();
        } catch (error) {
            console.error('Error al eliminar empleado:', error);
            setError('No se pudo eliminar el empleado.');
            clearNotification();
        }
    };

    const handleAddTransaccion = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (!tipo || !descripcion || !monto || !fecha) {
            setError('Por favor, completa todos los campos.');
            clearNotification();
            return;
        }

        const montoFinal = ['Faltante', 'Préstamo'].includes(tipo) ? -Math.abs(Number(monto)) : Math.abs(Number(monto));

        try {
            await api.post('/transacciones', {
                empleadoId: empleadoSeleccionado._id,
                tipo,
                descripcion,
                monto: montoFinal,
                fecha,
            });
            setSuccess('Transacción registrada correctamente.');
            fetchTransacciones(empleadoSeleccionado._id);
            setTipo('');
            setDescripcion('');
            setMonto('');
            setFecha('');
            clearNotification();
        } catch (error) {
            console.error('Error al registrar transacción:', error);
            setError('No se pudo registrar la transacción.');
            clearNotification();
        }
    };

    const handleDeleteTransaccion = async (transaccionId) => {
        setError('');
        setSuccess('');
        try {
            await api.delete(`/transacciones/${transaccionId}`);
            setSuccess('Transacción eliminada correctamente.');
            fetchTransacciones(empleadoSeleccionado._id);
            clearNotification();
        } catch (error) {
            console.error('Error al eliminar transacción:', error);
            setError('No se pudo eliminar la transacción.');
            clearNotification();
        }
    };

    const clearNotification = () => {
        setTimeout(() => {
            setError('');
            setSuccess('');
        }, 30000); // 30 segundos
    };

    const formatNumber = (num) => new Intl.NumberFormat('es-MX', { minimumFractionDigits: 2 }).format(num);

    useEffect(() => {
        fetchEmpleados();
    }, []);

    return (
        <Container fluid className="mt-5">
            <h1 className="text-center mb-4">Panel de Administración</h1>

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
                                <Form onSubmit={handleAddEmpleado} className="mb-4">
                                    <Form.Group controlId="formNombre" className="mb-3">
                                        <Form.Label>Nombre</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Ingresa el nombre"
                                            value={nombre}
                                            onChange={(e) => setNombre(e.target.value)}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="formApellido" className="mb-3">
                                        <Form.Label>Apellido</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Ingresa el apellido"
                                            value={apellido}
                                            onChange={(e) => setApellido(e.target.value)}
                                        />
                                    </Form.Group>
                                    <Button variant="success" type="submit" className="w-100">
                                        Agregar Empleado
                                    </Button>
                                </Form>

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
                                                        className="me-2"
                                                    >
                                                        Ver
                                                    </Button>
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        onClick={() => {
                                                            setEmpleadoAEliminar(empleado);
                                                            setShowModal(true);
                                                        }}
                                                    >
                                                        Eliminar
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
                                        <Form onSubmit={handleAddTransaccion} className="mb-4">
                                            <Row>
                                                <Col>
                                                    <Form.Group controlId="formTipo" className="mb-3">
                                                        <Form.Label>Tipo</Form.Label>
                                                        <Form.Select
                                                            value={tipo}
                                                            onChange={(e) => setTipo(e.target.value)}
                                                        >
                                                            <option value="">Selecciona un tipo</option>
                                                            <option value="Deuda a favor">Deuda a favor</option>
                                                            <option value="Faltante">Faltante</option>
                                                            <option value="Abono">Abono</option>
                                                            <option value="Préstamo">Préstamo</option>
                                                        </Form.Select>
                                                    </Form.Group>
                                                </Col>
                                                <Col>
                                                    <Form.Group controlId="formMonto" className="mb-3">
                                                        <Form.Label>Monto</Form.Label>
                                                        <Form.Control
                                                            type="number"
                                                            step="0.01"
                                                            placeholder="Monto"
                                                            value={monto}
                                                            onChange={(e) => setMonto(e.target.value)}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                            <Form.Group controlId="formDescripcion" className="mb-3">
                                                <Form.Label>Descripción</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Descripción"
                                                    value={descripcion}
                                                    onChange={(e) => setDescripcion(e.target.value)}
                                                />
                                            </Form.Group>
                                            <Form.Group controlId="formFecha" className="mb-3">
                                                <Form.Label>Fecha</Form.Label>
                                                <Form.Control
                                                    type="date"
                                                    value={fecha}
                                                    onChange={(e) => setFecha(e.target.value)}
                                                />
                                            </Form.Group>
                                            <Button variant="success" type="submit" className="w-100">
                                                Registrar Transacción
                                            </Button>
                                        </Form>

                                        <Table striped bordered hover responsive>
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Tipo</th>
                                                    <th>Descripción</th>
                                                    <th>Monto</th>
                                                    <th>Fecha</th>
                                                    <th>Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {transacciones.map((transaccion, index) => (
                                                    <tr key={transaccion._id}>
                                                        <td>{index + 1}</td>
                                                        <td>{transaccion.tipo}</td>
                                                        <td className="text-truncate" style={{ maxWidth: '150px' }}>
                                                            {transaccion.descripcion}
                                                        </td>
                                                        <td>${formatNumber(transaccion.monto)}</td>
                                                        <td>{new Date(transaccion.fecha).toLocaleDateString()}</td>
                                                        <td>
                                                            <Button
                                                                variant="danger"
                                                                size="sm"
                                                                onClick={() => handleDeleteTransaccion(transaccion._id)}
                                                            >
                                                                Eliminar
                                                            </Button>
                                                        </td>
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
                    <Button variant="danger" onClick={handleDeleteEmpleado}>
                        Eliminar
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default AdminDashboard;
