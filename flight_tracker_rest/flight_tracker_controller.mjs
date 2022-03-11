import * as flight from './flight_tracker_model.mjs';
import express from 'express';
import { spawn } from 'child_process';
import Amadeus from 'amadeus';

const PORT = 3000;

const app = express();

// JSON format
app.use(express.json());

// connect to Amadeus API with API key + secret
const amadeus = new Amadeus({
    clientId: 'ENTER_CLIENT_ID',
    clientSecret: 'ENTER_CLIENT_SECRET',
});


// ROUTES GO HERE

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
        // process.kill()
        console.log('child process exited with code: ' + code);
    });
});

app.get("/results", (req, res) => {
    let filter = {}

    flight.readFlights(filter, '', 0)
        // If Promise is fulfilled, 200 status provided and all objects in collection are displayed in JSON format
        .then(flight_obj => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(flight_obj);
        })
        // In case of failed Promise, raise 400 status code
        .catch(error => {
            console.log(error)
            res.status(400).json(error);

        });
});

// adds flight information to database
app.post('/', (req, res) => {
    flight.createFlight(req.body.departingAirport, req.body.arrivingAirport, req.body.departingDate, req.body.arrivingDate)
        // If no error, 201 status provided and object sent as response in JSON format
        .then(flight_obj => {
            res.setHeader('Content-Type', 'application/json');
            res.status(201).json(flight_obj);
        })
        // In case of failed Promise, raise 404 status code
        .catch(error => {
            console.error(error);
            res.status(400).json({ error: "Request Failed" });
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


// listening

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});
