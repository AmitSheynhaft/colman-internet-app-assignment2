import mongoose, { Schema, Document } from "mongoose";

export interface IComment extends Document {
  content: string;
  postId: mongoose.Types.ObjectId;
  sender: {
    id: number;
    name: string;
  };
}

const CommentSchema: Schema = new Schema(
  {
    content: {
      type: String,
      required: [true, "content is required"],
      minlength: [1, "content must be at least 1 character"],
      maxlength: [500, "content cannot exceed 500 characters"],
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: [true, "post id is required"],
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
  { timestamps: true });

  const Comment = mongoose.model<IComment>("Comment", CommentSchema);

export default Comment;