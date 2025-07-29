import { TArchiveFilters } from 'src/types/archive/ArchiveFilters';
import { IArchiveRepo } from 'src/types/repos/IArchiveRepo';

export async function getArchives(params: {
  archiveRepo: IArchiveRepo,
  query: TArchiveFilters
}) {
  return await params.archiveRepo.getArchives(params.query);
}