import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TransformationSection } from './transformation-section';

describe('TransformationSection Component', () => {
  it('renders raw thought, applied context, and calibrated message', () => {
    render(<TransformationSection />);

    expect(screen.getByText(/from raw hesitation to calibrated clarity/i)).toBeInTheDocument();
    expect(screen.getByText(/01 — raw thought/i)).toBeInTheDocument();
    expect(screen.getByText(/02 — conveyra message/i)).toBeInTheDocument();
    expect(screen.getByText(/recipient: client/i)).toBeInTheDocument();
  });
});
