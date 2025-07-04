import { ITagRepo } from 'src/types/repos/ITagRepo';

export function getTags(params: {
  tagRepo: ITagRepo
}) {
  return params.tagRepo.getTags();
}