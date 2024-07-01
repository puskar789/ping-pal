// package
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";

// files
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";

import { app, server } from "./socket/socket.js";
import connectToMongoDB from "./db/connectToMongoDB.js";

// const app = express();
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

dotenv.config();

// app.get("/", (req, res) => {
//   res.send("Server is up and running");
// });

// middlewares
app.use(express.json()); // to parse incoming JSON payload from req.body
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

app.use(express.static(path.join(__dirname, "/client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

server.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server is running on port ${PORT}`);
});
