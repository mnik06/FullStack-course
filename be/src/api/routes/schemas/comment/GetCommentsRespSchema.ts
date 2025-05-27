import { z } from 'zod';
import { CommentSchema } from 'src/types/comment/schemas/Comment';

export const GetCommentsRespSchema = z.array(CommentSchema);

export type TGetCommentsResp = z.infer<typeof GetCommentsRespSchema>