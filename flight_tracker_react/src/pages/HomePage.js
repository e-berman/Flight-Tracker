import React, { useState } from "react";
import { MdFlight } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Form, Navbar, Popover, OverlayTrigger } from 'react-bootstrap';

function HomePage() {

    // initialize state variables
    const [departingAirport, setDepartingAirport] = useState('');
    const [arrivingAirport, setArrivingAirport] = useState('');
    const [departingDate, setDepartingDate] = useState('');
    const [arrivingDate, setArrivingDate] = useState('');
    const [flightType, setFlightType] = useState("One Way");
    const [hidden, setHidden] = useState(false);
    let flights = null;

    // with React v6, navigate replaces useHistory
    const navigate = useNavigate();

    // passes newFlight parameters to flight route.
    // then passes the resulting flights array to the results page.
    const createFlight = async () => {
        const newFlight = {flightType, departingAirport, arrivingAirport, departingDate, arrivingDate};
        await fetch('/flight', {
            method: 'POST', 
            body: JSON.stringify(newFlight),
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => response.json())
        .then(payload_data => { 
            console.log(payload_data);
            flights = payload_data;
        });

        navigate('/results', {
            state: {
                flights: flights
            }
        });
    }

    // handles the visibility of the Return Date text field based on if flight is One Way or Round Trip
    const changeHandler = (event) => {
        setFlightType(event.target.value);
        if (flightType === 'One Way') {
            setHidden(true);
        } else {
            setHidden(false);
        }
    }

    return (

        <div className="homepage">
            <Navbar bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand href="/">
                        <MdFlight />
                    Flight Finder
                    </Navbar.Brand>
                </Container>
            </Navbar>
            <Container>
            <Form className="mt-5">
                <Row className="mt-3">
                    <Col>
                    <Form.Group controlId="flightType">
                        <Form.Label>Flight Type: </Form.Label>
                        <Form.Select onChange={e => changeHandler(e)}>
                            <option value="One Way">One Way</option>
                            <option value="Round Trip">Round Trip</option>
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
                    <Form.Group className={hidden ? "d-block" : "d-none"} controlId="arrivingDate">
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
                        <Button onClick={createFlight}>Generate</Button>
                        <OverlayTrigger
                        trigger="click"
                        placement="bottom"
                        overlay={
                            <Popover id="popover-basic">
                                <Popover.Header as="h3">How To Use Fire-Sale Flights</Popover.Header>
                                <Popover.Body>
                                Enter in the flight type, departing airport, and arriving airport.
                                You will also need to include the date range for your trip.
                                <br />
                                <br />
                                Once you have all the info entered, click <strong>Generate</strong> to get your results.
                                </Popover.Body>
                            </Popover>
                        }
                        >
                            <Button className="ms-3" variant="outline-dark">Need Help?</Button>
                        </OverlayTrigger>
                    </Col>
                </Row>
            </Form>
            </Container>
        </div>
    );
}

export default HomePage;
