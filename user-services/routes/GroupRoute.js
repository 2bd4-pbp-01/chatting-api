import express from "express";
import {
  getGroups,
  getGroupsById,
  createGroup,
  updateGroup,
  deleteGroup,
} from "../controllers/Groups.js";
import { verifyToken, verifyOperator } from "../middleware/VerifyToken.js";

const router = express.Router();

// CRUD group
router.get("/groups", getGroups);
router.post("/groups", createGroup);
router.get("/groups/:groupId", getGroupsById);
router.put("/groups/:groupId", updateGroup);
router.delete("/groups/:groupId", deleteGroup);

export default router;
