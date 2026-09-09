import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockImplementation(() => Promise.resolve()),
  },
});

// Mock Next.js scroll
window.scrollTo = vi.fn();
