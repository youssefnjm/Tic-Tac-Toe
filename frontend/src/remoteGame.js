import { socket, io, waitAlert, gameStarted } from "./index.js";

const form = document.getElementById("form");
localStorage.setItem("gameStarted", false);

form.addEventListener("submit", (e) => {
    e.preventDefault();
    

    const username = document.getElementById("username").value;
    localStorage.setItem("username", username);

    socket.emit("addNewUser", username);

    socket.emit("searchOpponent", username);
    socket.on("opponentFound", (res) => {
        console.log("opponentFound", res);
        localStorage.setItem("gameStarted", "true");
    });
    
    waitAlert();

    console.log(username);
});

// for (const child of box.children) {
//     child.addEventListener("click", () => {

//         console.log(child.getAttribute("id"));

//         if (child.childElementCount === 0) {
//             if (turn === "player1") {
//                 child.appendChild(XIcon.cloneNode(true));
                
//                 arr[(child.getAttribute("id") - 1)] = "X";
//                 Isfinish("player2");
                
//                 turn = "player2";
//             } else {
//                 child.appendChild(CircleIcon.cloneNode(true));

//                 arr[(child.getAttribute("id") - 1)] = "O";
//                 Isfinish("player1");

//                 turn = "player1";
//             }
//         }

//     });
// };