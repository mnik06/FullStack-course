import { TPostWithComments } from 'src/types/post/schemas/PostWithComments';
import { IPostRepo } from 'src/types/repos/IPostRepo';
import { IPostToTagRepo } from 'src/types/repos/IPostToTagRepo';
import { ITagRepo } from 'src/types/repos/ITagRepo';
import { ICommentRepo } from 'src/types/repos/ICommentRepo';
import { TTransaction } from 'src/types/ITransactionManager';
import { TComment } from 'src/types/comment/schemas/Comment';
import { createCommentsFromExistingData } from 'src/controllers/common/comment/create-comments-from-existing-data';
import { TPost } from 'src/types/post/schemas/Post';

export async function createPostsFromExistingData(params: {
  posts: TPostWithComments[]
  postRepo: IPostRepo
  postToTagRepo: IPostToTagRepo
  tagRepo: ITagRepo
  commentRepo: ICommentRepo
  transaction: TTransaction
}) {
  const commentsToCreate: TComment[] = [];
  const preparedPosts: Partial<TPost>[] = params.posts.map((post) => {
    commentsToCreate.push(...(post.comments || []));

    return {
      description: post.description || '',
      title: post.title || '',
      id: post.id,
      userId: post.user.id,
      readingTime: post.readingTime,
      createdAt: new Date(post.createdAt),
      updatedAt: new Date(post.updatedAt)
    } as TPost;
  });

  await params.postRepo.createMultiplePosts(preparedPosts, params.transaction);

  await Promise.all(preparedPosts.map(async (post) => {
    const notDeletedTags = await params.tagRepo.getTags({ tagIds: post.tags?.map(t => t.id) });

    await params.postToTagRepo.updateTagsForPost(
      post.id as string, 
      notDeletedTags.map(t => t.id), 
      params.transaction
    );
  }));

  if (commentsToCreate.length) {
    await createCommentsFromExistingData({
      commentRepo: params.commentRepo,
      postRepo: params.postRepo,
      comments: commentsToCreate,
      transaction: params.transaction
    });
  }

  return true;
}