import { Router } from "express";
import { createUser } from "../controllers/user.controller";

const router = Router();

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     description: Creates a new user with username, email, and optional profile information
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 30
 *                 pattern: '^[a-zA-Z0-9_]+$'
 *                 description: Unique username (3-30 characters, alphanumeric and underscores only)
 *                 example: johndoe123
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Unique email address
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 description: User password
 *                 example: securePassword123
 *               age:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 150
 *                 description: User age
 *                 example: 28
 *               bio:
 *                 type: string
 *                 maxLength: 500
 *                 description: User biography (max 500 characters)
 *                 example: Software developer passionate about web technologies
 *               profilePicture:
 *                 type: string
 *                 format: uri
 *                 description: URL to user profile picture
 *                 example: https://example.com/profile/johndoe.jpg
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Bad request - Missing required fields or validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Missing required fields username and email are required
 *       409:
 *         description: Conflict - Username or email already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Username already exists
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/", createUser);

export default router;
