import { Router } from "express";
import postRoutes from "./post.routes";
import userRoutes from "./user.routes";
import authRouter from "./authRoute";

const router = Router();

router.use("/posts", postRoutes);
router.use("/users", userRoutes);
router.use("/auth", authRouter);

export default router;
