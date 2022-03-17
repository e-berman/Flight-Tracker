import React, { useEffect, useState } from "react";
import { Link, useLocation } from 'react-router-dom';
import { Table, Container, Row, Col, Button, Form, Navbar } from 'react-bootstrap';


function ResultsPage() {

    // retrieve payload from HomePage via useNavigate
    const location = useLocation();

    const [emailAddress, setEmailAddress] = useState('');

    let flightParams = location.state.flights['request']['params'];
    let flightData = location.state.flights['data'];
    let carrierCodes = [];
    let prices = [];
    let displayData = [];
    let airCarrierCode = '';

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

    const getAirCarrier = async(carrier_code) => {

        let data = null

        // fetch air carrier name via IATA code through Amadeus API
        await fetch('/carrier', {
            method: 'POST', 
            body: JSON.stringify(carrier_code),
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => response.json())
        .then(payload_data => {
            // console.log(payload_data)
            data = payload_data
        })

        return data;
    }

    const loadFlight = async () => {
        console.log(flightData)

        let dict = {}
        for (let i = 0; i < flightData.length; i++) {

            // store IATA code for getAirCarrier function
            airCarrierCode = flightData[i]['validatingAirlineCodes'][0]

            // call getAirCarrier function, and retrieve air carrier name based on IATA code
            let result = await getAirCarrier({airCarrierCode});

            // append all relevant table data to dict
            dict._id = flightData[i]['id']
            dict.airCarrier = result['data'][0]['businessName']
            dict.departAirport = flightParams['originLocationCode']
            dict.arriveAirport = flightParams['destinationLocationCode']
            dict.departDate = flightParams['departureDate']
            dict.returnDate = flightParams['returnDate']
            dict.price = flightData[i]['price']['total']
            dict.seatsLeft = flightData[i]['numberOfBookableSeats']
            
            // if price is unique, add dictionary to dict
            if (prices.includes(flightData[i]['price']['total']) !== true) {
                displayData.push(dict)
            }
            // if carrier code is unique, append to carrierCodes array
            if (carrierCodes.includes(airCarrierCode) !== true) {
                carrierCodes.push(airCarrierCode);
            }
            // if price is unique, append to prices array
            if (prices.includes(flightData[i]['price']['total']) !== true) {
                prices.push(flightData[i]['price']['total'])
            }
            dict = {}
        }

        console.log(displayData)
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
                    <Table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Air Carrier</th>
                                <th>Departing Airport</th>
                                <th>Arriving Airport</th>
                                <th>Departing Date</th>
                                <th>Arriving Date</th>
                                <th>Price</th>
                                <th>Seats Left</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayData.map((data) => (
                                <tr key={data._id}>
                                    <td>{data.airCarrier}</td>
                                    <td>{data.departAirport}</td>
                                    <td>{data.arriveAirport}</td>
                                    <td>{data.departDate}</td>
                                    <td>{data.returnDate}</td>
                                    <td>{data.price}</td>
                                    <td>{data.seatsLeft}</td>
                                </tr>
                            ))}
                        </tbody>
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