import express from "express";
import {Login, logOut, getMe, register} from "../controllers/Auth.js";
import { verifyToken } from "../middleware/VerifyToken.js";

const router = express.Router();


router.get('/me',verifyToken, getMe);
router.post('/login', Login);
router.delete('/logout', verifyToken,logOut);
router.post('/register', register);

export default router;