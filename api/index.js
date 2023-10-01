import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
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
} catch (e) {
    console.error(e);
}

let db = conn.db('coder');

const submitHandler = async (event, context) => {
    try {
        let collection = await db.collection('participants');
        let newDocument = JSON.parse(event.body);
        newDocument.date = new Date();
        let result = await collection.insertOne(newDocument);

        return {
            statusCode: 200,
            body: JSON.stringify(result),
        };
    } catch (e) {
        console.error(e);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' }),
        };
    }
};

export { app, submitHandler };
