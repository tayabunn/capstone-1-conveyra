import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ResultShowcase } from './result-showcase';

describe('ResultShowcase Component', () => {
  it('renders output preview, why it works, and alternative approach', () => {
    render(<ResultShowcase />);

    expect(screen.getByText(/complete communication intelligence/i)).toBeInTheDocument();
    expect(screen.getByText(/why this works/i)).toBeInTheDocument();
    expect(screen.getByText(/alternative approach/i)).toBeInTheDocument();
  });
});
