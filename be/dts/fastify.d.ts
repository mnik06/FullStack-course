import { TRepos } from 'src/repos';
import { IUUIDService } from 'src/services/uuid';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { IMailService } from 'src/types/IMailService';
import { IStorageService } from 'src/types/IStorageService';
import { IIdentityService } from 'src/services/cognito/cognito.service';
import { TUser } from 'src/types/user/schemas/User';

// set context type
declare module 'fastify' {
  interface FastifyInstance {
    uuid: IUUIDService;
    db: NodePgDatabase;
    repos: TRepos;
    identityService: IIdentityService,
    mailService: IMailService,
    storageService: IStorageService
  }

  interface FastifyRequest {
    user?: TUser;
  }
}