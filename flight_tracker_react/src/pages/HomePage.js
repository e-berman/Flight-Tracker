import React, { useState } from "react";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { MdFlight } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
// import 'boostrap/dist/css/boostrap.min.css';
import { Container, Row, Col, Button, Form, Navbar } from 'react-bootstrap';

function HomePage() {

    const [departingAirport, setDepartingAirport] = useState('');
    const [arrivingAirport, setArrivingAirport] = useState('');
    const [departingDate, setDepartingDate] = useState('');
    const [arrivingDate, setArrivingDate] = useState('');

    // with React v6, navigate replaces useHistory
    const navigate = useNavigate();

    // creates an flight and adds to database
    const createFlight = async () => {
        const newFlight = { departingAirport, arrivingAirport, departingDate, arrivingDate};
        const response = await fetch('/', {
            method: 'POST', 
            body: JSON.stringify(newFlight),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // error handling with response status check
        if (response.status === 201) {
            alert('Successfully added the flight');
        } else {
            alert(`Failed to add the flight. Status code = ${response.status}`);
        }
        navigate('/results');
    }


    return (

        <div className="homepage">
            <Navbar bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand href="/">
                        <MdFlight />
                    Cheap Flights
                    </Navbar.Brand>
                </Container>
            </Navbar>
            <Container>
            <Form className="mt-5">
                <Row>
                    <Col>
                        <Button size="xs" variant="outline-dark">Need Help?</Button>
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col>
                    <Form.Group controlId="flightType">
                        <Form.Label>Flight Type: </Form.Label>
                        <Form.Select>
                            <option>One Way</option>
                            <option>Round Trip</option>
                        </Form.Select>
                    </Form.Group>
                    </Col>
                    <Col>
                    <Form.Group controlId="departingAirport">
                        <Form.Label>Departing Airport: </Form.Label>
                        <Form.Control
                            type="text"
                            placeholder='Enter Airport Abbreviation..'
                            value={departingAirport}
                            onChange={e => setDepartingAirport(e.target.value)}
                        />
                    </Form.Group>
                    </Col>
                    <Col>
                    <Form.Group controlId="arrivingAirport">
                        <Form.Label>Arriving Airport: </Form.Label>
                        <Form.Control
                            type="text"
                            placeholder='Enter Airport Abbreviation..'
                            value={arrivingAirport}
                            onChange={e => setArrivingAirport(e.target.value)}
                        />
                    </Form.Group>
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col>
                    <Form.Group controlId="departureDate">
                        <Form.Label>Departing Date: </Form.Label>
                        <Form.Control
                            type='date'
                            placeholder='Enter Airport Abbreviation..'
                            value={departingDate}
                            onChange={e => setDepartingDate(e.target.value)}
                        />
                    </Form.Group>
                    </Col>
                    <Col>
                    <Form.Group controlId="arrivingDate">
                        <Form.Label>Return Date: </Form.Label>
                        <Form.Control
                            type='date'
                            placeholder='Enter Airport Abbreviation..'
                            value={arrivingDate}
                            onChange={e => setArrivingDate(e.target.value)}
                        />
                    </Form.Group>
                    </Col>
                </Row>
                <Row className="mt-4">
                    <Col>
                        <Button size="xs" onClick={createFlight}>Generate</Button>
                    </Col>
                </Row>
            </Form>
            </Container>
        </div>
    );
}

export default HomePage;