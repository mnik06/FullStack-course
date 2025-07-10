import { TArchive, TArchiveEntityType } from 'src/types/archive/schemas/Archive';

export interface IArchiveRepo {
  createArchive(data: Partial<TArchive>): Promise<TArchive>;
  getArchiveById(id: string): Promise<TArchive | null>;
  getArchivesByEntityType(entityType: TArchiveEntityType): Promise<TArchive[]>;
  getArchiveByEntityId(entityId: string): Promise<TArchive | null>;
  deleteArchiveById(id: string): Promise<boolean>;
}
