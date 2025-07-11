import { IPostToTagRepo } from 'src/types/repos/IPostToTagRepo';

import { HttpError } from 'src/api/errors/HttpError';
import { TPostWithComments } from 'src/types/post/schemas/PostWithComments';
import { IArchiveRepo } from 'src/types/repos/IArchiveRepo';
import { ICommentRepo } from 'src/types/repos/ICommentRepo';
import { IPostRepo } from 'src/types/repos/IPostRepo';
import { createPostWithTagsHelper } from 'src/controllers/common/post/create-post-with-tags-helper';
import { createCommentHelper } from 'src/controllers/common/comment/create-comment-helper';
import { ITagRepo } from 'src/types/repos/ITagRepo';
import { IUserProfileRepo } from 'src/types/repos/IUserProfileRepo';

export async function restorePostFromArchive(params: {
  archiveId: string,
  postRepo: IPostRepo,
  commentRepo: ICommentRepo,
  archiveRepo: IArchiveRepo,
  postToTagRepo: IPostToTagRepo,
  tagRepo: ITagRepo,
  userProfileRepo: IUserProfileRepo
}) {
  const postArchive = await params.archiveRepo.getArchiveById(params.archiveId);

  if (!postArchive) {
    throw new HttpError({
      statusCode: 404,
      message: 'Post archive not found'
    });
  }

  const postOwner = await params.userProfileRepo.getUserProfileById(postArchive.data.userId);

  if (!postOwner) {
    throw new HttpError({
      statusCode: 404,
      message: 'Post owner not found'
    });
  }

  const { comments = [], ...archivedPostData } = postArchive.data as TPostWithComments;
  
  const notDeletedTags = await params.tagRepo
    .getTags({ tagIds: archivedPostData.tags.map(t => t.id) });

  const restoredPost = await createPostWithTagsHelper({
    data: {
      title: archivedPostData.title,
      description: archivedPostData.description,
      createdAt: archivedPostData.createdAt,
      updatedAt: archivedPostData.updatedAt,
      tagIds: notDeletedTags.map((tag) => tag.id)
    },
    postRepo: params.postRepo,
    postToTagRepo: params.postToTagRepo,
    user: archivedPostData.user
  });

  await Promise.all(comments.map(async (comment) => {
    await createCommentHelper({
      data: {
        text: comment.text,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt
      },
      commentRepo: params.commentRepo,
      postId: restoredPost.id,
      user: comment.user
    });
  }));

  await params.archiveRepo.deleteArchiveById(postArchive.id);

  return { success: true };
}