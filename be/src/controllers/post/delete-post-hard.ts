import { HttpError } from 'src/api/errors/HttpError';
import { IArchiveRepo } from 'src/types/repos/IArchiveRepo';
import { IPostRepo } from 'src/types/repos/IPostRepo';
import { createNewArchive } from 'src/controllers/common/create-new-archive';
import { TUserProfile } from 'src/types/user-profile/schemas/UserProfile';

export async function deletePostHard(params: {
  postRepo: IPostRepo;
  postId: string;
  archiveRepo: IArchiveRepo;
  user: TUserProfile;
}) {
  const post = await params.postRepo.getPostById(params.postId);

  if (!post) {
    throw new HttpError({
      statusCode: 404,
      message: 'Post not found'
    });
  }

  await params.postRepo.deletePostHard(params.postId);
  await createNewArchive({
    archiveRepo: params.archiveRepo,
    entityType: 'post',
    entityId: params.postId,
    user: params.user,
    data: post
  });

  return { success: true };
}