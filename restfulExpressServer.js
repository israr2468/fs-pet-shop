const dotenv = require('dotenv')
dotenv.config();

const express = require('express');
const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;
const { Pool } = require('pg');

// const pool = new Pool ({ connectionString: process.env.CONNECTION_STRING }); // same as saying the lines below
const pool = new Pool ({ 
   host: process.env.HOST,
   port: process.env.DB_PORT,
   database: process.env.DATABASE_NAME,
   user: process.env.USERNAME,
   password: process.env.PASSWORD,
});
pool.connect();


app.get('/', (req, res)  => {
    res.sendStatus(404, 'Pet Not Found');
    res.end();
})

app.get('/blah', (req, res)  => {
    res.sendStatus(404, 'Pet Not Found');
    res.end();
})

app.get('/api/pets', (req, res) => {
    
    pool
    .query("SELECT * FROM pets")
    .then((result) => {
        // console.log(result.row[0]);
        res.send(result.rows);
    })
    .catch((e) => console.error(e.stack))
})


app.get('/api/pets/:petId', (req, res) => {
    const petId = parseInt(req.params.petId); // petId variable is first converted to a number using parseInt
    
    pool
    .query('SELECT * FROM pets WHERE id = $1', [petId]) //  then it is passed as a parameter to the SQL query using the parameterized query syntax ($1)
    .then((result) => {
        if (result.rows.length === 0) {
            res.status(404).send('Pet not found');
        } else {
            res.send(result.rows[0]); // result.rows[0] is used to return the first (and only) row from the query result
        }
    })
    .catch((e) => console.error(e.stack));
});



app.post('/api/pets', (req, res) => {    
    let age = req.body.age;
    let kind = req.body.kind;
    let name = req.body.name; // create these so that you can put these into the query request
    // you have to input them as template literals into the .query
    
    pool
        .query(`INSERT INTO pets (age, kind, name) VALUES ( $1, $2, $3) RETURNING *;`, [age, kind, name])
        .then((result) => {
            res.send(result.rows);
        })
})
// in the termianl you can implement it this way or you can go to the request.http
// israrali@Isrars-MacBook-Pro fs-pet-shop % http POST localhost:3000/api/pets age=25 kind=pakistani name=israr

// app.post('/pets/:petId', (req, res) => {
//     const petId = req.params.petId;
//     const newPet = req.body;
//     fs.readFile('pets.json', 'utf-8', (error, petsString) => {
//         if (error) {
//             res.errored(error);
//             res.sendStatus(500);
//             res.end();
//         } else {
//             let pets = JSON.parse(petsString);
//             pets.push(newPet);
//             fs.writeFile('pets.json', JSON.stringify(pets), (error) => {
//                 if (error) {
//                     res.errored(error);
//                     res.sendStatus(500);
//                     res.end();
//                 } else {
//                     res.sendStatus(201); // Created
//                     res.end();
//                 }
//             });
//         }
//     });
// });



app.patch('/api/pets/:petId', (req, res) => {
    let key = Object.keys(req.body)[0]
    let value = Object.values(req.body)[0]
    pool.query(`UPDATE pets SET ${key} = $1 WHERE id = $2 RETURNING *;`, [value, req.params.petId]).then((result => {
        if (result.rows.length === 0) {
            res.status(404).send('Pet Not Found');
        } else {
            res.send(result.rows)
        }
    }))
})
// in the terminal 
// israrali@Isrars-MacBook-Pro fs-pet-shop % http PATCH localhost:3000/api/pets/1 name=fido
  
// app.patch('/pets/:petId', (req, res) => {
//     const petId = req.params.petId;  // you can multiply to convert the string value into a number by adding a *1 at the end of the value
//     const updatedPetData = req.body;
//     let pets = JSON.parse(petsString);
    
//     let petUpdate = pets.find(el => el.petId === petId);
//     let index = pets.indexOf(petUpdate);
    
//     Object.assign(petUpdate, updatedPetData);
    
//     pets[index] = petUpdate;

//     fs.writeFile('pets.json', JSON.stringify(pets), (error) => {
//         res.status(200).json({
//             status: 'Success',
//             data: {
//                 pets: petUpdate 
//             }
//         })
//     })
//   });


app.delete('/api/pets/:petId', (req, res) => {
    pool.query(`DELETE FROM pets WHERE id = $1 RETURNING *;`, [req.params.petId])
        .then(result => {
            if (result.rows.length === 0) {
                res.status(404).send('Pet not found');
            } else {
                res.send(result.rows);
            }
        })
        .catch(error => {
            console.error(error);
            res.status(500).send('Internal Server Error');
        });
});

  

app.listen(port, () => { // this is requesting the path - basically an event listener 
    console.log(`Server listening on port: ${port}`);
})