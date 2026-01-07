import { z } from 'zod';

const EnvSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  PHP_BASE_URL: z.string().url(),
  PHP_APP_ACCESS_TOKEN: z.string().min(10),
});

type RawEnv = z.infer<typeof EnvSchema>;

export type Env = {
  port: number;
  phpBaseUrl: string;
  phpAppAccessToken: string;
};

export default (): Env => {
  const result = EnvSchema.safeParse(process.env);

  if (!result.success) {
    console.error('Invalid environment configuration');

    for (const issue of result.error.issues) {
      console.error(`- ${issue.path.join('.') || 'root'}: ${issue.message}`);
    }

    process.exit(1);
  }

  const env: RawEnv = result.data;

  return {
    port: env.PORT,
    phpBaseUrl: env.PHP_BASE_URL,
    phpAppAccessToken: env.PHP_APP_ACCESS_TOKEN,
  };
};
