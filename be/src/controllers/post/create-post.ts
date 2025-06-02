import { IPostRepo } from 'src/types/repos/IPostRepo';
import { TPost } from 'src/types/post/schemas/Post';
import { getPostService } from 'src/services/post/post.service';

export async function createPost(params: {
  postRepo: IPostRepo;
  data: Partial<TPost>;
}) {
  const postService = getPostService();

  const post = await params.postRepo.createPost({
    ...params.data,
    readingTime: postService.calculateReadingTime(params.data)
  });

  return post;
} 