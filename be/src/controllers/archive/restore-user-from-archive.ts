import { HttpError } from 'src/api/errors/HttpError';
import { IArchiveRepo } from 'src/types/repos/IArchiveRepo';
import { IUserProfileRepo } from 'src/types/repos/IUserProfileRepo';
import { IIdentityService } from 'src/types/services/IIdentityService';
import { IUserProfileArchiveData } from 'src/types/user-profile/UserProfileArchiveData';
import { createPostFromExistingData } from 'src/controllers/common/post/create-post-from-existing-data';
import { IPostRepo } from 'src/types/repos/IPostRepo';
import { IPostToTagRepo } from 'src/types/repos/IPostToTagRepo';
import { ITagRepo } from 'src/types/repos/ITagRepo';
import { ICommentRepo } from 'src/types/repos/ICommentRepo';
import { createCommentFromExistingData } from 'src/controllers/common/comment/create-comment-from-existing-data';

export async function restoreUserFromArchive(params: {
  archiveId: string;
  userProfileRepo: IUserProfileRepo;
  archiveRepo: IArchiveRepo;
  identityService: IIdentityService;
  postRepo: IPostRepo;
  postToTagRepo: IPostToTagRepo;
  tagRepo: ITagRepo;
  commentRepo: ICommentRepo;
}) {
  const userArchive = await params.archiveRepo.getArchiveById(params.archiveId);

  if (!userArchive) {
    throw new HttpError({
      statusCode: 404,
      message: 'User archive not found'
    });
  }

  const { user, posts, comments } = userArchive.data as IUserProfileArchiveData;

  await params.identityService.enableUser(user.email);
  await params.userProfileRepo.createUserProfile({
    ...user,
    createdAt: new Date(user.createdAt),
    updatedAt: new Date(user.updatedAt)
  });

  await Promise.all(posts.map((post) => {
    return createPostFromExistingData({
      post,
      postRepo: params.postRepo,
      postToTagRepo: params.postToTagRepo,
      tagRepo: params.tagRepo,
      commentRepo: params.commentRepo
    });
  }));

  await Promise.all(comments.map((comment) => {
    return createCommentFromExistingData({
      comment,
      commentRepo: params.commentRepo,
      postId: comment.postId,
      postRepo: params.postRepo,
      throwErrorIfPostNotFound: false,
      // Skip duplicate comments in case the comment was restored in the post
      skipDuplicate: true
    });
  }));

  await params.archiveRepo.deleteArchiveById(userArchive.id);
}
