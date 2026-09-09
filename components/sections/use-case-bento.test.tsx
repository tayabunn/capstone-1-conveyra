import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { UseCaseBento } from './use-case-bento';

describe('UseCaseBento Component', () => {
  it('renders all 4 communication dynamic scenarios', () => {
    render(<UseCaseBento />);

    expect(screen.getByText('Clients')).toBeInTheDocument();
    expect(screen.getByText('Work')).toBeInTheDocument();
    expect(screen.getByText('Feedback')).toBeInTheDocument();
    expect(screen.getByText('Personal')).toBeInTheDocument();

    expect(screen.getByText(/set boundaries without damaging relationships/i)).toBeInTheDocument();
    expect(screen.getByText(/ask clearly without over-explaining/i)).toBeInTheDocument();
    expect(screen.getByText(/say difficult things constructively/i)).toBeInTheDocument();
    expect(screen.getByText(/express yourself without losing your meaning/i)).toBeInTheDocument();
  });
});
