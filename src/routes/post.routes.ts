import { Router } from "express";
import { getAllPosts, getPostsByUserId, getPostById, createPost, updatePost } from "../controllers/post.controller";

const router = Router();

router.get("/", (req, res, next) => {
  if (req.query.userId) {
    return getPostsByUserId(req, res);
  }
  next();
});

router.get("/", getAllPosts);

router.get("/:id", getPostById);

router.post("/", createPost);

router.put("/:id", updatePost);

export default router;
