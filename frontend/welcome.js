const lobby = "lobbyWeb1";

document.getElementById("submitUsername").onclick = async function(){

    const data = {
        username: userInput.value,
        lobby: lobby,
    }

    const url = "https://us-central1-hacktx-293504.cloudfunctions.net/game/register";

    fetch(url, {
        method: 'POST', 
        mode: 'cors', 
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    }).then(response => response.json()).then( data => {
        console.log(data);

        if (data.success){
            location.href = "lobbyRoom.html?" + userInput.value;
        }
        else {
            document.getElementById("errorMessage").innerHTML = data.message;
        }




    });
}