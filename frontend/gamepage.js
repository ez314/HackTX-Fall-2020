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

  var lobbiesRef = db.collection("lobbies/Lobby1/teams").doc("Team_1");
  
  lobbiesRef.get().then(function(doc) {
    if (doc.exists) {

      dataFromFirestore = doc.data()

      for(var i = 0; i < dataFromFirestore.wordlist.length; i++){
    
      
        var container = document.getElementById("game-room-container")
        
        var sectionX = document.createElement('div')
        sectionX.className = "game-room itemMissing";
        sectionX.id = "sec"+ dataFromFirestore.wordlist[i].word
        sectionX.innerHTML = dataFromFirestore.wordlist[i].word

        var buttonX = document.createElement('input')
        buttonX.type = "file";
        buttonX.id = dataFromFirestore.wordlist[i].word
        buttonX.onchange = function(event){

          var re = /(?:\.([^.]+))?$/;

          const files = event.target.files
          const formData = new FormData()
          const formDataLink = new FormData()
          const now = Date.now(); // Unix timestamp in milliseconds
        
          var ext = re.exec(files[0].name)[1];
          formData.append('photo', files[0], String(now)+"."+ext)

          fetch('http://35.202.2.142:3000/upload', {
            method: 'POST',
            body: formData
          })
          .then(r =>  r.json().then(data => ({status: r.status, body: data})))
          .then(obj => console.log(obj))
          .catch(error => {
            console.error(error)
          })

        };
        
        container.appendChild(sectionX)
        container.appendChild(buttonX)
        
      }
        console.log("Document data:", doc.data());
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
}).catch(function(error) {
    console.log("Error getting document:", error);
});

db.collection("lobbies/Lobby1/teams").doc("Team_1")
.onSnapshot(function(doc) {
    var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
    console.log(source, " data: ", doc.data());
    dataFromFirestore = doc.data()
    var wordLists = dataFromFirestore.wordlist;

    for (var i = 0; i<wordLists.length; i++){

      if(wordLists[i].solved == true){

        var check = document.getElementById("sec" + wordLists[i].word)
        if(check != null){
        document.getElementById("sec" + wordLists[i].word).className= "game-room itemCompleted"
        document.getElementById(wordLists[i].word).remove();
        }
      }

    }
});