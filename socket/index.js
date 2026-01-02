import { createServer } from "http";
import { Server } from "socket.io";

const onlignUser = [];
const playedGames = [];

const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:1234",
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
                inGame: false,
            });
        }
        
        console.log(onlignUser);
    });

    socket.on("searchOpponent", (username) => {
        if (!username || onlignUser.length <= 1) return;

        let currentGame;
        
        const intervalId = setInterval(() => {
            onlignUser.map((ele) => {
                if (ele.inGame === false || ele.username !== username) {
                    ele.inGame = true;
                    const currentUser = onlignUser.find((ele) => ele.username === username);
                    currentUser.inGame = true;
    
                    currentGame = playedGames.find((ele) => ele.player1 === username || ele.player2 === username);
                    if (!currentGame) {
                        currentGame = {
                            player1: username,
                            player2: ele.username,
                        }
                        playedGames.push(currentGame);
                    };

                    clearInterval(intervalId);
                }
            });
        }, 500);

        io.to(socket.id).emit("opponentFound", { messages: "opponent found!!!", currentGame });
    
    });

    io.on("disconnect", () => {
        console.log("🔴 Socket disconnected:", socket.id);
        onlignUser = onlignUser.filter((ele) => {
            return (ele.socketId !== socket.id);
        });
        console.log(`is disconnected`, onlignUser);
    });
});


httpServer.listen(3000, () => {
    console.log("server is running in http://localhost:3000");
});