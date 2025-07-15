import { IPostToTagRepo } from 'src/types/repos/IPostToTagRepo';

import { HttpError } from 'src/api/errors/HttpError';
import { TPostWithComments } from 'src/types/post/schemas/PostWithComments';
import { IArchiveRepo } from 'src/types/repos/IArchiveRepo';
import { ICommentRepo } from 'src/types/repos/ICommentRepo';
import { IPostRepo } from 'src/types/repos/IPostRepo';
import { ITagRepo } from 'src/types/repos/ITagRepo';
import { EErrorCodes } from 'src/api/errors/EErrorCodes';
import { createPostFromExistingData } from 'src/controllers/common/post/create-post-from-existing-data';

export async function restorePostFromArchive(params: {
  archiveId: string,
  postRepo: IPostRepo,
  commentRepo: ICommentRepo,
  archiveRepo: IArchiveRepo,
  postToTagRepo: IPostToTagRepo,
  tagRepo: ITagRepo,
}) {
  const postArchive = await params.archiveRepo.getArchiveById(params.archiveId);

  if (!postArchive) {
    throw new HttpError({
      statusCode: 404,
      message: 'Post archive not found'
    });
  }

  const post = await createPostFromExistingData({
    post: postArchive.data as TPostWithComments,
    postRepo: params.postRepo,
    postToTagRepo: params.postToTagRepo,
    tagRepo: params.tagRepo,
    commentRepo: params.commentRepo
  });

  if (!post) {
    throw new HttpError({
      statusCode: 404,
      message: 'Post owner not found',
      errorCode: EErrorCodes.POST_OWNER_NOT_FOUND
    });
  }

  await params.archiveRepo.deleteArchiveById(postArchive.id);

  return { success: true };
}