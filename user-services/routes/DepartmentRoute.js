import express from "express";
import {
    getDepartments,
    getDepartmentById,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    addUserToDepartment,
    removeUserFromDepartment
} from "../controllers/Department.js";
import { verifyToken, verifyOperator } from "../middleware/VerifyToken.js";

const router = express.Router();

// CRUD Department (Operator only)
router.get('/departments', verifyToken, verifyOperator, getDepartments);
router.get('/departments/:id', verifyToken, verifyOperator, getDepartmentById);
router.post('/departments', verifyToken, verifyOperator, createDepartment);
router.patch('/departments/:id', verifyToken, verifyOperator, updateDepartment);
router.delete('/departments/:id', verifyToken, verifyOperator, deleteDepartment);

// Add or Remove User from Department (Operator only)
router.post('/departments/addUser', verifyToken, verifyOperator, addUserToDepartment);
router.post('/departments/removeUser', verifyToken, verifyOperator, removeUserFromDepartment);
export default router;