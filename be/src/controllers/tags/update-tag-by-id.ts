import { HttpError } from 'src/api/errors/HttpError';
import { TUpdateTagReq } from 'src/api/routes/schemas/tags/UpdateTagReqSchema';
import { ITagRepo } from 'src/types/repos/ITagRepo';

export async function updateTag(params: {
  tagId: string;
  data: TUpdateTagReq;
  tagRepo: ITagRepo;
}) {
  const { tagId, tagRepo, data } = params;

  const tag = await tagRepo.updateTagById(tagId, data);

  if (!tag) {
    throw new HttpError({
      statusCode: 404,
      message: 'Tag not found'
    });
  }

  return tag;
}