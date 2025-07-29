import { TTag } from 'src/types/tag/schemas/Tag';
import { TTransaction } from 'src/types/ITransactionManager';
export interface IPostToTagRepo {
  updateTagsForPost(postId: string, tagIds: string[], transaction?: TTransaction): Promise<TTag[]>;
}
