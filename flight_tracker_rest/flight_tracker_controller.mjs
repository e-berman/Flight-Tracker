import * as flight from './flight_tracker_model.mjs';
import express from 'express';
import Amadeus from 'amadeus';
import dotenv from 'dotenv'

dotenv.config()

const PORT = 3000;

const app = express();

// JSON format
app.use(express.json());

// connect to Amadeus API with API key + secret
// for details on Amadeus APIs: https://developers.amadeus.com/self-service.
const amadeus = new Amadeus({
    clientId: process.env.API_KEY,
    clientSecret: process.env.API_SECRET,
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
app.post('/flight', async (req, res) => {
    if (req.body.arrivingDate === '') {
        amadeus.shopping.flightOffersSearch.get({
            originLocationCode: req.body.departingAirport,
            destinationLocationCode: req.body.arrivingAirport,
            departureDate: req.body.departingDate,
            adults: '1',
            travelClass: 'ECONOMY',
            includedAirlineCodes: 'WN,AA,AS,DL,HA,UA,F9,NK,CO,B6,VX',
            nonStop: true,
            currencyCode: 'USD',
            max: 10,
        }).then(flight_obj => {
            res.status(200).json(flight_obj)
            //console.log(flight_obj);
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
            includedAirlineCodes: 'WN,AA,AS,DL,HA,UA,F9,NK,CO,B6,VX',
            nonStop: true,
            currencyCode: 'USD',
            max: 10,
        }).then(flight_obj => {
            res.status(200).json(flight_obj)
            //console.log(flight_obj);
        }).catch(error => {
            console.error(error)
            console.log(error);
        });
    }
});

// route that will retrieve air carrier business name from IATA code
app.post('/carrier', async (req, res) => {
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
