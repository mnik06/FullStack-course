import {
  AdminCreateUserCommand, 
  AdminCreateUserCommandOutput, 
  AdminSetUserPasswordCommand,
  AttributeType,
  CognitoIdentityProviderClient 
} from '@aws-sdk/client-cognito-identity-provider';

export interface ICognitoService {
  createNewUser(params: {
    email: string, 
    password: string, 
    userAttributes?: Record<string, string>
  }): Promise<AdminCreateUserCommandOutput>;
  transformAttributes(attributes: AttributeType[]): Record<string, string>;
}

export function getCognitoService(): ICognitoService {
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

      return res;
    },

    transformAttributes(attributes) {
      return attributes.reduce((acc, attribute) => {

        if (attribute.Name && attribute.Name !== 'email') {
          acc[attribute.Name] = attribute.Value as string;
        }

        return acc;
      }, {} as Record<string, string>);
    }
  };
}