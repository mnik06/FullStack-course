import { z } from 'zod';

import { TagSchema } from 'src/types/tag/schemas/Tag';

export const GetTagsRespSchema = z.array(TagSchema);
