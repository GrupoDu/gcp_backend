import { Server } from "socket.io";
import { httpServer, PORT } from "./app.ts";

const HTTPS_PORT = 8003;
const HTTP_PORT = 8001;

export const io = new Server(httpServer, {
  cors: {
    origin: [
      `https://192.168.1.7:${HTTPS_PORT}`,
      `http://localhost:${HTTP_PORT}`,
    ],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  socket.join(`connection_id: ${socket.id}`);
});

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
