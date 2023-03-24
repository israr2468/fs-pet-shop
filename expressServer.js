const express = require('express');
const fs = require('fs')
const app = express();
const port = process.env.port || 3000; // if it's defined go to env.port OR go to 3000 if it's not

app.get('/', (req, res) => { // listening on '/' and you have a request and a response as parameters to an unnamed function 
    res.send('Hello! Welcome to the pet shop.');
})

app.get('/pets', (req, res) => {
    fs.readFile('pets.json', 'utf-8', (error, pets) => { // this gives you the raw json for pets. Read file is asynchronous so you have to create ana anonymous function out of it
        if (error) {
            res.error(error);
        } else {
            res.json(JSON.parse(pets)); // this will automatically convert raw json as a response
            res.status(200);
            res.end();
        }
    }) 
})


app.get('/pets/:petId', (req, res) => {
    fs.readFile('pets.json', 'utf-8', (error, petsString) => { 
        if (error) {
            res.sendStatus(500);
            res.end();
        } else {
            let pets = JSON.parse(petsString); 
            if (!pets[req.params.petId]) {
                res.sendStatus(404, 'Not Found')
            } else {
                res.json(pets[req.params.petId]);
                res.status(200);
                res.end();
            }
        }
    }) 
})


app.listen(port, () => { // this is requesting the path - basically an event listener 
    console.log(`Server listening on port: ${port}`);
})