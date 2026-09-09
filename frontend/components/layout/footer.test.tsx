import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Footer } from './footer';

describe('Footer Component', () => {
  it('renders brand logo and footer links', () => {
    render(<Footer />);

    expect(screen.getByLabelText(/conveyra homepage/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /workspace/i })).toHaveAttribute('href', '#generator');
    expect(screen.getByRole('link', { name: /method/i })).toHaveAttribute('href', '#how-it-works');
    expect(screen.getByRole('link', { name: /use cases/i })).toHaveAttribute('href', '#use-cases');
  });
});
