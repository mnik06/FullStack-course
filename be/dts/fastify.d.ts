import { TRepos } from 'src/repos';
import { IUUIDService } from 'src/services/uuid';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { IIdentityService } from 'src/types/IIdentityService';
import { IMailService } from 'src/types/IMailService';
import { IdentityUser } from 'src/types/IdentityUser';
import { IStorageService } from 'src/types/IStorageService';

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
    identityUser?: IdentityUser;
  }
}