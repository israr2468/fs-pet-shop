const fs = require('fs');
const path = require('path');
const http = require('http');

const petsPath = path.join(__dirname, 'pets.json');
const petRegExp = /^\/pets\/(.*)$/;
const port = 8000;

const server = http.createServer((req, res) => {
  console.log('incoming request');
  console.log(req.url);

  if (req.method === 'GET' && req.url === '/pets') {
    fs.readFile(petsPath, 'utf-8', (err, petsJSON) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.write('404 Not Found');
        res.end();
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.write(petsJSON);
      res.end();
    });
  } else if (req.method === 'GET' && petRegExp.test(req.url)) {
    // test() method tests for a match in a string.
    // If it finds a match, it returns true, otherwise it returns false.
    const index = Number(req.url.match(petRegExp)[1]);
    // index 1 for regex 
    // .match() is used to search a string, for a match, against a regular expression.
    // in this case we want to convert that stirng into a number
    fs.readFile(petsPath, 'utf-8', (err, petsJSON) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.write('404 Not found');
        res.end();
        return;
      }
      const pets = JSON.parse(petsJSON);
      if (index >= 0 && index < pets.length) {
        const petJSON = JSON.stringify(pets[index]);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(petJSON);
        res.end();
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.write('404 Not Found');
        res.end();
      }
    });
  } else if (req.method === 'POST' && req.url === '/pets') {
    let requestBody = '';
    req.on('data', (chunk) => {
      requestBody += chunk;
    });
    req.on('end', () => {
      const { name, age, kind } = JSON.parse(requestBody);

      if (!name || !age || !kind || isNaN(age)) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.write('400 Bad Request');
        res.end();
      } else {
        fs.readFile(petsPath, 'utf-8', (err, petsJSON) => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.write('Error reading pets file');
            res.end();
            return;
          }
          const pets = JSON.parse(petsJSON);
          const newPet = { name, age: Number(age), kind };
          pets.push(newPet);
          fs.writeFile(petsPath, JSON.stringify(pets), (err) => {
            if (err) {
              res.writeHead(400, { 'Content-Type': 'text/plain' });
              res.write('400 Bad Request');
              res.end();
              return;
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify(newPet));
            res.end();
          });
        });
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.write('404 Not Found');
    res.end();
  }
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
