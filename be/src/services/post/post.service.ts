import { HttpError } from 'src/api/errors/HttpError';
import { TPost } from 'src/types/post/schemas/Post';
import { IPostRepo } from 'src/types/repos/IPostRepo';

interface IPostService {
  calculateReadingTime(post: Partial<TPost>): number;
  validatePostAccess(
    params: { postRepo: IPostRepo, postId: string, userId: string }
  ): Promise<boolean>;
}

export function getPostService(): IPostService {
  return {
    calculateReadingTime(post: TPost) {
      const totalWordCount = `${post.title} ${post.description}`?.split(' ').length ?? 0;

      return Math.ceil(totalWordCount / 200);
    },

    async validatePostAccess(params) {
      const post = await params.postRepo.getPostById(params.postId);

      if (post && post.userId !== params.userId) {
        throw new HttpError(403, 'Permission denied');
      }

      return true;
    }
  };
}