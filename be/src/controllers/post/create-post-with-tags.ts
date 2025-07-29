import { IPostRepo } from 'src/types/repos/IPostRepo';
import { TUserProfile } from 'src/types/user-profile/schemas/UserProfile';
import { TPostUpsertData } from 'src/types/post/schemas/PostUpsertData';
import { IPostToTagRepo } from 'src/types/repos/IPostToTagRepo';
import { getPostService } from 'src/services/post/post.service';

export async function createPostWithTags(params: {
  postRepo: IPostRepo;
  postToTagRepo: IPostToTagRepo;
  data: TPostUpsertData;
  user: TUserProfile;
}) {
  const postService = getPostService();
  const { tagIds, ...postData } = params.data;

  const post = await params.postRepo.createPost({
    ...postData,
    userId: params.user.id,
    readingTime: postService.calculateReadingTime({
      title: postData.title || '',
      description: postData.description || ''
    })
  });

  if (tagIds) {
    const tags = await params.postToTagRepo.updateTagsForPost(post.id, tagIds);

    post.tags = tags;
  }

  return post;
}