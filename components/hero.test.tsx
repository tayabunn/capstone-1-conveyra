import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Hero } from './hero';

describe('Hero Component', () => {
  it('renders eyebrow, main headline, and action links', () => {
    render(<Hero />);

    expect(screen.getByText(/ai communication/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/say what you mean/i);
    expect(screen.getByRole('link', { name: /start calibrating free/i })).toHaveAttribute('href', '/app');
    expect(screen.getByRole('link', { name: /try interactive demo/i })).toHaveAttribute('href', '#demo');
  });
});
