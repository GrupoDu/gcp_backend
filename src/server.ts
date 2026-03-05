import { Server } from "socket.io";
import { httpServer, PORT } from "./app.ts";

const FRONT_URL = process.env.FRONTEND_URL || "http://localhost:8000";

const ALLOWED_ORIGINS = [FRONT_URL];

export const io = new Server(httpServer, {
  cors: {
    origin: ALLOWED_ORIGINS,
    credentials: true,
    methods: ["GET", "POST"],
    allowedHeaders: ["Authorization", "Content-Type"],
  },
  transports: ["websocket", "polling"], // Polling como fallback
  pingTimeout: 60000,
  pingInterval: 25000,
  connectTimeout: 45000,
  allowEIO3: true,
  perMessageDeflate: false,
  path: "/socket.io",
  cookie: {
    name: "io",
    httpOnly: true,
    sameSite: "lax",
  },
});

// Middleware de autenticação (se precisar)
io.use((socket, next) => {
  const token =
    socket.handshake.auth.token || socket.handshake.headers.authorization;

  if (token) {
    // Validar token aqui se necessário
    // socket.data.userId = decoded.userId;
    next();
  } else {
    // Se não precisa de autenticação, apenas next()
    next();
  }
});

io.on("connection", (socket) => {
  console.log(
    `Cliente conectado: ${socket.id} | Transporte: ${socket.conn.transport.name}`,
  );

  // Join na sala (corrigindo a string template)
  socket.join(`connection_id:${socket.id}`);

  // Enviar confirmação de conexão
  socket.emit("connected", {
    socketId: socket.id,
    message: "Conectado ao servidor Socket.IO",
  });

  socket.on("disconnect", (reason) => {
    console.log(`Cliente ${socket.id} desconectado. Motivo: ${reason}`);
  });

  socket.on("error", (error) => {
    console.error(`Erro no socket ${socket.id}:`, error);
  });
});

// Graceful shutdown melhorado
process.on("SIGTERM", () => {
  console.log("SIGTERM recebido, iniciando graceful shutdown...");

  // Notificar clientes sobre o shutdown
  io.emit("server-shutdown", {
    message: "Servidor será desligado em 5 segundos",
    timestamp: Date.now(),
  });

  // Aguardar 5 segundos para clientes receberem a mensagem
  setTimeout(() => {
    io.close(() => {
      console.log("Todas as conexões Socket.IO fechadas");
      httpServer.close(() => {
        console.log("Servidor HTTP fechado");
        process.exit(0);
      });
    });
  }, 5000);
});

// Tratar outros sinais de término
process.on("SIGINT", () => {
  console.log("SIGINT recebido, desligando...");
  process.exit(0);
});

httpServer.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log("-----------------------------------");
  console.log(`Frontend: ${FRONT_URL}`);
});
