import { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Form } from 'react-bootstrap';
import api from '../services/api';

function UserDashboard() {
    const [transacciones, setTransacciones] = useState([]);
    const [tipoFiltro, setTipoFiltro] = useState('');
    const [fechaDesde, setFechaDesde] = useState('');
    const [fechaHasta, setFechaHasta] = useState('');

    const fetchTransacciones = async () => {
        try {
            const response = await api.get('/transacciones/me', {
                params: { tipo: tipoFiltro, desde: fechaDesde, hasta: fechaHasta },
            });
            setTransacciones(response.data);
        } catch (error) {
            console.error('Error al obtener transacciones:', error);
        }
    };

    useEffect(() => {
        fetchTransacciones();
    }, [tipoFiltro, fechaDesde, fechaHasta]);

    return (
        <Container className="mt-5">
            <h1 className="text-center mb-4">Mis Transacciones</h1>
            <Row>
                <Col md={4}>
                    <h2 className="h5">Filtrar Transacciones</h2>
                    <Form>
                        <Form.Group className="mb-3" controlId="formTipo">
                            <Form.Label>Tipo de Transacción</Form.Label>
                            <Form.Select
                                value={tipoFiltro}
                                onChange={(e) => setTipoFiltro(e.target.value)}
                            >
                                <option value="">Todos</option>
                                <option value="Deuda a favor">Deuda a favor</option>
                                <option value="Faltante">Faltante</option>
                                <option value="Abono">Abono</option>
                                <option value="Préstamo">Préstamo</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formDesde">
                            <Form.Label>Desde</Form.Label>
                            <Form.Control
                                type="date"
                                value={fechaDesde}
                                onChange={(e) => setFechaDesde(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formHasta">
                            <Form.Label>Hasta</Form.Label>
                            <Form.Control
                                type="date"
                                value={fechaHasta}
                                onChange={(e) => setFechaHasta(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Col>

                <Col md={8}>
                    <h2 className="h5">Lista de Transacciones</h2>
                    <Table striped bordered hover>
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
                                    <td>${transaccion.monto}</td>
                                    <td>{new Date(transaccion.fecha).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    );
}

export default UserDashboard;
