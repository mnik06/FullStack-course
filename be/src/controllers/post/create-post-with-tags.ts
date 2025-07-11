import { IPostRepo } from 'src/types/repos/IPostRepo';
import { TUserProfile } from 'src/types/user-profile/schemas/UserProfile';
import { TPostUpsertData } from 'src/types/post/schemas/PostUpsertData';
import { IPostToTagRepo } from 'src/types/repos/IPostToTagRepo';
import { createPostWithTagsHelper } from 'src/controllers/common/post/create-post-with-tags-helper';

export async function createPostWithTags(params: {
  postRepo: IPostRepo;
  postToTagRepo: IPostToTagRepo;
  data: TPostUpsertData;
  user: TUserProfile;
}) {
  return createPostWithTagsHelper({
    postRepo: params.postRepo,
    postToTagRepo: params.postToTagRepo,
    data: params.data,
    user: params.user
  });
} 