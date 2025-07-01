import { HttpError } from 'src/api/errors/HttpError';
import { IPostRepo } from 'src/types/repos/IPostRepo';

export async function getPostById(params: {
  postRepo: IPostRepo;
  postId: string;
}) {
  const post = await params.postRepo.getPostById(params.postId);
  
  if (!post) {
    throw new HttpError({
      statusCode: 404,
      message: 'Post not found'
    });
  }

  return post;
} 