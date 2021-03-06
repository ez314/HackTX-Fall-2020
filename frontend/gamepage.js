var url = document.URL;

const urlParams = new URLSearchParams(window.location.search);
const userName = urlParams.get('user');
const lobbyName = urlParams.get('lobby');
const teamnumber = urlParams.get('teamnumber');
console.log(userName + teamnumber);
const now = Date.now(); // Unix timestamp in milliseconds

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

db.collection("lobbies").doc(lobbyName).update({
  started: parseInt(now) + 5 * 60 * 1000
})
  .then(function () {
    console.log("Document successfully written!");
  })
  .catch(function (error) {
    console.error("Error writing document: ", error);
  });

var lobbiesRef = db.collection("lobbies/" + lobbyName + "/teams").doc(teamnumber);

lobbiesRef.get().then(function (doc) {
  if (doc.exists) {

    document.getElementById("game-room-header").innerHTML = "Search for your items <br> You are on Team " + teamnumber.replace( /^\D+/g, '') + "</b>"

    dataFromFirestore = doc.data()

    for (var i = 0; i < dataFromFirestore.wordlist.length; i++) {

      var container = document.getElementById("game-room-container")

      var sectionX = document.createElement('div')
      sectionX.className = "game-room itemMissing";
      sectionX.id = "sec" + dataFromFirestore.wordlist[i].word
      sectionX.innerHTML = dataFromFirestore.wordlist[i].word

      var fileLabel = document.createElement('label');
      fileLabel.htmlFor = dataFromFirestore.wordlist[i].word;
      fileLabel.className = "custom-file-upload";
      fileLabel.id= "label" + dataFromFirestore.wordlist[i].word;
      fileLabel.innerHTML = "Upload Image";

      var buttonX = document.createElement('input')
      buttonX.type = "file";
      buttonX.className = "fileUploadButton";
      buttonX.id = dataFromFirestore.wordlist[i].word
      buttonX.onclick = function (event) { this.value = null }
      buttonX.onchange = function (event) {

        var blackbackground = document.createElement('div')
        blackbackground.id = "blackbackground"
        document.body.prepend(blackbackground)

        tempWORD = event.target.id

        blackbackground.innerHTML = "<br><br> Your picture of <br>" + tempWORD + "<br>is processing<br> Please wait..."


        var re = /(?:\.([^.]+))?$/;

        const files = event.target.files
        const word = event.target.id
        const formData = new FormData()
        const formDataLink = new FormData()


        console.log(word)
        var ext = re.exec(files[0].name)[1];
        formData.append('photo', files[0], String(now) + "." + ext)
        const googleVision = {
          username: userName,
          imageurl: "http://fferli.com/photos/" + String(now) + "." + ext,
          lobby: lobbyName,
          word: word
        }
        console.log(googleVision)
        fetch('http://35.202.2.142:3000/upload', {
          method: 'POST',
          body: formData
        })
          .then(r => r.json().then(data => ({ status: r.status, body: data })))
          .then(obj => console.log(obj))
          .then(

            fetch('https://us-central1-hacktx-293504.cloudfunctions.net/game/upload', {
              method: 'POST',
              mode: 'cors',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(googleVision) // body data type must match "Content-Type" header
            }).then(response => response.json()).then(data => {
              blackbackground.remove();
              alert(data.accepted ? word + " accepted!" : word + " rejected :(");
              console.log(data);
            }))

          .catch(error => {
            blackbackground.remove();
            console.error(error)
          })

      };

      container.appendChild(sectionX)
      container.appendChild(fileLabel)
      container.appendChild(buttonX)

    }
    dataFromFirestore = doc.data()
    var wordLists = dataFromFirestore.wordlist;
    for (var i = 0; i < wordLists.length; i++) {

      if (wordLists[i].solved == true) {

        var check = document.getElementById("sec" + wordLists[i].word)
        if (check != null) {
          document.getElementById("sec" + wordLists[i].word).className = "game-room itemCompleted"
          
          //where do i find the user who submitted the correct answer?
          //alright lmemme push
          //ADD WHOEVER SUBMITTED IT HERE


          document.getElementById("label" + dataFromFirestore.wordlist[i].word).innerHTML = "Submitted by " + wordLists[i].solver;
          
          document.getElementById(wordLists[i].word).remove();
        }
      }

    }
    console.log("Document data:", doc.data());
  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
  }
}).catch(function (error) {
  console.log("Error getting document:", error);
});

db.collection("lobbies/" + lobbyName + "/teams").doc(teamnumber)
  .onSnapshot(function (doc) {
    var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
    console.log(source, " data: ", doc.data());
    dataFromFirestore = doc.data()
    var wordLists = dataFromFirestore.wordlist;

    for (var i = 0; i < wordLists.length; i++) {

      if (wordLists[i].solved == true) {

        var check = document.getElementById("sec" + wordLists[i].word)
        if (check != null) {
          document.getElementById("sec" + wordLists[i].word).className = "game-room itemCompleted"
          
          //ADD WHOEVER SUBMITTED IT HERE
          document.getElementById("label" + dataFromFirestore.wordlist[i].word).innerHTML = "Submitted by " + wordLists[i].solver;
          
          if (document.getElementById(wordLists[i].word) != null) {
            document.getElementById(wordLists[i].word).remove();
          }
        }
      }

    }
  });


