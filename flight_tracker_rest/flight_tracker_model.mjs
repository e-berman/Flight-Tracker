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

// Define schema for the flight object
// const flightSchema = mongoose.Schema({
//     name: { type: String, required: true },
//     reps: { type: Number, required: true },
//     weight: { type: Number, required: true},
//     unit: { type: String, required: true},
//     date: { type: String, required: true}
// });