import {
  AdminCreateUserCommand, 
  AdminSetUserPasswordCommand,
  AttributeType,
  CognitoIdentityProviderClient, 
  GetUserCommand
} from '@aws-sdk/client-cognito-identity-provider';
import { TIdentityUser } from 'src/types/IdentityUser';
import { IIdentityService } from 'src/types/services/IIdentityService';

function getIdentityUserByAttributes(attributes: AttributeType[]): TIdentityUser {
  const transformedAttributes = attributes.reduce((acc, attribute) => {
    if (attribute.Name) {acc[attribute.Name] = attribute.Value as string;}

    return acc;
  }, {} as Record<string, string>);

  return {
    email: transformedAttributes.email,
    subId: transformedAttributes.sub
  };
}

export function getCognitoService(): IIdentityService {
  const client = new CognitoIdentityProviderClient({
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
    }
  });

  return {
    async createNewUser({ email, password, userAttributes }) {
      const createUserCommand = new AdminCreateUserCommand({
        UserPoolId: process.env.COGNITO_USER_POOL_ID!,
        Username: email,
        TemporaryPassword: password,
        MessageAction: 'SUPPRESS',
        UserAttributes: [
          {
            Name: 'email',
            Value: email
          },
          ...Object.entries(userAttributes ?? {}).map(([key, value]) => ({
            Name: key,
            Value: value
          }))
        ]
      });
      const setUserPasswordCommand = new AdminSetUserPasswordCommand({
        UserPoolId: process.env.COGNITO_USER_POOL_ID!,
        Username: email,
        Password: password,
        Permanent: true
      });

      const res = await client.send(createUserCommand);

      if (res.User) {
        await client.send(setUserPasswordCommand);
      }

      return getIdentityUserByAttributes(res.User?.Attributes ?? []);
    },

    async getUserByAccessToken(token: string) {
      const res = await client.send(new GetUserCommand({
        AccessToken: token
      }));

      return getIdentityUserByAttributes(res.UserAttributes ?? []);
    }
  };
}