//import libraries
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as bodyParser from "body-parser";
import * as cors from "cors";

//initialize firebase inorder to access its services
admin.initializeApp(functions.config().firebase);

//initialize express server
const app = express();

//add the path to receive request and set json as bodyParser to process the body 
app.use(cors({ origin: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.raw());

//initialize the database and the collection 
const db = admin.firestore();

//define google cloud function name
export const game = functions.https.onRequest(app);


app.post('/register', async (req, res) => {
    const wordListSize = 20;
    const wordbank = ['Coffee', 'Water bottle', 'Football', 'Toy', 'T-Shirt', 'Fan', 'Apple', 'Cauliflower', 'Towel', 'Avocado', 'Doll', 'Melon', 'Spinach', 'Sunglasses', 'Action figure', 'Toast', 'Pepperoni', 'Baseball', 'Ball', 'Sweater', 'Bicycle', 'Smile', 'Knee', 'Headphones', 'Hot Dog', 'Boot', 'Shorts', 'Screwdriver', 'Pecan', 'Battery', 'Laptop', 'Monitor', 'Naruto']
    const lobby = req.body['lobby'];
    const username = req.body['username'];
    let team: string;
    let team1Size = 0;
    let team2Size = 0;


    if (!lobby || !username) {
        return res.status(400).json({
            message: 'You are missing the username or lobby, or both',
            success: false
        });
    }

    const lobbyDoc = await db.collection('lobbies').doc(lobby).get();
    const newLobby = !lobbyDoc.exists;

    // if a player is joining for the first time, create lobby and word list
    if (newLobby) {
        // generate wordlist
        let n = wordListSize;
        let len = wordbank.length;
        const wordlist = new Array(n);
        const taken = new Array(len);

        while (n--) {
            const x = Math.floor(Math.random() * len);
            wordlist[n] = {
                word: wordbank[x in taken ? taken[x] : x],
                attempts: 0,
                solved: false,
                solver: '',
                solutionUrl: ''
            }
            taken[x] = --len in taken ? taken[len] : len;
        }


        // create lobby
        await db.collection('lobbies').doc(lobby).set({
            started: -1,
            ended: -1,
            team1Size: 0,
            team2Size: 0
        });

        // create teams
        await db.collection(`lobbies/${lobby}/teams`).doc('Team_1').set({
            wordlist: wordlist,
            players: []
        });
        await db.collection(`lobbies/${lobby}/teams`).doc('Team_2').set({
            wordlist: wordlist,
            players: []
        });
    }
    else {
        team1Size = lobbyDoc.data()?.team1Size;
        team2Size = lobbyDoc.data()?.team2Size;
    }

    const playerDoc = await db.collection(`lobbies/${lobby}/players`).doc(username).get();

    if (playerDoc.exists) {
        return res.status(403).json({
            message: 'That user already exists!',
            success: false
        });
    }
    else {
        // determine team
        if (team1Size <= team2Size) {
            team = 'Team_1';
        }
        else {
            team = 'Team_2';
        }

        // add them to the users collection
        await db.collection(`lobbies/${lobby}/players`).doc(username).set({
            username: username,
            imagesFound: [],
            team: team
        });

        // add them to the team's players
        await db.collection(`lobbies/${lobby}/teams`).doc(team).update({
            players: admin.firestore.FieldValue.arrayUnion(username)
        })

        // increment the team size
        let teamIncrement: any;
        if (team === 'Team_1') {
            teamIncrement = {
                team1Size: admin.firestore.FieldValue.increment(1)
            }
        }
        else {
            teamIncrement = {
                team2Size: admin.firestore.FieldValue.increment(1)
            }
        }
        await db.collection('lobbies').doc(lobby).update(teamIncrement);

        return res.status(200).json({
            message: `${username} has been added to team ${team}!`,
            team: team,
            newLobby: newLobby,
            success: true
        });
    }
});

/*
app.post('/upload', async (req, res) => {
    const imageUrl = req.body['img']
    const username = req.body['usr']
    const lobby = req.body['lobby']
    const word = req.body['word']
    let team: string;

    // make sure everything was passed in
    if (!imageUrl || !username || !lobby || !word) {
        return res.status(400).json({
            message: 'You need an image URL in img, a username in usr, a lobby in lobby, and the target word in word',
            success: false
        });
    }

    /// validation ///
    
    // first make sure the lobby and player exist
    const playerDoc = await db.collection(`lobbies/${lobby}/players`).doc(username).get();
    if (!playerDoc.exists) {
        return res.status(404)
    }
    team = playerDoc.data()!.team;

    // then make sure the word exists and is unsolved
    const teamDoc = await db.collection(`lobbies/${lobby}/teams/${team}`)
    
});
*/