var url = document.URL;
var userName = url.substring(url.indexOf("?") + 1);
console.log(userName);

//create get function for user info from DB

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

  var team1Ref = db.collection("lobbies/lobbyWeb1/teams").doc("Team_1");
  var team2Ref = db.collection("lobbies/lobbyWeb1/teams").doc("Team_2");

team1Ref.get().then(function(doc) {
    if (doc.exists) {
        console.log("Document data:", doc.data());
        
        dataFromFirestore = doc.data();
        document.getElementById("team1-players").innerHTML = ""
        document.getElementById("team1-players").innerHTML = "<b>Team 1</b>"

        for (var i = 0; i< dataFromFirestore.players.length; i++){

        document.getElementById("team1-players").innerHTML = document.getElementById("team1-players").innerHTML + "<br>" + dataFromFirestore.players[i]
        }
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
}).catch(function(error) {
    console.log("Error getting document:", error);
});

team2Ref.get().then(function(doc) {
    if (doc.exists) {
        console.log("Document data:", doc.data());
        
        dataFromFirestore = doc.data();
        document.getElementById("team2-players").innerHTML = ""
        document.getElementById("team2-players").innerHTML = "<b>Team 2</b>"
        

        for (var i = 0; i< dataFromFirestore.players.length; i++){
        document.getElementById("team2-players").innerHTML = document.getElementById("team2-players").innerHTML + "<br>" + dataFromFirestore.players[i]
        }
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
}).catch(function(error) {
    console.log("Error getting document:", error);
});

db.collection("lobbies/lobbyWeb1/teams").doc("Team_1")
.onSnapshot(function(doc) {
    var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
    console.log(source, " data: ", doc.data());
    dataFromFirestore = doc.data();
        document.getElementById("team1-players").innerHTML = ""
        document.getElementById("team1-players").innerHTML = "<b>Team 1</b>"

        for (var i = 0; i< dataFromFirestore.players.length; i++){

        document.getElementById("team1-players").innerHTML = document.getElementById("team1-players").innerHTML + "<br>" + dataFromFirestore.players[i]
        }
});

db.collection("lobbies/lobbyWeb1/teams").doc("Team_2")
.onSnapshot(function(doc) {
    var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
    console.log(source, " data: ", doc.data());
    dataFromFirestore = doc.data();
        document.getElementById("team2-players").innerHTML = ""
        document.getElementById("team2-players").innerHTML = "<b>Team 2</b>"

        for (var i = 0; i< dataFromFirestore.players.length; i++){

        document.getElementById("team2-players").innerHTML = document.getElementById("team2-players").innerHTML + "<br>" + dataFromFirestore.players[i]
        }
});