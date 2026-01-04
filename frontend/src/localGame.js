import { XIcon, CircleIcon, sweetAlert } from "./index.js";

let turn = "player1";
let arr = Array(9);
const turnMessage = document.getElementById("turnMessage");
const box = document.getElementById("box");

const username = localStorage.getItem("username");
if (username) {
    // socket.emit("disconnect", username);
    localStorage.clear();
}

const Isfinish = (winner) => {
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

    winPossibilities.forEach((ele) => {
        if (arr[ele[0]] !== undefined && arr[ele[1]] !== undefined && !arr[ele[0]] !== undefined) {
            if (arr[ele[0]] === arr[ele[1]] && arr[ele[2]] === arr[ele[0]]) {
                sweetAlert(winner);
                return ;
            }
        }
    });

    if (turn === "player1") {
        let message = `i'ts player2 turn`;
        turnMessage.innerText = message;
    } else {
        let message = `i'ts player1 turn`;
        turnMessage.innerText = message;
    }
};

for (const child of box.children) {
    child.addEventListener("click", () => {

        if (child.childElementCount === 0) {
            if (turn === "player1") {
                child.appendChild(XIcon.cloneNode(true));
                
                arr[(child.getAttribute("id") - 1)] = "X";
                Isfinish("player2");
                
                turn = "player2";
            } else {
                child.appendChild(CircleIcon.cloneNode(true));

                arr[(child.getAttribute("id") - 1)] = "O";
                Isfinish("player1");

                turn = "player1";
            }
        }
    });
};
