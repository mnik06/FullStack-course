import { ITagRepo } from 'src/types/repos/ITagRepo';
import { TTagFilters } from 'src/types/tag/schemas/TagFilters';

export function getTags(params: {
  tagRepo: ITagRepo,
  filters: TTagFilters
}) {
  return params.tagRepo.getTags(params.filters);
}