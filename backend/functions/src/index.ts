//import libraries
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as bodyParser from "body-parser";

//initialize firebase inorder to access its services
admin.initializeApp(functions.config().firebase);

//initialize express server
const app = express();

//add the path to receive request and set json as bodyParser to process the body 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.raw());

//initialize the database and the collection 
const db = admin.firestore();

//define google cloud function name
export const game = functions.https.onRequest(app);


app.post('/register', async (req, res) => {
    const lobby = req.body['lobby'];
    const username = req.body['username'];
    if (!lobby || !username) {
        return res.status(400).json({
            message: 'You are missing the username or lobby, or both',
            success: false
        });
    }

    const doc = await db.collection(`lobbies/${lobby}/users`).doc(username).get();

    if (doc.exists) {
        return res.status(403).json({
            message: 'That user already exists!',
            success: false
        });
    }
    else {
        await db.collection(`lobbies/${lobby}/users`).doc(username).set({
            username: username,
            imagesFound: []
        });
        return res.status(201).json({
            message: `${username} has been registered!`,
            success: true
        });
    }

});
