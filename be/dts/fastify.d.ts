import { TRepos } from 'src/repos';
import { IUUIDService } from 'src/services/uuid';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { IMailService } from 'src/types/IMailService';
import { IStorageService } from 'src/types/IStorageService';
import { IIdentityService } from 'src/types/services/IIdentityService';
import { TUserProfile } from 'src/types/user-profile/schemas/UserProfile';
import { ISignatureService } from 'src/types/services/ISignatureService';

// set context type
declare module 'fastify' {
  interface FastifyInstance {
    uuid: IUUIDService;
    db: NodePgDatabase;
    repos: TRepos;
    identityService: IIdentityService,
    mailService: IMailService,
    storageService: IStorageService,
    signatureService: ISignatureService
  }

  interface FastifyRequest {
    user?: TUserProfile;
    skipAuth?: boolean;
  }

  interface FastifyContextConfig {
    skipAuth?: boolean;
  }
}