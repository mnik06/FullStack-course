import { IPostRepo } from 'src/types/repos/IPostRepo';
import { ICommentRepo } from 'src/types/repos/ICommentRepo';

export async function getPosts(params: {
  postRepo: IPostRepo;
  commentRepo: ICommentRepo;
}) {
  const posts = await params.postRepo.getPosts();
  
  const postsWithCommentsCount = await Promise.all(
    posts.map(async (post) => {
      const comments = await params.commentRepo.getCommentsByPostId(post.id);
      return {
        ...post,
        commentsCount: comments.length
      };
    })
  );
  
  return postsWithCommentsCount;
} 