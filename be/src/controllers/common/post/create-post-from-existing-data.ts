import { TPostWithComments } from 'src/types/post/schemas/PostWithComments';
import { IPostRepo } from 'src/types/repos/IPostRepo';
import { IPostToTagRepo } from 'src/types/repos/IPostToTagRepo';
import { ITagRepo } from 'src/types/repos/ITagRepo';
import { ICommentRepo } from 'src/types/repos/ICommentRepo';
import { createPostWithTagsHelper } from 'src/controllers/common/post/create-post-with-tags-helper';
import { createCommentFromExistingData } from 'src/controllers/common/comment/create-comment-from-existing-data';

export async function createPostFromExistingData(params: {
  post: TPostWithComments
  postRepo: IPostRepo
  postToTagRepo: IPostToTagRepo
  tagRepo: ITagRepo
  commentRepo: ICommentRepo
}) {
  const { comments = [], ...postData } = params.post;
  
  const notDeletedTags = await params.tagRepo
    .getTags({ tagIds: postData.tags.map(t => t.id) });

  const restoredPost = await createPostWithTagsHelper({
    data: {
      ...postData,
      createdAt: new Date(postData.createdAt),
      updatedAt: new Date(postData.updatedAt),
      tagIds: notDeletedTags.map((tag) => tag.id)
    },
    postRepo: params.postRepo,
    postToTagRepo: params.postToTagRepo,
    user: postData.user
  });

  if (!restoredPost) {
    return null;
  }

  await Promise.all(comments.map((comment) => {
    return createCommentFromExistingData({
      comment,
      commentRepo: params.commentRepo,
      postId: restoredPost.id,
      postRepo: params.postRepo,
      throwErrorIfOwnerNotFound: false
    });
  }));

  return restoredPost;
}