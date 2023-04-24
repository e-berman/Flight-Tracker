import React, { useEffect, useState } from "react";
import { Link, useLocation } from 'react-router-dom';
import { Table, Container, Row, Col, Button, Form, Navbar } from 'react-bootstrap';
import { LoadingSpinner } from "../components/LoadingSpinner";


function ResultsPage() {

    // retrieve payload from HomePage via useNavigate
    const location = useLocation();

    // initialize state variables
    const [displayData, setDisplayData] = useState([]);
    const [passData, setPassData] = useState(null);
    const [loading, setLoading] = useState(true);

    let flightParams = location.state.flights['request']['params'];
    let flightData = location.state.flights['data'];
    let carrierCodes = [];
    let prices = [];
    let totalData = [];
    let airCarrierCode = '';

    // fetches results route to store flight data to database
    const createFlightResults = async () => {
        const newFlightResults = {passData};
        const response = await fetch('/results', {
            method: 'POST', 
            body: JSON.stringify(newFlightResults),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // error handling with response status check
        if (response.status !== 201) {
            alert(`Failed to add the flights. Status code = ${response.status}`);
        }
    }

    
    // calls the carrier route to call Amadeus API to translate IATA code to air carrier business name
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
<<<<<<< HEAD
            //console.log(payload_data);
=======
            console.log(payload_data);
>>>>>>> aa4024df597c928d5d64961887789a120e844fff
            data = payload_data;
        })

        return data;
    }

    // retrieves relevant data from payload and displays data on table on ResultsPage.
    // then sets passData state variable to array of all flights.
    const loadFlight = async () => {
        const delay = (ms = 1000) => new Promise((r) => setTimeout(r, ms));

        for (let i = 0; i < flightData.length; i++) {
            let dict = {}

            // store IATA code for getAirCarrier function
            airCarrierCode = flightData[i]['validatingAirlineCodes'][0];

            // call getAirCarrier function, and retrieve air carrier name based on IATA code
            await delay();
            const result = await getAirCarrier({airCarrierCode});

            // append all relevant table data to dict
            dict._id = flightData[i]['id'];
            dict.airCarrier = result['data'][0]['businessName'];
            dict.departAirport = flightParams['originLocationCode'];
            dict.arriveAirport = flightParams['destinationLocationCode'];
            dict.departDate = flightParams['departureDate'];
            dict.returnDate = flightParams['returnDate'];
            dict.price = flightData[i]['price']['total'];
            dict.seatsLeft = flightData[i]['numberOfBookableSeats'];
            
            // if price is unique, add dictionary to dict
            if (prices.includes(flightData[i]['price']['total']) !== true) {
                totalData.push(dict);
            }
            // if carrier code is unique, append to carrierCodes array
            if (carrierCodes.includes(airCarrierCode) !== true) {
                carrierCodes.push(airCarrierCode);
            }
            // if price is unique, append to prices array
            if (prices.includes(flightData[i]['price']['total']) !== true) {
                prices.push(flightData[i]['price']['total']);
            }
        }

        // set the state variable to pass the data to the database.
        setPassData(totalData);

        return totalData
    }

    // renders page and updates page on each displayData state variable update
    useEffect(() => {
        (async () => {
            const data = await loadFlight();
            if (data) {
                setDisplayData(data);
            }
            setLoading(false);
            createFlightResults();
        })();

        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                    <Row>
                        <Table>
                            <thead>
                                <tr>
                                    <th>Air Carrier</th>
                                    <th>Departing Airport</th>
                                    <th>Arriving Airport</th>
                                    <th>Departing Date</th>
                                    <th>Return Date</th>
                                    <th>Price</th>
                                    <th>Seats Left</th>
                                </tr>
                            </thead>
                            {loading ? <LoadingSpinner /> : 
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
                            }
                        </Table>
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
