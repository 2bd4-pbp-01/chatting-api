import express from "express";
import {
  getGroups,
  getGroupsById,
  createGroup,
  updateGroup,
  deleteGroup,
  addMembers,
  kickMembers,
} from "../controllers/Groups.js";
import { verifyToken, verifyOperator } from "../middleware/VerifyToken.js";

const router = express.Router();

// CRUD group
router.get("/groups", getGroups);
router.post("/groups", createGroup);
router.get("/groups/:groupId", getGroupsById);
router.put("/groups/:groupId", updateGroup);
router.delete("/groups/:groupId", deleteGroup);

// invite/kick members
router.post("/groups/:groupId/invite", addMembers);
router.delete("/groups/:groupId/kick/:userId", kickMembers);

export default router;
