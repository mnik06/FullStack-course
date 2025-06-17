import { IPostRepo } from 'src/types/repos/IPostRepo';
import { TPost } from 'src/types/post/schemas/Post';
import { getPostService } from 'src/services/post/post.service';
import { TUserProfile } from 'src/types/user-profile/schemas/UserProfile';

export async function createPost(params: {
  postRepo: IPostRepo;
  data: Partial<TPost>;
  user: TUserProfile;
}) {
  const postService = getPostService();

  const post = await params.postRepo.createPost({
    ...params.data,
    readingTime: postService.calculateReadingTime(params.data)
  }, params.user);

  return post;
} 