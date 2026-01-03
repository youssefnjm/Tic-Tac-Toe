import { waitAlert, sweetAlert, XIcon, CircleIcon } from "./index.js";
import { io } from "socket.io-client"

let socket = null;
let arr = Array(9).fill('0');

localStorage.setItem("gameStarted", false);

const box = document.getElementById("box");
const cards = '<div id="1" class="bg-amber-800 flex items-center justify-center cursor-pointer w-50 h-50 rounded-tl-2xl"></div><div id="2" class="bg-amber-800 flex items-center justify-center cursor-pointer w-50 h-50"></div><div id="3" class="bg-amber-800 flex items-center justify-center cursor-pointer w-50 h-50 rounded-tr-2xl"></div><div id="4" class="bg-amber-800 flex items-center justify-center cursor-pointer w-50 h-50"></div><div id="5" class="bg-amber-800 flex items-center justify-center cursor-pointer w-50 h-50"></div><div id="6" class="bg-amber-800 flex items-center justify-center cursor-pointer w-50 h-50"></div><div id="7" class="bg-amber-800 flex items-center justify-center cursor-pointer w-50 h-50 rounded-bl-2xl"></div><div id="8" class="bg-amber-800 flex items-center justify-center cursor-pointer w-50 h-50"></div><div id="9" class="bg-amber-800 flex items-center justify-center cursor-pointer w-50 h-50 rounded-br-2xl"></div>'
const paragraphe = document.getElementById("welcomeMessage");
const turnMessage = document.getElementById("turnMessage");

const show = () => {
    let line = "";

    arr.forEach((ele, index) => {
        line += ele;
        if ((index + 1) % 3 === 0) {
            console.log(line);
            line = "";
        } else {
            line += ",";
        }
    });

    if (line) console.log(line);
};


const Isfinish = (winner, game) => {
    const winPossibilities = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        
        [0, 4, 8],
        [2, 4, 6],
    ];

    winPossibilities.map((ele) => {
        if (arr[ele[0]] !== '0' && arr[ele[1]] !== '0' && !arr[ele[2]] !== '0') {
            if (arr[ele[0]] === arr[ele[1]] && arr[ele[2]] === arr[ele[0]]) {
                console.log(`${arr[ele[0]]} === ${arr[ele[1]]} && ${arr[ele[2]]} === ${arr[ele[0]]}`);
                socket.emit("setWinner", game, winner);
                return ;
            }
        }
    });
};


const form = document.getElementById("form");
let game = {};
form.addEventListener("submit", (e) => {
    e.preventDefault();
    socket = io("http://localhost:3000");
    
    if (!socket) return ;

    const username = document.getElementById("username").value;
    if (username && username.length !== 0) {
        localStorage.setItem("username", username);
        // add to onlineUsers
        socket.emit("addNewUser", username);
    
        // search for an opponent to play with
        socket.emit("searchOpponent", username);

        // when opponent foun do
        socket.on("opponentFound", (res) => {
            console.log("opponentFound", res);

            game = res;
            localStorage.setItem("gameStarted", "true");
            const currentUser = game.player1.username === username ? game.player1 : game.player2;

            // render Ui
            form.style.cssText = "display: none;";
            paragraphe.innerText = `${game?.player1.username} (X) vs ${game?.player2.username} (O)`;
            turnMessage.innerText = `i'ts ${game?.player1.username} turn`;
            let turn = game?.player1.username;
            box.innerHTML = cards;

            //change turn
            socket.on("changeTurn", (res) => {
                console.log("change turn", res);
                turn = res.username;

                turnMessage.innerText = `i'ts ${turn} turn`;
            });

            // get Opponent move
            socket.on("getMove", (cardId, opponent) => {
                console.log("getMove", opponent);
                const card = document.getElementById(cardId);

                arr[cardId - 1] = opponent.playWith;
                if (opponent.playWith === 'X')
                    card.appendChild(XIcon.cloneNode(true));
                else
                    card.appendChild(CircleIcon.cloneNode(true));
                
                show();
            });

            // finish the game
            socket.on("braodCastWinner", (winner) => { 
                console.log(winner);
                socket.disconnect();
                sweetAlert(winner);
            });

            // game logic
            for (const child of box.children) {
                child.addEventListener("click", () => {
            
                    if (child.childElementCount === 0)
                    {
                        if (turn === currentUser.username)
                        {
                            if (currentUser.playWith === 'X')
                                child.appendChild(XIcon.cloneNode(true));
                            else
                                child.appendChild(CircleIcon.cloneNode(true));

                            socket.emit("setMove", username, game, child.getAttribute("id"));
                            
                            arr[(child.getAttribute("id") - 1)] = currentUser.playWith;
                            show();
                            Isfinish(turn, game);

                        }
                    }
                });
            };
        });
        
        waitAlert();
    }
});
