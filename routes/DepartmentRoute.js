import express from "express";
import {
    getDepartments,
    getDepartmentById,
    createDepartment,
    updateDepartment,
    deleteDepartment
} from "../controllers/Department.js";
import { verifyToken, verifyOperator } from "../middleware/VerifyToken.js";

const router = express.Router();

// Apply JWT verification and operator check to all routes
router.get('/departments', verifyToken, verifyOperator, getDepartments);
router.get('/departments/:id', verifyToken, verifyOperator, getDepartmentById);
router.post('/departments', verifyToken, verifyOperator, createDepartment);
router.patch('/departments/:id', verifyToken, verifyOperator, updateDepartment);
router.delete('/departments/:id', verifyToken, verifyOperator, deleteDepartment);

export default router;