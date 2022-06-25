import * as flight from './flight_tracker_model.mjs';
import express from 'express';
import { spawn } from 'child_process';
import Amadeus from 'amadeus';

const PORT = 3000;

const app = express();

// JSON format
app.use(express.json());

// connect to Amadeus API with API key + secret
// for details on Amadeus APIs: https://developers.amadeus.com/self-service.
const amadeus = new Amadeus({
    clientId: 'ENTER_CLIENT_ID',
    clientSecret: 'ENTER_CLIENT_SECRET',
});


// route to run python microservice launcher
app.get('/email', (req, res) => {
    const pyPath = '/Users/eberman/ankylosaurus/school/CS_361/Flight-Tracker/launcher.py'
    const process = spawn('python', [pyPath])

    // log data as string
    process.stdout.on('data', (stdout) => {
        console.log(stdout.toString());
    });

    // log error as string
    process.stderr.on('data', (stderr) => {
        console.log(stderr.toString());
    });

    // close the child process and provide exit code
    process.on('close', (code) => {
        if (code === 0) {
            res.sendStatus(200);
        }
        console.log('child process exited with code: ' + code);
    });
});

// passes form data to route via request body parameters.
// Then calls Amadeus Flight Offers Search API to retrieve
// flight data pertaining to request body parameters.
app.post('/flight', (req, res) => {

    if (req.body.arrivingDate === '') {

        amadeus.shopping.flightOffersSearch.get({
            originLocationCode: req.body.departingAirport,
            destinationLocationCode: req.body.arrivingAirport,
            departureDate: req.body.departingDate,
            adults: '1',
            travelClass: 'ECONOMY',
            includedAirlineCodes: 'WN,AA,AS,DL,NK,HA,UA,F9,B6,OO',
            nonStop: true,
            currencyCode: 'USD',
            max: 20,
        }).then(flight_obj => {
            res.status(200).json(flight_obj)
            console.log(flight_obj);
        }).catch(error => {
            console.error(error)
            console.log(error);
        });
        
    } else {

        amadeus.shopping.flightOffersSearch.get({
            originLocationCode: req.body.departingAirport,
            destinationLocationCode: req.body.arrivingAirport,
            departureDate: req.body.departingDate,
            returnDate: req.body.arrivingDate,
            adults: '1',
            travelClass: 'ECONOMY',
            includedAirlineCodes: 'WN,AA,AS,DL,NK,HA,UA,F9,B6,OO',
            nonStop: true,
            currencyCode: 'USD',
            max: 20,
        }).then(flight_obj => {
            res.status(200).json(flight_obj)
            console.log(flight_obj);
        }).catch(error => {
            console.error(error)
            console.log(error);
        });
    
    }

});

// route that will retrieve air carrier business name from IATA code
app.post('/carrier', (req, res) => {

    amadeus.referenceData.airlines.get({
        airlineCodes: req.body.airCarrierCode,
    }).then(obj => {
        res.status(200).json(obj);
        console.log(obj);
    }).catch(error => {
        console.error(error);
        console.log(error);
    });

});

// adds user email address to database for python microservice
app.post('/email', (req, res) => {
    flight.createEmail(req.body.emailAddress)
        // If no error, 201 status provided and object sent as response in JSON format
        .then(email_obj => {
            res.setHeader('Content-Type', 'application/json');
            res.status(201).json(email_obj);
        })
        // In case of failed Promise, raise 404 status code
        .catch(error => {
            console.error(error);
            res.status(400).json({ error: "Request Failed" });
        });
});

// adds the array of flights to the database
app.post('/results', (req, res) => {
  
    flight.createFlightResults(req.body.passData)
        // If no error, 201 status provided and object sent as response in JSON format
        .then(results_obj => {
            res.setHeader('Content-Type', 'application/json');
            res.status(201).json(results_obj);
        })
        // In case of failed Promise, raise 404 status code
        .catch(error => {
            console.error(error);
            res.status(400).json({ error: "Request Failed" });
        });
});


// listening on designated port
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});
