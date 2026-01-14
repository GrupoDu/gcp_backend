import express, { type Request, type Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import ProductRoutes from "./routes/product.route.js";
import UserRoutes from "./routes/user.route.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use("/products", ProductRoutes);
app.use("/users", UserRoutes);

app.get("/", (req: Request, res: Response) => res.json({ status: "ok" }));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
