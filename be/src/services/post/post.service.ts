import { TPost } from 'src/types/post/schemas/Post';
import { FastifyInstance, FastifyRequest } from 'fastify';
interface IPostService {
  calculateReadingTime(post: Pick<TPost, 'title' | 'description'>): number;
  checkIsPostOwner(fastify: FastifyInstance, request: FastifyRequest): Promise<boolean>;
  checkIsCommentOwner(fastify: FastifyInstance, request: FastifyRequest): Promise<boolean>;
}

export function getPostService(): IPostService {
  return {
    calculateReadingTime(post) {
      const totalWordCount = `${post.title} ${post.description}`?.split(' ').length ?? 0;

      return Math.ceil(totalWordCount / 200);
    },

    async checkIsPostOwner (fastify, request) {
      const post = await fastify.repos.postRepo
        .getPostById((request.params as { postId: string }).postId);
  
      return post?.userId === request.user?.id as string;
    },

    async checkIsCommentOwner (fastify, request) {
      const comment = await fastify.repos.commentRepo
        .getCommentById((request.params as { commentId: string }).commentId);

      return comment?.userId === request.user?.id as string;
    }
  };
}