import { HttpError } from 'src/api/errors/HttpError';
import { IArchiveRepo } from 'src/types/repos/IArchiveRepo';

export async function deleteArchive(params: {
  archiveRepo: IArchiveRepo;
  archiveId: string;
}) {
  const { archiveRepo, archiveId } = params;

  const isArchiveFound = await archiveRepo.deleteArchiveById(archiveId);

  if (!isArchiveFound) {
    throw new HttpError({ statusCode: 404, message: 'Archive not found' });
  }

  return { success: true };
}