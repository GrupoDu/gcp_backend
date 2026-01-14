import express, { type Request, type Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import ProductRoutes from "./routes/product.routes.js";
import UserRoutes from "./routes/user.routes.js";
import GoalRoutes from "./routes/goal.routes.js";
import RegisterRoutes from "./routes/register.routes.js";
import EmployeeRoutes from "./routes/employee.routes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use("/products", ProductRoutes);
app.use("/users", UserRoutes);
app.use("/goals", GoalRoutes);
app.use("/registers", RegisterRoutes);
app.use("/employees", EmployeeRoutes);

app.get("/", (req: Request, res: Response) => res.json({ status: "ok" }));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
