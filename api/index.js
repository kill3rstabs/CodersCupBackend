import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
app.use(cors());
app.use(bodyParser.json());

const connectionString = process.env.MONGOURI || '';

const client = new MongoClient(connectionString);

let conn;
try {
    conn = await client.connect();
    console.log('Connected to MongoDB');
} catch (e) {
    console.error(e);
}

let db = await conn.db('coder');

export default db;

app.get('/', async (req, res) => {
    try {
        let collection = await db.collection('participants');
        let result = await collection.find({}).toArray();
        res.send(result);
        console.log(result);
    } catch (e) {
        console.error(e);
    }
});

// app.post('/submit', async (req, res) => {
//     try {
//         let collection = await db.collection('participants');
//         let newDocument = req.body;
//         newDocument.date = new Date();
//         let result = await collection.insertOne(newDocument);
//         res.send(result);
//     } catch (e) {
//         console.error(e);
//     }
// });

app.post('/email', async (req, res) => {
    try {
        let collection = await db.collection('participants');
        let query = { "data.leaderEmail": req.body.email};
        let result = await collection.find(query).toArray();
        let query1 = { "data.mem1Email": req.body.email };
        let result1 = await collection.find(query1).toArray();
        let query2 = { "data.mem2Email": req.body.email };
        let result2 = await collection.find(query2).toArray();
        if (result.length > 0 || result1.length > 0 || result2.length > 0) {
            res.send(true);
        }
        else {
            res.send(false);
        }       
    } catch (e) {
        console.error(e);
    }
})


app.post('/id', async (req, res) => {
    try {
        let collection = await db.collection('participants');
        let query = { "data.leaderId": req.body.id };
        let result = await collection.find(query).toArray();
        let query1 = { "data.mem1Id": req.body.id };
        let result1 = await collection.find(query1).toArray();
        let query2 = { "data.mem2Id": req.body.id };
        let result2 = await collection.find(query2).toArray();
        if (result.length > 0 || result1.length > 0 || result2.length > 0) {
            res.send(true);
        } else {
            res.send(false);
        }
        
    } catch (e) {
        console.error(e);
    }
})

app.post('/team', async (req, res) => {
    try {
        let collection = await db.collection('participants');
        let query = { "data.teamName": req.body.team };
        let result = await collection.find(query).toArray();
        if (result.length > 0) {
            res.send(true);
        } else {
            res.send(false);
        }
    } catch (e) {
        console.error(e);
    }   
})
app.listen(5000, () => console.log('Server ready at http://localhost:5000'));
