import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Hero } from './hero';

describe('Hero Component', () => {
  it('renders eyebrow, main headline, and action links', () => {
    render(<Hero />);

    expect(screen.getByText(/ai communication assistant/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/say what you mean/i);
    expect(screen.getByRole('link', { name: /generate a message/i })).toHaveAttribute('href', '#generator');
    expect(screen.getByRole('link', { name: /see how it works/i })).toHaveAttribute('href', '#how-it-works');
  });
});
