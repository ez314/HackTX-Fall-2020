var url = document.URL;

const urlParams = new URLSearchParams(window.location.search);
const userName = urlParams.get('user');
const lobbyName = urlParams.get('lobby');
const teamnumber = urlParams.get('teamnumber');
console.log(userName + teamnumber);

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyCFO5lRTHMW8N0QG2r0gILho9o-vzlUzNw",
    authDomain: "hacktx-293504.firebaseapp.com",
    databaseURL: "https://hacktx-293504.firebaseio.com",
    projectId: "hacktx-293504",
    storageBucket: "hacktx-293504.appspot.com",
    messagingSenderId: "827070564073",
    appId: "1:827070564073:web:397e0602af594c0a4dd278"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var data;
var wordList = [];

var db = firebase.firestore();

var team1Ref = db.collection("lobbies/" + lobbyName + "/teams").doc("Team_1");
var team2Ref = db.collection("lobbies/" + lobbyName + "/teams").doc("Team_2");


// function that populates the tables
async function populate(teamRef, documentId) {
    teamRef.get().then(function (doc) {
        if (doc.exists) {
            console.log("Document data:", doc.data());

            let stats = new Map();

            doc.data().wordlist.forEach(wordObj => {
                if (wordObj.solved) {
                    if (!stats.has(wordObj.solver)) {
                        console.log(`First time for ${wordObj.solver}`);
                        stats.set(wordObj.solver, 0);
                    }
                    stats.set(wordObj.solver, stats.get(wordObj.solver) + 1);
                }
            });

            // create array sorted by points
            let sortedStats = Array.from(stats, ([key, value]) => ({ username: key, score: value }));
            sortedStats.sort((a, b) => {
                return (a.score > b.score ? -1 : a.score < b.score ? 1 : 0)
            });
            console.log(stats);
            console.log(sortedStats);

            sortedStats.forEach((x) => {
                document.getElementById(documentId).innerHTML += `<br><b>${x.username}</b><br>Score: ${x.score}`;
            })

        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function (error) {
        console.log("Error getting document:", error);
    });
}

// build points based off of user data
team1Ref.get().then(function (doc) {
    populate(team1Ref, 'team1-players');
});

team2Ref.get().then(function (doc) {
    populate(team2Ref, 'team2-players');
});
db.collection("lobbies").doc(lobbyName)
    .onSnapshot(function (doc) {
        var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
        console.log(source, " data: ", doc.data());
        data = doc.data();
        if (data.team1Score > data.team2Score) {
            document.getElementById("winner").innerHTML = "Winner: Team 1"
            //team 1 wins
        } else if (data.team1Score < data.team2Score) {
            document.getElementById("winner").innerHTML = "Winner: Team 2"
            //team 2wins
        } else {
            document.getElementById("winner").innerHTML = "It's a tie!"
            //tie
        }



    });

