import { executeSeed, getDbConnection } from '../seeds.utils';
import { userTable } from 'src/services/drizzle/schema';
import { sql } from 'drizzle-orm';
import { getPostRepo } from 'src/repos/post.repo';
import { TUserProfile } from 'src/types/user-profile/schemas/UserProfile';

async function getRandomUsers() {
  const db = getDbConnection();
  const totalUsers = await db.select({ count: sql`count(*)` }).from(userTable);
  const totalCount = Number(totalUsers[0].count);
  
  // Select 5 users or all if less than 5 exist
  const limit = Math.min(5, totalCount);
  
  // Generate random offset between 0 and (totalCount - limit)
  const randomOffset = Math.floor(Math.random() * Math.max(0, totalCount - limit));

  const users = await db.select().from(userTable).limit(limit).offset(randomOffset);
  return users;
}

async function assignPostsToUsers() {
  const users = await getRandomUsers();
  if (users.length === 0) {
    console.log('No users found in the database');
    return;
  }
  
  const postRepo = getPostRepo(getDbConnection());
  const postsResponse = await postRepo.getPosts();
  const posts = postsResponse.data;
  
  if (posts.length === 0) {
    console.log('No posts found in the database');
    return;
  }

  // Distribute posts equally among users
  for (let i = 0; i < posts.length; i++) {
    const userIndex = i % users.length;
    const user = users[userIndex];
    
    await postRepo.updatePostById(posts[i].id, {
      userId: user.id
    }, user as TUserProfile);
  }
  
  console.log(`Successfully assigned ${posts.length} posts to ${users.length} users`);
  return users;
}

executeSeed(assignPostsToUsers);
