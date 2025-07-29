import { HttpError } from 'src/api/errors/HttpError';
import { ITagRepo } from 'src/types/repos/ITagRepo';

export async function deleteTag(params: {
  tagId: string,
  tagRepo: ITagRepo
}) {
  const isTagFound = await params.tagRepo.deleteTagById(params.tagId);

  if (!isTagFound) {
    throw new HttpError({
      statusCode: 404,
      message: 'Tag not found'
    });
  }

  return { success: isTagFound };
}