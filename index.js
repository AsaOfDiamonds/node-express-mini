// implement your API here
// import db from './data/db.js'; // ES2015 Modules
const express = require('express');

const db = require('./data/db.js'); // CommonJS Modules

const server = express();

// wire up global middleware
server.use(express.json()); // teaches express how to parse json from the body

server.get('/api/users', (req, res) => {
    db.find()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(err => {
            res.json(err);
        });
});

server.get('/api/users/:id', (req, res) => {
    const id = req.params.id;

    db.findById(id)
        .then(user => {
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        })
        .catch(err => res.status(500).json(err));
});

server.post('/api/users', (req, res) => {
    const userInfo = req.body; // reads information from the body of the request

    db.insert(userInfo) // returns a promise, so we need to use .then
        .then(result => {
            db.findById(result.id)
                .then(user => {
                    res.status(201).json(user);
                })
                .catch(err =>
                    res.status(500).json({ message: 'the get by id failed', error: err })
                );
        })
        .catch(err =>
            res.status(500).json({ message: 'the post failed', error: err })
        );
});

server.delete('/api/users/:id', (req, res) => {
    const id = req.params.id;

    db.findById(id)
        .then(user => {
            if (user) {
                db.remove(id).then(count => {
                    res.status(200).json(user);
                });
            } else {
                res
                    .status(404)
                    .json({ message: 'The user with the specified ID does not exist.' });
            }
        })
        .catch(err => res.status(500).json(err));
});

server.get('/users/first/:first/last/:last', (req, res) => {
    res.send({ hello: `${req.params.first} ${req.params.last}` });
});

// /greet?first=kai&last=Lovingfoss
server.get('/greet', (req, res) => {
    const { first, last } = req.query;

    res.send({ Greetings: `${first} ${last}` });
});

server.put('/api/users/:id', async (req, res) => {
    const id = req.params.id;
    const changes = req.body;

    try {
        const result = await db.update(id, changes);

        console.log('result', result);

        res.status(200).json(result);
    } catch (err) {
        res.status(500).json(err);
    }
});

server.listen(5000, () => console.log('server running'));

//https://github.com/orgs/LambdaSchool/people

// Cannot find module 'express' > npm i express || yarn add express
// Cannot POST /api/user

// client > server: Accept header (application/json)
// server > client: Content-Type: (application/json; text/html)
