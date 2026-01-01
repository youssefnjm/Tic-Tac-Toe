import { createIcons, X, Circle, createElement, MoveLeft, User } from 'lucide';
import Swal from 'sweetalert2';
import { io } from "socket.io-client"

createIcons({
    icons: {
        X,
        Circle,
        MoveLeft,
        User,
    }
});

const XIcon = createElement(X, {
    class: ['w-35 h-35 text-amber-500'],
    'stroke-width': 3,
});
const CircleIcon = createElement(Circle, {
    class: ['w-35 h-35 text-amber-500'],
    'stroke-width': 3,
});

const sweetAlert = (winner) => {
    Swal.fire({
        title: `congrats ${winner} win!`,
        icon: "success",
        draggable: true
    }).then(() => window.location.reload());
};


let turn = "player1"
let arr = Array(9);

const notifyTheTurn = (turn) => {
    const turnMessage = document.getElementById("turnMessage");
    let message = `i'ts ${turn} turn`
    turnMessage.innerText = message;
};

const Isfinish = (winner) => {
    const winPossibilities = [
        // rows
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        
        // columns
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        
        // diagonals
        [0, 4, 8],
        [2, 4, 6],
    ];

    winPossibilities.map((ele) => {
        if (arr[ele[0]] !== undefined && arr[ele[1]] !== undefined && !arr[ele[0]] !== undefined) {
            if (arr[ele[0]] === arr[ele[1]] && arr[ele[2]] === arr[ele[0]]) {
                sweetAlert(winner);
                return ;
            }
        }
    });

    if (turn === "player1")
        notifyTheTurn("player2");
    else
        notifyTheTurn("player1");
};



if (document.location.pathname === "/localGame.html")
{
    const box = document.getElementById("box");
    
    for (const child of box.children) {
        child.addEventListener("click", () => {
    
            console.log(child.getAttribute("id"));
    
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
}

if (document.location.pathname === "/remoteGame.html") {

    const form = document.getElementById("form");

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const username = document.getElementById("username").value;

        const socket = io("http://localhost:3000");

        socket.emit("addNewUser", username);

        socket.emit("searchOpponent", username);

        console.log(username.value);
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

}
