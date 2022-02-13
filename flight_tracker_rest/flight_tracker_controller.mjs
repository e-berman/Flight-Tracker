import * as flight from './flight_tracker_model.mjs';
import express from 'express';

const PORT = 3000;

const app = express();

//JSON format
app.use(express.json());


// ROUTES GO HERE


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


//

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});