import express from "express";
import router from "./routes/index";
import errorHandler from "./middlewares/errorHandler";
import cors from "cors";

const app = express();

app.use(express.json());

app.use(cors());

app.use("/", router);

app.use(errorHandler);

export default app;
