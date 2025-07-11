import { HttpError } from 'src/api/errors/HttpError';
import { IArchiveRepo } from 'src/types/repos/IArchiveRepo';
import { ICommentRepo } from 'src/types/repos/ICommentRepo';
import { createCommentHelper } from 'src/controllers/common/comment/create-comment-helper';
import { IUserProfileRepo } from 'src/types/repos/IUserProfileRepo';
export async function restoreCommentFromArchive(params: {
  archiveId: string;
  commentRepo: ICommentRepo;
  archiveRepo: IArchiveRepo;
  userProfileRepo: IUserProfileRepo;
}) {
  const commentArchive = await params.archiveRepo.getArchiveById(params.archiveId);
  
  if (!commentArchive) {
    throw new HttpError({
      statusCode: 404,
      message: 'Comment archive not found'
    });
  }

  const commentOwner = await params.userProfileRepo.getUserProfileById(commentArchive.data.userId);

  if (!commentOwner) {
    throw new HttpError({
      statusCode: 404,
      message: 'Comment owner not found'
    });
  }
  
  await createCommentHelper({
    commentRepo: params.commentRepo,
    data: {
      text: commentArchive.data.text,
      createdAt: commentArchive.data.createdAt,
      updatedAt: commentArchive.data.updatedAt
    },
    user: commentArchive.data.user,
    postId: commentArchive.data.postId
  });

  await params.archiveRepo.deleteArchiveById(commentArchive.id);

  return { success: true };
}