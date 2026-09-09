import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { HowItWorks } from './how-it-works';

describe('HowItWorks Component', () => {
  it('renders all 3 methodology stages', () => {
    render(<HowItWorks />);

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/how it works/i);
    expect(screen.getByText('Describe')).toBeInTheDocument();
    expect(screen.getByText('Calibrate')).toBeInTheDocument();
    expect(screen.getByText('Communicate')).toBeInTheDocument();
  });
});
