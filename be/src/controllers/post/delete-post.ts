import { HttpError } from 'src/api/errors/HttpError';
import { IPostRepo } from 'src/types/repos/IPostRepo';

export async function deletePost(params: {
  postRepo: IPostRepo;
  postId: string;
}) {
  const isPostFound = await params.postRepo.deletePost(params.postId);

  if (!isPostFound) {
    throw new HttpError({
      statusCode: 404,
      message: 'Post not found'
    });
  }

  return { success: true };
}