import { z } from 'zod';

const emailSchema = z.string().trim().min(1, 'Email is required.').pipe(z.email('Enter a valid email address.'));

const passwordSchema = z.string().min(1, 'Password is required.').min(8, 'Password must be at least 8 characters.');

function getFirstIssueMessage(result: z.ZodSafeParseResult<string>): string | undefined {
    return result.success ? undefined : result.error.issues[0]?.message;
}

export function validateEmail(value: string): string | undefined {
    return getFirstIssueMessage(emailSchema.safeParse(value));
}

export function validatePassword(value: string): string | undefined {
    return getFirstIssueMessage(passwordSchema.safeParse(value));
}
