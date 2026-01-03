import { createIcons, X, Circle, createElement, MoveLeft, User } from 'lucide';
import Swal from 'sweetalert2';

// let socket = null;
let gameStarted = false;

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

const waitAlert = () => {
    Swal.fire({
        title: "searching for opponent!",
        html: "<p>don't close the window<p/>",
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    const interval = setInterval(() => {
        if (localStorage.getItem("gameStarted") === "true") {
          clearInterval(interval);
          Swal.close();
        }
    }, 200);
}


export { XIcon, CircleIcon, sweetAlert, waitAlert, gameStarted };