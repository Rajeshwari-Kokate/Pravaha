import { beforeEach, vi } from 'vitest';

// Mock matchMedia for JSDOM
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock secure context for clipboard API
Object.defineProperty(window, 'isSecureContext', {
  writable: true,
  value: true,
});

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  document.documentElement.className = '';
});
