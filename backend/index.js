const express = require('express');
const server = express();
const cors = require('cors');
const mongoose = require('mongoose');
main().catch(err => console.log(err));
const { addEntry } = require('./controller/numberPlate-controller');

async function main() {
    try {
        await mongoose.connect('mongodb+srv://sainathshetty172:ticket1234@cluster0.xo9pkpk.mongodb.net/').then(() => server.listen(5000));
        console.log('db connected')
    } catch (err) {
        console.log(err);
    }
    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}



const bodyParser = require('body-parser');
server.use(cors());
server.use(bodyParser.json())

server.post("/vehicle/enter", addEntry);
// server.delete("/vehicle/exit", exitEntry);