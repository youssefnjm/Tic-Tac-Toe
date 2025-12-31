import { createServer } from "http";
import { Server } from "socket.io";

const onlignUser = [];

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
        let isexist = false;
        
        onlignUser.map((ele) => {
            if (ele.username === username || ele.socketId === socket.id) {
                isexist = true;
                return ;
            }
        })
        
        if (!isexist) {
            onlignUser.push({
                socketId: socket.id,
                username: username,
                inGame: false
            });
        }
        
        console.log(onlignUser);
    });

    socket.on("searchOpponent", (username) => {
        // onlignUser.map();
    })

    io.on("disconnect", () => {
        console.log("🔴 Socket disconnected:", socket.id);
    });
});

httpServer.listen(3000, () => {
    console.log("server is running in http://localhost:3000");
});