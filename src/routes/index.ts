import { Router } from "express";
import exampleRoutes from "./example.routes";
import postRoutes from "./post.routes";

const router = Router();

// Register route modules
router.use("/example", exampleRoutes);
router.use("/posts", postRoutes);

export default router;
