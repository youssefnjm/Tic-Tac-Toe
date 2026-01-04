import { createServer } from "http";
import { Server } from "socket.io";

const onlignUser = [];
const playedGames = [];

const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
      origin: "*",
      credentials: true,
    },
});

io.on("connection", (socket) => {
    console.log("🟢 New socket connected:", socket.id);

    socket.on("addNewUser", (username) => {
        let isExist = false;
        
        onlignUser.map((ele) => {
            if (ele.username === username || ele.socketId === socket.id) {
                isExist = true;
                return ;
            }
        })
        
        if (!isExist) {
            onlignUser.push({
                socketId: socket.id,
                username: username,
                playWith: '',
                inGame: false,
            });
        }
        
        console.log("\n-------------------------addNewUser", onlignUser);
    });

    socket.on("searchOpponent", () => {
        const currentUser = onlignUser.find(
          (user) => user.socketId === socket.id
        );
      
        if (!currentUser || currentUser.inGame) return;
      
        const opponent = onlignUser.find(
          (opennet) => opennet.inGame === false && opennet.socketId !== socket.id
        );
      
        if (!opponent) return ;
      
        currentUser.inGame = true;
        currentUser.playWith = 'X';
        opponent.inGame = true;
        opponent.playWith = 'O';
      
        const game = {
          player1: currentUser,
          player2: opponent,
        //   arr: Array(9).fill(0),
        };
      
        playedGames.push(game);

        console.log("\n-------------------------searchOpponent", game);
      
        io.to(currentUser.socketId).emit("opponentFound", game);
        io.to(opponent.socketId).emit("opponentFound", game);
    });
      
    socket.on("setMove", (player, game, cardId) => {
        const opponent = game.player1.username !== player ? game.player1 : game.player2;
        const currentUser = game.player1.username === player ? game.player1 : game.player2;

        console.log("\n-------------------------setMove", opponent, currentUser, cardId);

        if (opponent) {
            io.to(opponent.socketId).emit("getMove", cardId, currentUser);
            io.to(opponent.socketId).emit("changeTurn", opponent);
            io.to(currentUser.socketId).emit("changeTurn", opponent);
        }
    });
    
    socket.on("setWinner", (game, winner) => {
        // console.log("\n-------------------------setWinner", game);
        playedGames = game.filter((ele) => {
            return (ele.player1.username !== game.player1.username && ele.player2.username !== game.player2.username);
        });

        console.log(playedGames);

        io.to(game.player1.socketId).emit("braodCastWinner", winner);
        io.to(game.player2.socketId).emit("braodCastWinner", winner);
    });

    io.on("disconnect", () => {
        console.log("🔴 Socket disconnected:", socket.id);
        onlignUser = onlignUser.filter((ele) => {
            return (ele.socketId !== socket.id);
        });
        console.log(`\n-------------------------is disconnected`, onlignUser);
    });
});


httpServer.listen(3000, "0.0.0.0", () => {
    console.log("server is running in http://localhost:3000");
});