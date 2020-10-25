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

var dataFromFirestore;
var wordList = [];

var db = firebase.firestore();



team1Ref.get().then(function (doc) {
    if (doc.exists) {
        console.log("Document data:", doc.data());

        dataFromFirestore = doc.data();
        document.getElementById("team1-players").innerHTML = ""

        for (var i = 0; i < dataFromFirestore.players.length; i++) {
            if (dataFromFirestore.players[i] == userName) {
                console.log("you are on TEAM 1")
                teamnumber = "Team_1"
            }

            document.getElementById("team1-players").innerHTML = document.getElementById("team1-players").innerHTML + "<br>" + dataFromFirestore.players[i]
        }
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
}).catch(function (error) {
    console.log("Error getting document:", error);
});

team2Ref.get().then(function (doc) {
    if (doc.exists) {
        console.log("Document data:", doc.data());

        dataFromFirestore = doc.data();
        document.getElementById("team2-players").innerHTML = ""

        for (var i = 0; i < dataFromFirestore.players.length; i++) {

            console.log("RAW" + dataFromFirestore.players[i])
            if (dataFromFirestore.players[i] == userName) {
                console.log("you are on TEAM 2")
                teamnumber = "Team_2"
            }
            document.getElementById("team2-players").innerHTML = document.getElementById("team2-players").innerHTML + "<br>" + dataFromFirestore.players[i]
        }
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
}).catch(function (error) {
    console.log("Error getting document:", error);
});

