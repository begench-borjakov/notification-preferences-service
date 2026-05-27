import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'test', 'production').default('development'),
  PORT: Joi.number().port().default(3000),
  DATABASE_URL: Joi.when('NODE_ENV', {
    is: 'test',
    then: Joi.string().optional(),
    otherwise: Joi.string().required(),
  }),
});
