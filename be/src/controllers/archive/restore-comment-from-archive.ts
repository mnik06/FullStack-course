import { HttpError } from 'src/api/errors/HttpError';
import { IArchiveRepo } from 'src/types/repos/IArchiveRepo';
import { ICommentRepo } from 'src/types/repos/ICommentRepo';
import { createCommentFromExistingData } from 'src/controllers/common/comment/create-comment-from-existing-data';
import { TComment } from 'src/types/comment/schemas/Comment';
import { IPostRepo } from 'src/types/repos/IPostRepo';

export async function restoreCommentFromArchive(params: {
  archiveId: string;
  commentRepo: ICommentRepo;
  archiveRepo: IArchiveRepo;
  postRepo: IPostRepo;
}) {
  const commentArchive = await params.archiveRepo.getArchiveById(params.archiveId);
  
  if (!commentArchive) {
    throw new HttpError({
      statusCode: 404,
      message: 'Comment archive not found'
    });
  }

  await createCommentFromExistingData({
    commentRepo: params.commentRepo,
    comment: commentArchive.data as TComment,
    postId: commentArchive.data.postId,
    postRepo: params.postRepo,
    throwErrorIfOwnerNotFound: true,
    throwErrorIfPostNotFound: true
  });

  await params.archiveRepo.deleteArchiveById(commentArchive.id);

  return { success: true };
}