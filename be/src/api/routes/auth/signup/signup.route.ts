import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { SignupReqSchema } from 'src/api/routes/schemas/auth/SignUpReqSchema';
import { getCognitoService } from 'src/services/cognito/cognito.service';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.post('/', {
    schema: {
      body: SignupReqSchema
    }
  }, (req) => {
    return getCognitoService().createNewUser(req.body.email, req.body.password);
  });
};

export default routes; 