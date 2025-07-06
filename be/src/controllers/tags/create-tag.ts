import { TCreateTagReq } from 'src/api/routes/schemas/tags/CreateTagReqSchema';
import { ITagRepo } from 'src/types/repos/ITagRepo';

export function createTag(params: {
  data: TCreateTagReq,
  tagRepo: ITagRepo
}) {
  return params.tagRepo.createTag(params.data);
}