import { TPostToTag } from 'src/types/post-to-tag/schemas/PostToTag';

export interface IPostToTagRepo {
  createPostToTag(postToTag: Partial<TPostToTag>): Promise<TPostToTag>;
  deletePostToTag(id: string): Promise<boolean>;
}
