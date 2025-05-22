import { z } from 'zod';
import { CommentSchema } from 'src/types/db/Comment';

export const GetCommentsRespSchema = z.array(CommentSchema);

export type TGetCommentsResp = z.infer<typeof GetCommentsRespSchema>