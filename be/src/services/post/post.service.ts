import { TPost } from 'src/types/post/schemas/Post';

interface IPostService {
  calculateReadingTime(post: Partial<TPost>): number;

}

export function getPostService(): IPostService {
  return {
    calculateReadingTime(post: TPost) {
      const totalWordCount = `${post.title} ${post.description}`?.split(' ').length ?? 0;

      return Math.ceil(totalWordCount / 200);
    }
  };
}