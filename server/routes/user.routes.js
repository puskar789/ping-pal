import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import {
  deleteUser,
  getUsersForSidebar,
  updateProfilePic,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", protectRoute, getUsersForSidebar);
router.put("/update/:id", protectRoute, updateProfilePic);
router.delete("/delete", protectRoute, deleteUser);

export default router;
