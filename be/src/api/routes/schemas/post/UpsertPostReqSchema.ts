import { z } from 'zod';
import { PostUpsertData } from 'src/types/post/schemas/PostUpsertData';

export const UpsertPostReqSchema = PostUpsertData.extend({});

export type TUpsertPostReq = z.infer<typeof UpsertPostReqSchema>;
