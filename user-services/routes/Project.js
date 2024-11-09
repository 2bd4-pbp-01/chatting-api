// import express from "express";
// import {
//     getUsers,
//     getUserById,
//     createUser,
//     updateUser,
//     deleteUser
// } from "../controllers/Users.js";
// import { operatorOnly } from "../middleware/AuthUser.js";
// import { verifyToken } from "../middleware/VerifyToken.js";

// const router = express.Router();

// router.get('/users', verifyToken, operatorOnly, getUsers);
// router.get('/users/:id', verifyToken, operatorOnly, getUserById);
// router.post('/users', verifyToken, operatorOnly, createUser);
// router.patch('/users/:id', verifyToken, operatorOnly, updateUser);
// router.delete('/users/:id', verifyToken, operatorOnly, deleteUser);

// export default router;