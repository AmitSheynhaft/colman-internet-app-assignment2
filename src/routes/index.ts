import { Router } from "express";
import postRoutes from "./post.routes";
import userRoutes from "./user.routes";
import commentsRoutes from "./comment.routes";

const router = Router();

router.use("/posts", postRoutes);
router.use("/users", userRoutes);
router.use("/comments", commentsRoutes);

export default router;
