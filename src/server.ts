import express from "express";
import cors from "cors";
import { router } from "./routes.js";
import { errorMiddleware } from "./middlewares/ErrorMiddleware.js";

const server = express();
server.use(cors());
server.use(express.json());
server.use(router);
server.use(errorMiddleware); // ⚠️ always last
export { server };