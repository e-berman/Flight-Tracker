import mongoose from 'mongoose';

// Connect to the flight collection in the MongoDB server. Runs on port 27017.
mongoose.connect(
    'mongodb://localhost:27017/flights',
    { useNewUrlParser: true }
)

const db = mongoose.connection;

// Validate db connection
db.once('open', () => {
    console.log('Successfully connected to MongoDB using Mongoose.');
});

//Define schema for the flight object
const flightSchema = mongoose.Schema({
    departingAirport: { type: String, required: true },
    arrivingAirport: { type: String, required: true},
    departingDate: { type: String, required: true},
    arrivingDate: { type: String, required: true}
});

const emailSchema = mongoose.Schema({
    emailAddress: { type: String, required: true },
});

// Compile the model from the schema
const Flight = mongoose.model('Flight', flightSchema);

// Compile the model from email schema
const Email = mongoose.model('Email', emailSchema);

/**
 * Creates an Flight object
 * 
 * @param {String} departingAirport
 * @param {String} arrivingAirport
 * @param {String} departingDate
 * @param {String} arrivingDate
 * @returns Promise - resolved to JSON after .save
 */

 const createFlight = async (departingAirport, arrivingAirport, departingDate, arrivingDate) => {
    const flight = new Flight({ departingAirport: departingAirport,
                                arrivingAirport: arrivingAirport,
                                departingDate: departingDate,
                                arrivingDate: arrivingDate });
    return flight.save();
}

const createEmail = async (emailAddress) => {
    const email = new Email({ emailAddress: emailAddress })
    return email.save()
}

// /**
//  * Reads Flight object(s)
//  * 
//  * No params
//  * 
//  * @returns all JSON objects in the collection
//  */

//  const readFlight = async (filter, projection, limit) => {
//     const query = Flight.find(filter)
//         .select(projection)
//         .limit(limit);
//     return query.exec();
// }

export { createFlight, createEmail };