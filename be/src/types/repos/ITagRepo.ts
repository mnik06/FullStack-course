import { TTag } from 'src/types/tag/schemas/Tag';

export interface ITagRepo {
  getTags(): Promise<TTag[]>;
  createTag(tag: Partial<TTag>): Promise<TTag>;
  deleteTagById(id: string): Promise<boolean>;
}
