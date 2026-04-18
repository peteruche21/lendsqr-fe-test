import { describe, expect, it } from 'vitest';
import { validateEmail, validatePassword } from './validation';

describe('validation utilities', () => {
    it('accepts a valid email and password', () => {
        expect(validateEmail('person@lendsqr.com')).toBeUndefined();
        expect(validatePassword('password1')).toBeUndefined();
    });

    it('returns the required email message before format validation', () => {
        expect(validateEmail('')).toBe('Email is required.');
    });

    it('returns an email format message for malformed emails', () => {
        expect(validateEmail('not-an-email')).toBe('Enter a valid email address.');
    });

    it('requires a password and enforces the minimum length', () => {
        expect(validatePassword('')).toBe('Password is required.');
        expect(validatePassword('short')).toBe('Password must be at least 8 characters.');
    });
});
