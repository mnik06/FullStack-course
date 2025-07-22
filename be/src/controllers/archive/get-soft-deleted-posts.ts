import { IPostRepo } from 'src/types/repos/IPostRepo';

export async function getSoftDeletedPosts(params: {
  postRepo: IPostRepo,
}) {
  return await params.postRepo.getSoftDeletedPosts();
}
