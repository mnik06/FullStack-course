import { TArchive } from 'src/types/archive/schemas/Archive';
import { TArchiveFilters } from 'src/types/archive/ArchiveFilters';
import { TTransaction } from 'src/types/ITransactionManager';
export interface IArchiveRepo {
  createArchive(data: Partial<TArchive>): Promise<TArchive>;
  getArchiveById(id: string): Promise<TArchive | null>;
  getArchives(filters?: TArchiveFilters): Promise<TArchive[]>;
  getArchiveByEntityId(entityId: string): Promise<TArchive | null>;
  deleteArchiveById(id: string, transaction?: TTransaction): Promise<boolean>;
}
