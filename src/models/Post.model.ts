import mongoose, { Schema } from "mongoose";
import { IPost } from "../constants/constants";

const postSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true,
      minlength: [10, "Content must be at least 10 characters"],
    },
    sender: {
      type: {
        id: {
          type: Number,
          required: [true, "Sender ID is required"],
        },
        name: {
          type: String,
          required: [true, "Sender name is required"],
          trim: true,
        },
      },
      required: [true, "Sender is required"],
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
    versionKey: false,
  }
);

const Post = mongoose.model<IPost>("Post", postSchema);

export default Post;
