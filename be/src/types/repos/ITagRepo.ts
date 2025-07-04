import { TTag } from 'src/types/tag/schemas/Tag';

export interface ITagRepo {
  createTag(tag: Partial<TTag>): Promise<TTag>;
  deleteTag(id: string): Promise<boolean>;
}
