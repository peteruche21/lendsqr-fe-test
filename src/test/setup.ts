import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Automatically cleanup after each test to prevent memory leaks and state pollution
afterEach(() => {
    cleanup();
});

const localStorageMap = new Map<string, string>();

// Mocking window members that might be missing in jsdom or needed for persistence
Object.defineProperty(window, 'localStorage', {
    value: {
        getItem: vi.fn((key: string) => localStorageMap.get(key) ?? null),
        setItem: vi.fn((key: string, value: string) => {
            localStorageMap.set(key, value);
        }),
        removeItem: vi.fn((key: string) => {
            localStorageMap.delete(key);
        }),
        clear: vi.fn(() => {
            localStorageMap.clear();
        }),
    },
    writable: true,
});

// Mock matchMedia for any responsive standard checks
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // deprecated
        removeListener: vi.fn(), // deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});
