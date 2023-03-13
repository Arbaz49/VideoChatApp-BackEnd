import express from "express"
import cors from "cors";
import http from "http";
import { Server} from "socket.io";

const app = express();
const server=http.createServer(app);
const io=new Server(server,{
    cors:{
        origin:"*",
        methods:["GET", "POST"]
    }
});

app.use(cors());
const PORT=7000;
app.get('/', (req, res) => {
	res.send('Running');
});

io.on("connection", (socket) => {
	socket.emit("me", socket.id);

	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded")
	});

	socket.on("callUser", ({ userToCall, signalData, from, name }) => {
		io.to(userToCall).emit("callUser", { signal: signalData, from, name });
	});

	socket.on("answerCall", (data) => {
		io.to(data.to).emit("callAccepted", data.signal)
	});
});

server.listen(PORT,()=>{
    console.log("server listening on port 7000")
});



