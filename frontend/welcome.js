const lobby = "lobbyWeb1";

document.getElementById("submitUsername").onclick = function(){

    const data = {
        username: userInput.value,
        lobby: lobby,
    }

    const url = "https://us-central1-hacktx-293504.cloudfunctions.net/game/register";

    const response = await fetch(url, {
        method: 'POST', 
        mode: 'cors', 
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });

    console.log(response.json());
}