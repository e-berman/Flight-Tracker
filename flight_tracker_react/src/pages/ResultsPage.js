import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button, Form, Navbar } from 'react-bootstrap';



function ResultsPage() {


    const [emailAddress, setEmailAddress] = useState('');
    
    // const navigate = useNavigate();

    // adds email address to database
    const createEmail = async () => {
        const newEmailAddress = {emailAddress};
        const response = await fetch('/results', {
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

    // const launcher = async () => {
    //     const response = await fetch('/email', {
    //         method: 'POST', 
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //     });

    //     if (response.status === 201) {
    //         alert('Flight results have been emailed to you');
    //     } else {
    //         alert(`Failed to add the flight. Status code = ${response.status}`);
    //     }

    // }


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
                <Row>
                    <Form.Label>Results Go Here When Scraper is Done</Form.Label>
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
                        <Button onClick={createEmail}
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