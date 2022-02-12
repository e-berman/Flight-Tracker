import express from 'express';

const PORT = 3000;

const app = express();

//JSON format
app.use(express.json());


// ROUTES GO HERE







//

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});