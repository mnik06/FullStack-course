import { UserProfileWithDeletedAtSchema } from 'src/types/user-profile/schemas/UserProfileWithDeletedAt';

export const GetSoftDeletedUsersRespSchema = UserProfileWithDeletedAtSchema.array();