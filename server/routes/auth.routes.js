import express from "express";
import { signup, login, logput } from "../controllers/auth.controllers.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logput);

export default router;
