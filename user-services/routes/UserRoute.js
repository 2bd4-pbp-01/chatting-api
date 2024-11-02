import express from "express";
import {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    updatePassword,
    deleteUser,
    promoteToManager,
    demoteToMember
} from "../controllers/Users.js";
import { verifyToken, verifyOperator } from "../middleware/VerifyToken.js";

const router = express.Router();

// CRUD
router.get('/users', verifyToken, verifyOperator, getUsers);
router.get('/users/:id', verifyToken, verifyOperator, getUserById);
router.post('/users', verifyToken, verifyOperator, createUser);
router.patch('/users/:id', verifyToken, verifyOperator, updateUser);
router.patch('/users/:id/password', verifyToken, verifyOperator, updatePassword);
router.delete('/users/:id', verifyToken, verifyOperator, deleteUser);

// Promotion and Demotion (Optional)
// Because you can actually update it in updateuser
router.patch('/users/:id/promote', verifyToken, verifyOperator, promoteToManager);
router.patch('/users/:id/demote', verifyToken, verifyOperator, demoteToMember);

export default router;