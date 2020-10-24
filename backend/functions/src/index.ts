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
    const wordListSize = 20;
    const wordbank = ['Coffee', 'Water bottle', 'Football', 'Toy', 'T-Shirt', 'Fan', 'Apple', 'Cauliflower', 'Towel', 'Avocado', 'Doll', 'Melon', 'Spinach', 'Sunglasses', 'Action figure', 'Toast', 'Pepperoni', 'Baseball', 'Ball', 'Sweater', 'Bicycle', 'Smile', 'Knee', 'Headphones', 'Hot Dog', 'Boot', 'Shorts', 'Screwdriver', 'Pecan', 'Battery', 'Laptop', 'Monitor', 'Naruto']
    const lobby = req.body['lobby'];
    const username = req.body['username'];
    let team: string;


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
            ended: -1
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

    const playerDoc = await db.collection(`lobbies/${lobby}/players`).doc(username).get();

    if (playerDoc.exists) {
        return res.status(403).json({
            message: 'That user already exists!',
            success: false
        });
    }
    else {
        // add them to the users collection
        await db.collection(`lobbies/${lobby}/players`).doc(username).set({
            username: username,
            imagesFound: []
        });
        // add them to a team
        await db.collection(`lobbies/${lobby}/teams`).doc('Team_1').get().then(async (team1Doc) => {
            await db.collection(`lobbies/${lobby}/teams`).doc('Team_2').get().then(async (team2Doc) => {
                const team1Players = team1Doc.data()?.players;
                const team2Players = team2Doc.data()?.players;
                if (team1Players.length <= team2Players.length) {
                    team1Players.push(username);
                    await db.collection(`lobbies/${lobby}/teams`).doc('Team_1').update({
                        players: team1Players
                    });
                    team = 'Team 1';
                }
                else {
                    team2Players.push(username);
                    await db.collection(`lobbies/${lobby}/teams`).doc('Team_2').update({
                        players: team2Players
                    });   
                    team = 'Team 2';             
                }
            });

        });

        return res.status(200).json({
            message: `${username} has been added to team ${team!}!`,
            newLobby: newLobby,
            success: true
        });
    }
});

app.post('/')
