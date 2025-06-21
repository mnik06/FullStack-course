import { z } from 'zod';
import { UserProfileSchema } from 'src/types/user-profile/schemas/UserProfile';
import { PaginationMetadataSchema } from 'src/types/Pagination';

export const GetUsersRespSchema = z.object({
  data: UserProfileSchema.array(),
  meta: PaginationMetadataSchema
});
