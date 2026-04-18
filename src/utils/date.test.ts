import { describe, expect, it } from 'vitest';
import { formatUserDate } from './date';

describe('formatUserDate', () => {
    it('formats ISO dates with a long month and 12-hour time', () => {
        expect(formatUserDate('2020-01-01T08:00:00.000Z')).toBe('January 01, 2020 09:00 AM');
    });

    it('keeps PM values in the expected assessment display format', () => {
        expect(formatUserDate('2020-02-01T20:00:00.000Z')).toBe('February 01, 2020 09:00 PM');
    });
});
