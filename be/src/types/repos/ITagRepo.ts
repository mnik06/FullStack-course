import { TTag } from 'src/types/tag/schemas/Tag';
import { TTagFilters } from 'src/types/tag/schemas/TagFilters';

export interface ITagRepo {
  getTags(filters: TTagFilters): Promise<TTag[]>;
  createTag(tag: Partial<TTag>): Promise<TTag>;
  deleteTagById(id: string): Promise<boolean>;
  updateTagById(id: string, tag: Partial<TTag>): Promise<TTag | null>;
}
