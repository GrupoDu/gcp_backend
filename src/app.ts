import express, { type Request, type Response, type Express } from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger.json" with { type: "json" };
import ProductRoutes from "./routes/product.routes.js";
import UserRoutes from "./routes/user.routes.js";
import GoalRoutes from "./routes/goal.routes.js";
import ProductionOrderRoutes from "./routes/productionOrder.routes.js";
import EmployeeRoutes from "./routes/employee.routes.js";
import AuthRoutes from "./routes/auth.routes.js";
import EmployeeAnalysisRoutes from "./routes/employeeAnalysis.routes.js";
import ProductionOrderAnalysisRoutes from "./routes/productionOrderAnalysis.routes.js";
import AnualAnaylsisRoutes from "./routes/anualAnalysis.routes.js";
import FeedbackRoutes from "./routes/feedback.routes.js";
import InOutStockRoutes from "./routes/inoutStock.routes.js";
import StockUpdatesRoutes from "./routes/stockUpdates.routes.js";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import AssistantsPoRegistersRoutes from "./routes/assistantsPoRegisters.routes.js";
import DeliverProductionOrderRoutes from "./routes/deliverProductionOrder.routes.js";
import OrdersRoutes from "./routes/orders.routes.js";
import OrderItemsRoutes from "./routes/orderItems.routes.js";
import StockOperationRoutes from "./routes/stockOperation.routes.js";

dotenv.config();
const app: Express = express();
const PORT = process.env.DEV_PORT || 8000;
const httpServer = createServer(app);
const FRONTEND_URL = process.env.FRONTEND_URL || "";
const DEV_URL = process.env.DEV_URL || "";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(cookieParser());
app.use(
  cors({
    origin: [FRONTEND_URL, DEV_URL, "http://192.168.1.7:3000"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  }),
);
app.use("/products", ProductRoutes);
app.use("/users", UserRoutes);
app.use("/goals", GoalRoutes);
app.use("/production-orders", ProductionOrderRoutes);
app.use("/employees", EmployeeRoutes);
app.use("/login", AuthRoutes);
app.use("/employees-analysis", EmployeeAnalysisRoutes);
app.use("/production-order-analysis", ProductionOrderAnalysisRoutes);
app.use("/anual-analysis", AnualAnaylsisRoutes);
app.use("/feedback", FeedbackRoutes);
app.use("/in-out-stock", InOutStockRoutes);
app.use("/stock-updates", StockUpdatesRoutes);
app.use("/assistants-po-registers", AssistantsPoRegistersRoutes);
app.use("/deliver-production-order", DeliverProductionOrderRoutes);
app.use("/orders", OrdersRoutes);
app.use("/order-items", OrderItemsRoutes);
app.use("/stock-operation", StockOperationRoutes);

app.get("/health", (req: Request, res: Response) => res.json({ status: "ok" }));

export { app, httpServer, PORT };
