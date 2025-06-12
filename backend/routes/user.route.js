import express from "express";
import { checkLoginStatus, login, logout, register, updateProfile } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/mutler.js";

const router = express.Router();

router.post("/register",singleUpload, register);
router.post("/login", login);
router.get("/logout",isAuthenticated, logout);
router.put("/update-profile/:id", isAuthenticated, singleUpload, updateProfile);
router.get("/check-login-status", isAuthenticated, checkLoginStatus);

export default router;