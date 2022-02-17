import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button, Form, Navbar } from 'react-bootstrap';

function ResultsPage() {


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
                        <Button>Send To Email</Button>
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