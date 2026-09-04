import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Header } from './header';

describe('Header Component', () => {
  it('renders logo, navigation links, and generate button', () => {
    render(<Header />);

    expect(screen.getByLabelText(/conveyra homepage/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /how it works/i })).toHaveAttribute('href', '#how-it-works');
    expect(screen.getByRole('link', { name: /use cases/i })).toHaveAttribute('href', '#use-cases');
    expect(screen.getByRole('link', { name: /generate/i })).toHaveAttribute('href', '#generator');
  });
});
