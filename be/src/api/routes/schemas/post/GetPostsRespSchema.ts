import { z } from 'zod';
import { PostSchemaWithCommentsCount } from 'src/types/post/schemas/PostWithCommentsCount';

export const GetPostsRespSchema = z.array(PostSchemaWithCommentsCount);

export type TGetPostsResp = z.infer<typeof GetPostsRespSchema>