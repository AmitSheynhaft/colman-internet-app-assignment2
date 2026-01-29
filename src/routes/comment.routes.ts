import { Router } from "express";
import {
  createComment,
  deleteComment,
  getAllComments,
  getCommentById,
  getCommentsByPostId,
  updateComment,
} from "../controllers/comment.controller";

const router = Router();

/**
 * @swagger
 * /api/comments:
 *   post:
 *     summary: Create a new comment
 *     description: Creates a new comment for a specific post
 *     tags: [Comments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - postId
 *               - content
 *               - sender
 *             properties:
 *               postId:
 *                 type: string
 *                 description: MongoDB ObjectId of the post
 *                 example: "507f1f77bcf86cd799439011"
 *               content:
 *                 type: string
 *                 description: Comment content (1-500 characters)
 *                 minLength: 1
 *                 maxLength: 500
 *                 example: "Great post! Very informative."
 *               sender:
 *                 type: string
 *                 description: MongoDB ObjectId of the user (sender)
 *                 example: "507f1f77bcf86cd799439012"
 *     responses:
 *       200:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Comment created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Bad request - Missing fields or validation error
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 */
router.post("/", createComment);

/**
 * @swagger
 * /api/comments:
 *   get:
 *     summary: Get all comments
 *     description: Retrieves a list of all comments
 *     tags: [Comments]
 *     responses:
 *       200:
 *         description: Comments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Comments retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Comment'
 *       500:
 *         description: Internal server error
 */
router.get("/", getAllComments);

/**
 * @swagger
 * /api/comments/{id}:
 *   get:
 *     summary: Get comment by ID
 *     description: Retrieves a specific comment by its ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the comment
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Comment retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Comment retrieved successfully
 *                 data:
 *                   $ref: '#/components/schemas/Comment'
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", getCommentById);

/**
 * @swagger
 * /api/comments/post/{postId}:
 *   get:
 *     summary: Get comments by post ID
 *     description: Retrieves all comments for a specific post
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the post
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Comments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Comments for post 507f1f77bcf86cd799439011 retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Invalid postId
 *       500:
 *         description: Internal server error
 */
router.get("/post/:postId", getCommentsByPostId);

/**
 * @swagger
 * /api/comments/{id}:
 *   put:
 *     summary: Update comment
 *     description: Updates the content of an existing comment
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the comment
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 description: Updated comment content
 *                 minLength: 1
 *                 maxLength: 500
 *                 example: "Updated comment text"
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Comment updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Missing required fields
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", updateComment);

/**
 * @swagger
 * /api/comments/{id}:
 *   delete:
 *     summary: Delete comment
 *     description: Deletes a comment by its ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the comment
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Comment deleted successfully
 *                 data:
 *                   $ref: '#/components/schemas/Comment'
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", deleteComment);

export default router;
