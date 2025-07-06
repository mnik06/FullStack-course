import { IPostRepo } from 'src/types/repos/IPostRepo';
import { getPostService } from 'src/services/post/post.service';
import { TUserProfile } from 'src/types/user-profile/schemas/UserProfile';
import { TUpsertPostReq } from 'src/api/routes/schemas/post/UpsertPostReqSchema';
import { IPostToTagRepo } from 'src/types/repos/IPostToTagRepo';

export async function createPost(params: {
  postRepo: IPostRepo;
  postToTagRepo: IPostToTagRepo;
  data: TUpsertPostReq;
  user: TUserProfile;
}) {
  const postService = getPostService();
  const { tagIds, ...postData } = params.data;

  const post = await params.postRepo.createPost({
    ...postData,
    readingTime: postService.calculateReadingTime(postData)
  }, params.user);

  if (tagIds) {
    const tags = await params.postToTagRepo.updateTagsForPost(post.id, tagIds);

    post.tags = tags;
  }

  return post;
} 