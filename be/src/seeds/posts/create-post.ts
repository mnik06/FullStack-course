import { fakerEN as faker } from '@faker-js/faker';
import { createReadlineInterface, getNumberInput, getDbConnection, executeSeed } from '../seeds.utils';
import { getPostRepo } from 'src/repos/post.repo';
import { createPost } from 'src/controllers/post/create-post';

async function getInput(): Promise<number> {
  const rl = createReadlineInterface();

  try {
    const count = await getNumberInput(rl, 'Enter the number of posts to create: ');
    return count;
  } finally {
    rl.close();
  }
}

async function createPosts(numberOfPosts: number) {
  console.log(`Starting to create ${numberOfPosts} posts...`);
  
  const db = getDbConnection();
  const postsData = Array.from({ length: numberOfPosts }, () => ({
    title: faker.company.catchPhrase(),
    description: faker.lorem.paragraphs({ min: 3, max: 5 })
  }));

  for (const post of postsData) {
    await createPost({
      postRepo: getPostRepo(db),
      data: post
    });
  }
}

executeSeed(async () => {
  const numberOfPosts = await getInput();
  return createPosts(numberOfPosts);
});