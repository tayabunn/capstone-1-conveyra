import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Header } from './header';

vi.mock('@/lib/auth/session', () => ({
  getCurrentUser: vi.fn().mockResolvedValue(null),
}));

describe('Header Component', () => {
  it('renders logo, navigation links, and auth buttons', async () => {
    const Component = await Header();
    render(Component);

    expect(screen.getByLabelText(/conveyra homepage/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /how it works/i })).toHaveAttribute('href', '#how-it-works');
    expect(screen.getByRole('link', { name: /use cases/i })).toHaveAttribute('href', '#use-cases');
    expect(screen.getByRole('link', { name: /sign in/i })).toHaveAttribute('href', '/sign-in');
    expect(screen.getByRole('link', { name: /start writing/i })).toHaveAttribute('href', '/sign-up');
  });
});
