import { z } from 'zod';
import { PaginationMetadataSchema } from 'src/types/Pagination';
import { PostSchemaWithCommentsCount } from 'src/types/post/schemas/PostWithCommentsCount';

export const GetPostsRespSchema = z.object({
  data: z.array(PostSchemaWithCommentsCount),
  meta: PaginationMetadataSchema
});

export type TGetPostsResp = z.infer<typeof GetPostsRespSchema>