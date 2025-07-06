import { TTag } from 'src/types/tag/schemas/Tag';

export interface IPostToTagRepo {
  updateTagsForPost(postId: string, tagIds: string[]): Promise<TTag[]>;
}
