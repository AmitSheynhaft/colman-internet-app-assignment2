import { Request, Response } from "express";
import Post from "../models/Post.model";
import { HTTP_STATUS } from "../constants/constants";

export const getAllPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const posts = await Post.find();

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Posts retrieved successfully",
      data: posts,
    });
  } catch (error: any) {
    console.error("Error retrieving posts:", error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getPostsBySender = async (req: Request, res: Response): Promise<void> => {
  try {
    // senderId is guaranteed to exist because the router checks for it before calling this function
    const { senderId } = req.query;

    const posts = await Post.find({ "sender.id": Number(senderId) });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: `Posts by sender ${senderId} retrieved successfully`,
      data: posts,
    });
  } catch (error: any) {
    console.error("Error retrieving posts by sender:", error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getPostById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);

    if (!post) {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: "Post not found",
      });
      return;
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Post retrieved successfully",
      data: post,
    });
  } catch (error: any) {
    console.error("Error retrieving post:", error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const createPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, content, sender } = req.body as {
      title: string;
      content: string;
      sender: {
        id: number;
        name: string;
      };
    };

    if (!title || !content || !sender || !sender.id || !sender.name) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: "Missing required fields: title, content, and sender (with id and name) are required",
      });
      return;
    }

    const newPost = new Post({
      title,
      content,
      sender: {
        id: sender.id,
        name: sender.name,
      },
    });

    const savedPost = await newPost.save();

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Post created successfully",
      data: savedPost,
    });
  } catch (error: any) {
    if (error.name === "ValidationError") {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: "Validation error",
        errors: Object.values(error.errors).map((err: any) => err.message),
      });
      return;
    }

    console.error("Error creating post:", error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const updatePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, content, sender } = req.body as Partial<{
      title: string;
      content: string;
      sender: {
        id: number;
        name: string;
      };
    }>;

    // Build update object with only provided fields
    const updateData: Partial<{ 
      title: string; 
      content: string; 
      "sender.id": number; 
      "sender.name": string;
    }> = {};
    
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (sender !== undefined) {
      // Allow partial sender updates
      if (sender.id !== undefined) updateData["sender.id"] = sender.id;
      if (sender.name !== undefined) updateData["sender.name"] = sender.name;
    }

    // Check if there's at least one field to update
    if (Object.keys(updateData).length === 0) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: "At least one field (title, content, or sender) must be provided for update",
      });
      return;
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedPost) {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: "Post not found",
      });
      return;
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Post updated successfully",
      data: updatedPost,
    });
  } catch (error: any) {
    if (error.name === "ValidationError") {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: "Validation error",
        errors: Object.values(error.errors).map((err: any) => err.message),
      });
      return;
    }

    console.error("Error updating post:", error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
