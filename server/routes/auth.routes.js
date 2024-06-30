import express from "express";
import {
  signup,
  login,
  logout,
  google,
} from "../controllers/auth.controllers.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/google", google);
router.post("/login", login);
router.post("/logout", logout);

export default router;
