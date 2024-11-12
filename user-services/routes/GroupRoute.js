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
import { verifyToken, verifyManager } from "../middleware/VerifyToken.js";

const router = express.Router();

// CRUD group
router.get("/groups", verifyToken, verifyManager, getGroups);
router.post("/groups", verifyToken, verifyManager, createGroup);
router.get("/groups/:groupId", verifyToken, verifyManager, getGroupsById);
router.put("/groups/:groupId", verifyToken, verifyManager, updateGroup);
router.delete("/groups/:groupId", verifyToken, verifyManager, deleteGroup);

// invite/kick members
router.post("/groups/:groupId/invite", verifyToken, verifyManager, addMembers);
router.delete(
  "/groups/:groupId/kick/:userId",
  verifyToken,
  verifyManager,
  kickMembers,
);

export default router;
