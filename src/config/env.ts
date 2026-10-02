import {z} from 'zod';

const envSchema = z.object({
    VITE_API_URL: z.url(),
});

const parsed = envSchema.safeParse(import.meta.env);

if (!parsed.success) {
    const details = parsed.error.issues
        .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
        .join('\n');
    throw new Error(`Invalid environment variables:\n${details}`);
}

export const env = {
    apiUrl: parsed.data.VITE_API_URL.replace(/\/+$/, ''),
};