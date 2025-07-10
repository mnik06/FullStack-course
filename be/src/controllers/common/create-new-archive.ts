import { TArchiveEntityType } from 'src/types/archive/schemas/Archive';
import { TUserProfile } from 'src/types/user-profile/schemas/UserProfile';
import { IArchiveRepo } from 'src/types/repos/IArchiveRepo';

export async function createNewArchive(params: {
  archiveRepo: IArchiveRepo;
  entityType: TArchiveEntityType;
  entityId: string;
  user: TUserProfile;
  data: any
}) {
  const { archiveRepo, data, entityId, entityType, user } = params;

  const archive = await archiveRepo.createArchive({
    data,
    entityType,
    deletedBy: user.id,
    entityId
  });

  return archive;
}