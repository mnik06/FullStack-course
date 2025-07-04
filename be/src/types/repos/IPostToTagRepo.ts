import { TPostToTag } from 'src/types/post-to-tag/schemas/PostToTag';

export interface IPostToTagRepo {
  createPostToTag(postToTag: Partial<TPostToTag>): Promise<TPostToTag>;
  deletePostToTag(id: string): Promise<boolean>;
  getPostToTagByPostId(postId: string): Promise<TPostToTag | null>;
  getPostToTagByTagId(tagId: string): Promise<TPostToTag | null>;
}
