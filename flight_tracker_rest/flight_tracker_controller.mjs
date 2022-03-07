import * as flight from './flight_tracker_model.mjs';
import express from 'express';
import { spawn } from 'child_process';

const PORT = 3000;

const app = express();

//JSON format
app.use(express.json());


// ROUTES GO HERE

// route to run python microservice launcher
app.get('/results', (req, res) => {
    const pyPath = '/Users/eberman/ankylosaurus/school/CS_361/Flight-Tracker/launcher.py'
    const process = spawn('python', [pyPath])

    process.stdout.on('data', (stdout) => {
        console.log(stdout.toString());
    });

    process.stderr.on('data', (stderr) => {
        console.log(stderr.toString());
    });
      
    process.on('close', (code) => {
        // process.kill()
        console.log('child process exited with code: ' + code);
    });
});


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

app.post('/results', (req, res) => {
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