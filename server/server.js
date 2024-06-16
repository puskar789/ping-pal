// package
import express from "express";
import dotenv from "dotenv";

// files
import authRoutes from "./routes/auth.routes.js";
import connectToMongoDB from "./db/connectToMongoDB.js";

const app = express();
const PORT = process.env.PORT || 5000;

dotenv.config();

// app.get("/", (req, res) => {
//   res.send("Server is up and running");
// });

// middlewares
app.use(express.json()); // to parse incoming JSON payload from req.body
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server is running on port ${PORT}`);
});
