import { ICommentRepo } from 'src/types/repos/ICommentRepo';
import { TComment } from 'src/types/comment/schemas/Comment';
import { HttpError } from 'src/api/errors/HttpError';

export async function updateCommentById(params: {
  commentRepo: ICommentRepo;
  commentId: string;
  data: Partial<TComment>;
}) {
  const comment = await params.commentRepo.updateCommentById(
    params.commentId, 
    params.data
  );
  
  if (!comment) {
    throw new HttpError({
      statusCode: 404,
      message: 'Comment not found'
    });
  }

  // WEBSOCKETS - Треба додати WebSocket або видалити цей контроллер якщо він не використовується.
  
  return comment;
} 