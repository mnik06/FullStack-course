import { z } from 'zod';
import { PostSchema } from 'src/types/db/Post';

export const GetPostsRespSchema = z.array(PostSchema);

export type TGetPostsResp = z.infer<typeof GetPostsRespSchema>