import { fakerEN as faker } from '@faker-js/faker';
import { createReadlineInterface, getNumberInput, question, getDbConnection, executeSeed } from '../seeds.utils';
import { getCommentRepo } from 'src/repos/comment.repo';
import { createComment } from 'src/controllers/comment/create-comment';

interface ICommentSeedInput {
  postId: string;
  numberOfComments: number;
}

async function getInput(): Promise<ICommentSeedInput> {
  const rl = createReadlineInterface();
  try {
    const postId = await question(rl, 'Enter the post ID: ');
    if (!postId) {
      throw new Error('Post ID is required');
    }

    const numberOfComments = await getNumberInput(rl, 'Enter the number of comments to create: ');
    return { postId, numberOfComments };
  } finally {
    rl.close();
  }
}

async function createComments(postId: string, numberOfComments: number) {
  console.log(`Starting to create ${numberOfComments} comments for post ${postId}...`);

  const db = getDbConnection();
  const commentsData = Array.from({ length: numberOfComments }, () => ({
    text: faker.hacker.phrase(),
    postId
  }));

  for (const comment of commentsData) {
    await createComment({
      commentRepo: getCommentRepo(db),
      data: comment
    });
  }
}

executeSeed(async () => {
  const { postId, numberOfComments } = await getInput();
  return createComments(postId, numberOfComments);
});