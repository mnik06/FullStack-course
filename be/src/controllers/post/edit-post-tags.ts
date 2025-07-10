import { HttpError } from 'src/api/errors/HttpError';
import { IPostRepo } from 'src/types/repos/IPostRepo';
import { IPostToTagRepo } from 'src/types/repos/IPostToTagRepo';

export async function editPostTags(params: {
  postRepo: IPostRepo;
  postToTagRepo: IPostToTagRepo;
  postId: string;
  tagIds: string[];
}) {
  const post = await params.postRepo.getPostById(params.postId);

  if (!post) {
    throw new HttpError({
      statusCode: 404,
      message: 'Post not found'
    });
  }

  return  await params.postToTagRepo.updateTagsForPost(params.postId, params.tagIds);
}