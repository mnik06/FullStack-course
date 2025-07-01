import { HttpError } from 'src/api/errors/HttpError';
import { IPostRepo } from 'src/types/repos/IPostRepo';
import { TPost } from 'src/types/post/schemas/Post';
import { getPostService } from 'src/services/post/post.service';

export async function updatePostById(params: {
  postRepo: IPostRepo;
  postId: string;
  data: Partial<TPost>;
}) {
  const postService = getPostService();

  const post = await params.postRepo.updatePostById(
    params.postId,
    {
      ...params.data,
      readingTime: postService.calculateReadingTime(params.data)
    }
  );

  if (!post) {
    throw new HttpError({
      statusCode: 404,
      message: 'Post not found'
    });
  }

  return post;
} 