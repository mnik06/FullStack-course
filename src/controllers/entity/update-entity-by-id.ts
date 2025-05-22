import { IEntityRepo } from 'src/types/repos/IEntityRepo';
import { Entity } from 'src/types/db/Entity';

export async function updateEntityById(params: {
  entityRepo: IEntityRepo;
  entityId: string;
  data: Partial<Entity>;
}) {
  const entity = await params.entityRepo.updateEntityById(params.entityId, params.data);
  if (!entity) {
    throw new Error('Entity not found');
  }

  return entity;
}