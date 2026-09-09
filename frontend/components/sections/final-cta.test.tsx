import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FinalCta } from './final-cta';

describe('FinalCta Component', () => {
  it('renders final call to action heading and anchor link', () => {
    render(<FinalCta />);

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/find the right words/i);
    expect(screen.getByRole('link', { name: /start calibrating with conveyra/i })).toHaveAttribute('href', '/app');
  });
});
