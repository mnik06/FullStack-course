import { z } from 'zod';
import { PaginationMetadataSchema } from 'src/types/Pagination';

export const GetPostsRespSchema = z.object({
  data: z.array(z.object({
    id: z.string().uuid(),
    title: z.string(),
    description: z.string().optional().nullable(),
    updatedAt: z.date(),
    createdAt: z.date(),
    commentsCount: z.number()
  })),
  meta: PaginationMetadataSchema
});

export type TGetPostsResp = z.infer<typeof GetPostsRespSchema>