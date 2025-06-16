import { HttpError } from 'src/api/errors/HttpError';
import { getPostService } from 'src/services/post/post.service';
import { IPostRepo } from 'src/types/repos/IPostRepo';

export async function deletePost(params: {
  postRepo: IPostRepo,
  postId: string,
  userId: string
}) {
  const postService = getPostService();

  await postService.validatePostAccess({
    postRepo: params.postRepo,
    postId: params.postId,
    userId: params.userId
  });

  const isPostFound = await params.postRepo.deletePost(params.postId);

  if (!isPostFound) {
    throw new HttpError(404, 'Post not found');
  }

  return { success: true };
}