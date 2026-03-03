import { Server } from "socket.io";
import { httpServer, PORT } from "./app.ts";

export const io = new Server(httpServer, {
  cors: {
    origin: ["https://192.168.1.7:3003", "http://localhost:3002"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  socket.join(`connection_id: ${socket.id}`);
});

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
