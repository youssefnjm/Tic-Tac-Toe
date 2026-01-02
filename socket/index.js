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
        opponent.inGame = true;
      
        const game = {
          player1: currentUser.username,
          player2: opponent.username,
        };
      
        playedGames.push(game);
      
        io.to(currentUser.socketId).emit("opponentFound", game);
        io.to(opponent.socketId).emit("opponentFound", game);
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