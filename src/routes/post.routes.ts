import { Router } from "express";
import { getAllPosts, getPostsBySender, getPostById, createPost, updatePost } from "../controllers/post.controller";

const router = Router();

router.get("/", (req, res, next) => {
  if (req.query.senderId) {
    return getPostsBySender(req, res);
  }
  next();
});

router.get("/", getAllPosts);

router.get("/:id", getPostById);

router.post("/", createPost);

router.put("/:id", updatePost);

export default router;
