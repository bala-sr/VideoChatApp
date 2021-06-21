const Express = require("express");
const cors = require("cors");
const http = require('http');
// import {Server} from "socket.io;"
const app = Express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
    cors: {
        origin: true,
        methods: ["GET", "POST"]
    }
});
const dotenv = require("dotenv");
dotenv.config();

const port = process.env.PORT || 3200;

app.use(cors());

io.on("connection", (socket) => {
    socket.emit("me", socket.id)

    //Disconnect call
    socket.on("disconnect", () => {
        socket.broadcast.emit("Call Ended");
    })

    //Calling user
    socket.on("callUser", (data) => {
        io.to(data.userToCall).emit("callUser", {signal: data.signalData, from: data.from, name: data.name});
    })

    //Answering call
    socket.on("answerCall", (data) => {
        io.to(data.to).emit("callAccepted", data.signal)
    })
});

app.get("/", (req, res) => res.send("hello"));

server.listen(port, () => console.log("Server running in port ", port));
