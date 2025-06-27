import { z } from 'zod';
import { UserProfileSchemaWithActiveField } from 'src/types/user-profile/schemas/UserProfile';
import { PaginationMetadataSchema } from 'src/types/Pagination';

export const GetUsersRespSchema = z.object({
  data: UserProfileSchemaWithActiveField.array(),
  meta: PaginationMetadataSchema
});
