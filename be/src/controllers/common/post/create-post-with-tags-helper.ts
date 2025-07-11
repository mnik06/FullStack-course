import { IPostRepo } from 'src/types/repos/IPostRepo';
import { getPostService } from 'src/services/post/post.service';
import { TUserProfile } from 'src/types/user-profile/schemas/UserProfile';
import { IPostToTagRepo } from 'src/types/repos/IPostToTagRepo';
import { TPostUpsertData } from 'src/types/post/schemas/PostUpsertData';

export async function createPostWithTagsHelper(params: {
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
    createdAt: postData.createdAt ? new Date(postData.createdAt) : undefined,
    updatedAt: postData.updatedAt ? new Date(postData.updatedAt) : undefined,
    readingTime: postService.calculateReadingTime({
      title: postData.title || '',
      description: postData.description || ''
    })
  });

  // Returns null if the post owner is not found
  if (!post) {
    return null;
  }

  if (tagIds) {
    const tags = await params.postToTagRepo.updateTagsForPost(post.id, tagIds);

    post.tags = tags;
  }

  return post;
} 