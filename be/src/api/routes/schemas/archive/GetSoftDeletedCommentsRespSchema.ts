import { CommentWithDeletedAtSchema } from 'src/types/comment/schemas/CommentWithDeletedAt';

export const GetSoftDeletedCommentsRespSchema = CommentWithDeletedAtSchema.array();