import { Request, Response } from "express";
import User from "../models/User.model";
import { HTTP_STATUS } from "../constants/constants";

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password, age, bio, profilePicture } = req.body as {
      username: string;
      email: string;
      password?: string;
      age?: number;
      bio?: string;
      profilePicture?: string;
    };

    // Validate required fields
    if (!username || !email) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: "Missing required fields: username and email are required",
      });
      return;
    }

    // Check if user with same username already exists
    const existingUserByUsername = await User.findOne({ username });
    if (existingUserByUsername) {
      res.status(HTTP_STATUS.CONFLICT).json({
        success: false,
        message: "Username already exists",
      });
      return;
    }

    // Check if user with same email already exists
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      res.status(HTTP_STATUS.CONFLICT).json({
        success: false,
        message: "Email already exists",
      });
      return;
    }

    // Create new user
    const newUser = new User({
      username,
      email,
      password,
      age,
      bio,
      profilePicture,
    });

    const savedUser = await newUser.save();

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: "User created successfully",
      data: savedUser,
    });
  } catch (error: any) {
    console.error("Error creating user:", error);

    if (error.name === "ValidationError") {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: "Validation error",
        error: error.message,
      });
      return;
    }

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      res.status(HTTP_STATUS.CONFLICT).json({
        success: false,
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
      });
      return;
    }

    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
