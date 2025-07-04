import {
  AdminCreateUserCommand, 
  AdminDisableUserCommand, 
  AdminEnableUserCommand, 
  AdminGetUserCommand, 
  AdminSetUserPasswordCommand,
  AttributeType,
  CognitoIdentityProviderClient, 
  GetUserCommand,
  UsernameExistsException
} from '@aws-sdk/client-cognito-identity-provider';
import { EErrorCodes } from 'src/api/errors/EErrorCodes';
import { HttpError } from 'src/api/errors/HttpError';
import { TIdentityUser } from 'src/types/IdentityUser';
import { IIdentityService } from 'src/types/services/IIdentityService';

function getIdentityUserByAttributes(
  attributes: AttributeType[], 
  isActive?: boolean
): TIdentityUser {
  const transformedAttributes = attributes.reduce((acc, attribute) => {
    if (attribute.Name) {acc[attribute.Name] = attribute.Value as string;}

    return acc;
  }, {} as Record<string, string>);

  const res: TIdentityUser = {
    email: transformedAttributes.email,
    subId: transformedAttributes.sub
  };

  if (isActive !== undefined) {
    res.isActive = isActive;
  }

  return res;
}

export function getCognitoService(): IIdentityService {
  const client = new CognitoIdentityProviderClient();

  return {
    async createNewUser({ email, password }) {
      const res = await this.createNewPendingUser({ email });
  
      if (res) {
        await this.setUserPassword({ email, password });
      }
        
      return res;
    },

    async createNewPendingUser({ email }) {
      const createUserCommand = new AdminCreateUserCommand({
        UserPoolId: process.env.COGNITO_USER_POOL_ID!,
        Username: email,
        MessageAction: 'SUPPRESS',
        UserAttributes: [
          {
            Name: 'email',
            Value: email
          },
          {
            Name: 'email_verified',
            Value: 'true'
          }
        ]
      });

      try {
        const res = await client.send(createUserCommand);

        return getIdentityUserByAttributes(res.User?.Attributes ?? []);
      } catch (error) {
        if (error instanceof UsernameExistsException) {
          throw new HttpError({
            statusCode: 400,
            message: 'User already exists',
            cause: error,
            errorCode: EErrorCodes.USER_ALREADY_EXISTS
          });
        }

        throw new HttpError({
          statusCode: 400,
          message: 'Failed to create user in cognito'
        });
      }
    },

    async setUserPassword({ email, password }) {
      const setUserPasswordCommand = new AdminSetUserPasswordCommand({
        UserPoolId: process.env.COGNITO_USER_POOL_ID!,
        Username: email,
        Password: password,
        Permanent: true
      }); 

      await client.send(setUserPasswordCommand);
    },

    async getUserByAccessToken(token: string) {
      const res = await client.send(new GetUserCommand({
        AccessToken: token
      }));

      return getIdentityUserByAttributes(res.UserAttributes ?? []);
    },

    async getUserByEmail(email: string) {
      const adminGetUserRes = await client.send(new AdminGetUserCommand({
        Username: email,
        UserPoolId: process.env.COGNITO_USER_POOL_ID!
      }));

      return getIdentityUserByAttributes(
        adminGetUserRes.UserAttributes ?? [], 
        adminGetUserRes.Enabled
      );
    },
    async disableUser(email: string) {
      await client.send(new AdminDisableUserCommand({
        Username: email,
        UserPoolId: process.env.COGNITO_USER_POOL_ID!
      }));
    },

    async enableUser(email: string) {
      await client.send(new AdminEnableUserCommand({
        Username: email,
        UserPoolId: process.env.COGNITO_USER_POOL_ID!
      }));
    }
  };
}