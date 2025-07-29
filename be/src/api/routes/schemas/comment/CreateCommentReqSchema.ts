import { z } from 'zod';
import { CommentUpsertData } from 'src/types/comment/schemas/CommentUpsertData';

export const CreateCommentReqSchema = CommentUpsertData.extend({});

export type TCreateCommentReq = z.infer<typeof CreateCommentReqSchema>;