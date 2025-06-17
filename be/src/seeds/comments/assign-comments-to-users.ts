import { executeSeed, getDbConnection } from '../seeds.utils';
import { userTable, postTable } from 'src/services/drizzle/schema';
import { sql } from 'drizzle-orm';
import { getCommentRepo } from 'src/repos/comment.repo';

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

async function assignCommentsToUsers() {
  const users = await getRandomUsers();
  if (users.length === 0) {
    console.log('No users found in the database');
    return;
  }
  
  const db = getDbConnection();
  const commentRepo = getCommentRepo(db);
  
  // Get all posts
  const posts = await db.select().from(postTable);
  if (posts.length === 0) {
    console.log('No posts found in the database');
    return;
  }

  let totalCommentsAssigned = 0;

  // For each post, get its comments and assign them to random users
  for (const post of posts) {
    const comments = await commentRepo.getCommentsByPostId(post.id);
    
    if (comments.length === 0) {
      continue;
    }

    // Distribute comments equally among users
    for (let i = 0; i < comments.length; i++) {
      const userIndex = i % users.length;
      const user = users[userIndex];
      
      await commentRepo.updateCommentById(comments[i].id, {
        userId: user.id
      });
      totalCommentsAssigned++;
    }
  }
  
  console.log(`Successfully assigned ${totalCommentsAssigned} comments to ${users.length} users`);
  return users;
}

executeSeed(assignCommentsToUsers);
