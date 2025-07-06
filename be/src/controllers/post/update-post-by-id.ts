import { HttpError } from 'src/api/errors/HttpError';
import { IPostRepo } from 'src/types/repos/IPostRepo';
import { getPostService } from 'src/services/post/post.service';
import { TUpsertPostReq } from 'src/api/routes/schemas/post/UpsertPostReqSchema';
import { IPostToTagRepo } from 'src/types/repos/IPostToTagRepo';

export async function updatePostById(params: {
  postRepo: IPostRepo;
  postToTagRepo: IPostToTagRepo;
  postId: string;
  data: TUpsertPostReq;
}) {
  const postService = getPostService();
  const { tagIds, ...postData } = params.data;

  const post = await params.postRepo.updatePostById(
    params.postId,
    {
      ...postData,
      readingTime: postService.calculateReadingTime(postData)
    }
  );

  if (!post) {
    throw new HttpError({
      statusCode: 404,
      message: 'Post not found'
    });
  }

  if (tagIds) {
    const tags = await params.postToTagRepo.updateTagsForPost(params.postId, tagIds);

    post.tags = tags;
  }

  return post;
} 