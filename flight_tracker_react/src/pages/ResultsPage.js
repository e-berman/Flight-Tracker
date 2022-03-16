import React, { useEffect, useState } from "react";
import { Link, useLocation } from 'react-router-dom';
import { Table, Container, Row, Col, Button, Form, Navbar } from 'react-bootstrap';


function ResultsPage() {

    // retrieve payload from HomePage via useNavigate
    const location = useLocation();

    const [emailAddress, setEmailAddress] = useState('');
    
    let flightData = location.state.flights

    // adds email address to database
    const createEmail = async () => {
        const newEmailAddress = {emailAddress};
        const response = await fetch('/email', {
            method: 'POST', 
            body: JSON.stringify(newEmailAddress),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // error handling with response status check
        if (response.status !== 201) {
            alert(`Failed to add the email. Status code = ${response.status}`);
        }
    }

    // launcher that will call GET request that executes email microservice
    const launcher = async () => {
        const response = await fetch('/email', {
            method: 'GET', 
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.status === 201) {
            alert('Flight results have been emailed to you');
        } else {
            alert(`Failed to add the flight. Status code = ${response.status}`);
        }

    }

    const loadFlight = async () => {
        for (let i = 0; i < flightData.length; i++) {
            let 
        }

    }

    useEffect(() => {
        loadFlight();
    }, []);

    return (
        <div className="results">
            <Navbar bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand href="/results">
                    Flight Results
                    </Navbar.Brand>
                </Container>
            </Navbar>
            <Container>
            <Form className="mt-3">
                <Row >
                    Display Table Here
                    <Table>
                        <thead>
                            <th>Departing Airport</th>
                            <th>Arriving Airport</th>
                            <th>Departing Date</th>
                            <th>Arriving Date</th>
                            <th>Price</th>
                        </thead>
                    </Table>
                </Row>
                <Row>
                    <Col>
                    <Form.Group controlId="emailAddress">
                    <Form.Control
                        type="text"
                        placeholder='Enter Email Address'
                        value={emailAddress}
                        onChange={e => setEmailAddress(e.target.value)}
                    />
                    </Form.Group>
                    </Col>
                    <Col>
                        <Button onClick={() => {createEmail(); launcher();}}
                        >Send To Email</Button>
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col>
                        <Link to="/">
                            <Button>Back To Homepage</Button>
                        </Link>
                    </Col>
                </Row>
            </Form>
            </Container>
        </div>           
    );
}

export default ResultsPage;