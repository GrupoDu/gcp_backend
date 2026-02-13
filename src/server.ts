import express, { type Request, type Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import ProductRoutes from "./routes/product.routes.js";
import UserRoutes from "./routes/user.routes.js";
import GoalRoutes from "./routes/goal.routes.js";
import ProductionOrderRoutes from "./routes/productionOrder.routes.js";
import EmployeeRoutes from "./routes/employee.routes.js";
import AuthRoutes from "./routes/auth.routes.js";
import EmployeeAnalysisRoutes from "./routes/employeeAnalysis.routes.js";
import ProductionOrderAnalysisRoutes from "./routes/productionOrderAnalysis.routes.js";
import GoalsAnalysisRoutes from "./routes/goalsAnalysis.routes.js";
import AnualAnaylsisRoutes from "./routes/anualAnalysis.router.js";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  }),
);
app.use("/products", ProductRoutes);
app.use("/users", UserRoutes);
app.use("/goals", GoalRoutes);
app.use("/productionOrder", ProductionOrderRoutes);
app.use("/employees", EmployeeRoutes);
app.use("/login", AuthRoutes);
app.use("/employees-analysis", EmployeeAnalysisRoutes);
app.use("/productionOrderAnalysis", ProductionOrderAnalysisRoutes);
app.use("/anualAnalysis", AnualAnaylsisRoutes);
app.use("/goalsAnalysis", GoalsAnalysisRoutes);

app.get("/status", (req: Request, res: Response) => res.json({ status: "ok" }));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
