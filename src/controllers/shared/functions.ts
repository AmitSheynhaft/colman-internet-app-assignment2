import Post from "../../models/Post.model";

export const findPostById = async (postId: string) => {
  const post = await Post.findById(postId);
  return post; 
};
