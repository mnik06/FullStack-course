import { PostWithDeletedAtSchema } from 'src/types/post/schemas/PostWithDeletedAt';

export const GetSoftDeletedPostsRespSchema = PostWithDeletedAtSchema.array();
